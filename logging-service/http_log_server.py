from flask import Flask, request
import json
import os
from glob import glob
import time
import threading
import logging
import requests
from prometheus_client import Counter as PrometheusCounter, Histogram, start_http_server
from collections import Counter as CollectionsCounter
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

app = Flask(__name__)

# Prometheus metrics
request_counter = PrometheusCounter('logging_service_requests_total', 'Total requests received', ['endpoint'])
error_counter = PrometheusCounter('logging_service_errors_total', 'Total errors', ['type'])
latency_histogram = Histogram('logging_service_request_latency', 'Request latency', ['endpoint'])

# Create service logs directory
os.makedirs('/app/service_logs', exist_ok=True)

# Configure logging to write only to /app/service_logs/service.log
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/service_logs/service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Elasticsearch endpoint
ES_URL = 'http://elasticsearch:9200/kong-logs/_doc'

# JSON log files from File Log plugin
JSON_LOG_FILES = [
    'auth-login.log', 'auth-logout.log', 'auth-refresh.log', 'auth-register.log',
    'manga.log', 'media.log', 'novel.log'
]

def send_to_elasticsearch(log):
    try:
        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1, status_forcelist=[502, 503, 504])
        session.mount('http://', HTTPAdapter(max_retries=retries))
        
        response = session.post(ES_URL, json=log, timeout=5)
        response.raise_for_status()
        logger.info(f"Sent log to Elasticsearch: {log['request']['uri']}")
    except requests.RequestException as e:
        logger.error(f"Failed to send log to Elasticsearch: {str(e)}")
        error_counter.labels(type='elasticsearch').inc()

def process_file_logs():
    """Process JSON File Log plugin logs from /app/logs"""
    processed_files = {}
    while True:
        try:
            for log_file in glob('/app/logs/*.log'):
                file_name = os.path.basename(log_file)
                if file_name not in JSON_LOG_FILES:
                    logger.debug(f"Skipping non-JSON log file: {file_name}")
                    continue
                logger.debug(f"Processing log file: {file_name}")
                file_pos = processed_files.get(log_file, 0)
                try:
                    with open(log_file, 'r') as f:
                        f.seek(file_pos)
                        for line in f:
                            try:
                                log = json.loads(line.strip())
                                send_to_elasticsearch(log)
                                request_counter.labels(endpoint=log['request']['uri']).inc()
                            except json.JSONDecodeError as e:
                                logger.warning(f"Invalid JSON in {file_name}: {str(e)}")
                                error_counter.labels(type='json_parse').inc()
                            except KeyError as e:
                                logger.warning(f"Missing key in log {file_name}: {str(e)}")
                                error_counter.labels(type='key_error').inc()
                        processed_files[log_file] = f.tell()
                except IOError as e:
                    logger.error(f"Error reading {file_name}: {str(e)}")
                    error_counter.labels(type='file_read').inc()
        except Exception as e:
            logger.error(f"Error processing file logs: {str(e)}")
            error_counter.labels(type='file_processing').inc()
        time.sleep(60)

@app.route('/logs', methods=['POST'])
def receive_logs():
    start_time = time.time()
    try:
        log_data = request.get_json()
        if not log_data:
            error_counter.labels(type='invalid_request').inc()
            return {"status": "error", "message": "Invalid JSON"}, 400
        logger.info(f"Received HTTP log: {json.dumps(log_data, indent=2)}")
        try:
            with open('/app/logs/logs.json', 'a') as f:
                f.write(json.dumps(log_data) + '\n')
        except IOError as e:
            logger.error(f"Failed to write to logs.json: {str(e)}")
            error_counter.labels(type='file_write').inc()
        send_to_elasticsearch(log_data)
        request_counter.labels(endpoint=log_data.get('request', {}).get('uri', 'unknown')).inc()
        latency_histogram.labels(endpoint=log_data.get('request', {}).get('uri', 'unknown')).observe(time.time() - start_time)
        return {"status": "success"}, 200
    except Exception as e:
        logger.error(f"Error processing HTTP log: {str(e)}")
        error_counter.labels(type='http_processing').inc()
        return {"status": "error", "message": str(e)}, 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    counts = CollectionsCounter()
    latencies = CollectionsCounter()
    errors = CollectionsCounter()
    clients = CollectionsCounter()
    try:
        for log_file in glob('/app/logs/*.log'):
            if os.path.basename(log_file) not in JSON_LOG_FILES:
                continue
            try:
                with open(log_file, 'r') as f:
                    for line in f:
                        try:
                            log = json.loads(line.strip())
                            uri = log['request']['uri']
                            counts[uri] += 1
                            latencies[uri] += log['latencies']['request']
                            if log['response']['status'] >= 400:
                                errors[uri] += 1
                            clients[log.get('client_ip', 'unknown')] += 1
                        except json.JSONDecodeError:
                            continue
            except IOError:
                continue
        avg_latencies = {k: v / counts[k] for k, v in latencies.items() if counts[k]}
        return {
            "request_counts": dict(counts),
            "avg_latencies_ms": dict(avg_latencies),
            "error_counts": dict(errors),
            "client_counts": dict(clients)
        }, 200
    except Exception as e:
        logger.error(f"Error computing metrics: {str(e)}")
        return {"status": "error", "message": str(e)}, 500

@app.route('/disk', methods=['GET'])
def disk_space():
    try:
        stat = os.statvfs('/app/logs')
        free_mb = stat.f_bavail * stat.f_frsize / 1024 / 1024
        return {"free_space_mb": free_mb}, 200
    except Exception as e:
        logger.error(f"Error checking disk space: {str(e)}")
        return {"status": "error", "message": str(e)}, 500

if __name__ == "__main__":
    logger.info("Waiting for Elasticsearch to be ready...")
    for _ in range(10):
        try:
            response = requests.get('http://elasticsearch:9200/_cluster/health', timeout=5)
            if response.status_code == 200:
                logger.info("Elasticsearch is ready")
                break
        except requests.RequestException:
            logger.warning("Elasticsearch not ready, retrying...")
            time.sleep(5)
    else:
        logger.error("Elasticsearch not available after retries")
    
    start_http_server(8001)
    logger.info("Started Prometheus metrics server on port 8001")
    threading.Thread(target=process_file_logs, daemon=True).start()
    logger.info("Started file log processing thread")
    app.run(host='0.0.0.0', port=8080, debug=False)
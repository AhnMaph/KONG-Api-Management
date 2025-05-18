from flask import Flask, request
import json
import datetime

app = Flask(__name__)

# Endpoint to receive logs from Kong
@app.route('/logs', methods=['POST'])
def receive_logs():
    log_data = request.get_json()
    
    # Print the log to the console
    print(f"Received log at {datetime.datetime.now()}: {json.dumps(log_data, indent=2)}")
    
    # Save the log to a file
    with open('logs.json', 'a') as f:
        f.write(json.dumps(log_data) + '\n')
    
    return {"status": "success"}, 200

if __name__ == "__main__":
    # Run the server on port 8080
    app.run(host='0.0.0.0', port=8080, debug=True)
FROM python:3.9-slim

WORKDIR /app
COPY http_log_server.py .
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y logrotate cron gosu

COPY logrotate.conf /etc/logrotate.d/logging-service

RUN mkdir -p /app/logs /app/service_logs && \
    chown -R nobody:nogroup /app/logs /app/service_logs && \
    chmod -R 775 /app/logs /app/service_logs

RUN echo "0 2 * * * root /usr/sbin/logrotate /etc/logrotate.d/logging-service" > /etc/cron.d/logrotate && \
    chmod 644 /etc/cron.d/logrotate

EXPOSE 8080

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]
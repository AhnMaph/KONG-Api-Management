FROM python:3.9-slim

WORKDIR /app

COPY http_log_server.py /app/http_log_server.py

RUN pip install flask

EXPOSE 8080

CMD ["python", "/app/http_log_server.py"]

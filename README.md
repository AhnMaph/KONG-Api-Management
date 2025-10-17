# A Serverless API Management System

This project implements a comprehensive API management system using Kong API Gateway (version 3.6) with PostgreSQL as the backend, managed using Docker Compose. The system is designed to provide a robust, scalable, and secure way to manage APIs in a serverless environment.

## Team Members
- **Doan Duc Anh** 
- **Pham Thanh An**
- **Nguyen Van Hung** 

## Features
- **Kong API Gateway**: Uses the official `kong:3.6` image for API management
- **PostgreSQL Backend**: Stores Kong configurations in a PostgreSQL database
- **Admin API Configuration**: Dynamic configuration of services and routes
- **Makefile Targets**: Includes `up`, `down`, `reset`, `logs`, `health`, `status`, and `clean` for streamlined operations
- **Docker Compose**: Manages `db`, `kong-migrations`, and `kong` services
- **Logging Service**: Integrated logging system for monitoring and debugging
- **Prometheus Monitoring**: Metrics collection and monitoring capabilities
- **Alert Rules**: Configurable alerting system for system events

## Prerequisites
- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **jq**: For parsing JSON in the `health` target
- **Internet Access**: To pull required Docker images

## Project Structure
```
project-root/
├── .env                  # Environment variables
├── POSTGRES_PASSWORD     # PostgreSQL password
├── docker-compose.yml    # Docker Compose configuration
├── Makefile             # Automation tasks
├── kong/               # Kong configuration files
├── kong-logs/         # Kong gateway logs
├── kong-service-logs/ # Service-specific logs
├── logging-service/   # Logging service implementation
├── comic-web/        # Web application
├── config/           # Configuration files
├── json/            # JSON configuration files
├── prometheus.yml   # Prometheus configuration
├── alert.rules.yml  # Alert rules configuration
└── logstash.conf    # Logstash configuration
```

## Quick Start
1. Clone the repository
2. Create `.env` file with required environment variables (see example below)
3. Run `make up` to start all services
4. Access Kong Admin API at `http://localhost:8001`
5. Access Kong Manager at `http://localhost:8002`

### Example .env Configuration
```env
# Kong Configuration
KONG_DOCKER_TAG=kong:3.8
KONG_PG_USER=kong
KONG_PG_DATABASE=kong
KONG_PROXY_PORT=8000
KONG_ADMIN_PORT=8001
KONG_ADMIN_GUI_PORT=8002
KONG_SSL_PROXY_PORT=8443
KONG_SSL_ADMIN_PORT=8444

# PostgreSQL Configuration
POSTGRES_USER=kong
POSTGRES_DB=kong

# Logging Service Configuration
LOGGING_SERVICE_PORT=8081
LOGGING_SERVICE_ADMIN_PORT=8003

# Prometheus Configuration
PROMETHEUS_PORT=9090

# Grafana Configuration
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=admin

# Elasticsearch Configuration
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_MEMORY="-Xms512m -Xmx512m"

# Kibana Configuration
KIBANA_PORT=5601

# Logstash Configuration
LOGSTASH_PORT=5044

# Backend Services Configuration
BACKEND_1_PORT=8000
BACKEND_2_PORT=8001
BACKEND_3_PORT=8002

# Time Zone
TZ=Asia/Ho_Chi_Minh
```
More simple .env
```env
KONG_DOCKER_TAG=kong:3.8
KONG_PG_HOST=kong-db
KONG_PG_USER=kong
KONG_PG_DATABASE=kong
KONG_PROXY_PORT=8000
KONG_ADMIN_PORT=8001
KONG_ADMIN_GUI_PORT=8002
KONG_SSL_PROXY_PORT=8443
KONG_SSL_ADMIN_PORT=8444
```

For detailed setup instructions and configuration, refer to:
- [Kong Documentation](https://docs.konghq.com/gateway/3.6.x/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prometheus Documentation](https://prometheus.io/docs/)

## Makefile Commands
- `make up`: Start all services
- `make down`: Stop all services
- `make reset`: Reset and restart services
- `make logs`: View Kong logs
- `make health`: Check Kong health
- `make status`: Check service status
- `make clean`: Clean up Kong container

## Contact
For any questions or support, please contact:
- Doan Duc Anh: [iluvstudyforever@gmail.com]
- Nguyen Thanh An: [phamthanhanrule123@gmail.com]
- Nguyen Van Hung: [miscitaofvh@gmail.com]

## License
Apache License 2.0

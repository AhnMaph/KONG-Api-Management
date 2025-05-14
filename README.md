# Kong API Gateway with PostgreSQL

This project sets up a Kong API Gateway (version 3.6) with PostgreSQL as the backend, managed using Docker Compose. Configurations are applied dynamically via Kong's Admin API, making it suitable for programmatic or runtime management. The setup includes a Makefile with Kong-specific `status` and `clean` targets for easy management.

## Features
- **Kong API Gateway**: Uses the official `kong:3.6` image.
- **PostgreSQL Backend**: Stores Kong configurations in a PostgreSQL database.
- **Admin API Configuration**: Dynamically configure services and routes (e.g., `quote-service`).
- **Makefile Targets**: Includes `up`, `down`, `reset`, `logs`, `health`, `status`, and `clean` for streamlined operations.
- **Docker Compose**: Manages `db`, `kong-migrations`, and `kong` services.

## Prerequisites
- **Docker**: Version 20.10 or later.
- **Docker Compose**: Version 2.0 or later.
- **jq**: For parsing JSON in the `health` target (install via `apt-get install jq` or equivalent).
- **Internet Access**: To pull `kong:3.6` and `postgres:13` images from Docker Hub.
- **System**: Compatible with Linux, macOS, or Windows (with WSL2 for Windows).

## Project Structure
```
project-root/
├── .env                  # Environment variables
├── POSTGRES_PASSWORD     # PostgreSQL password
├── docker-compose.yml    # Docker Compose configuration
├── Makefile              # Automation tasks
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Configure Environment
- **Create `.env`**:
  ```env
  KONG_DOCKER_TAG=kong:3.6
  KONG_PG_HOST=kong-db
  KONG_PG_USER=kong
  KONG_PG_DATABASE=kong
  KONG_PROXY_PORT=8000
  KONG_ADMIN_PORT=8001
  KONG_ADMIN_GUI_PORT=8002
  KONG_SSL_PROXY_PORT=8443
  KONG_SSL_ADMIN_PORT=8444
  ```

- **Create `POSTGRES_PASSWORD`**:
  ```text
  your_secure_password
  ```
  Secure the file:
  ```bash
  chmod 600 POSTGRES_PASSWORD
  ```

### 3. Create Docker Compose Configuration
- **Create `docker-compose.yml`**:
  ```yaml
  version: '3.9'

  x-kong-config: &kong-env
    KONG_DATABASE: postgres
    KONG_PG_HOST: ${KONG_PG_HOST}
    KONG_PG_USER: ${KONG_PG_USER}
    KONG_PG_PASSWORD_FILE: /run/secrets/kong_postgres_password
    KONG_PG_DATABASE: ${KONG_PG_DATABASE}
    KONG_PROXY_ACCESS_LOG: /dev/stdout
    KONG_PROXY_ERROR_LOG: /dev/stderr
    KONG_ADMIN_ACCESS_LOG: /dev/stdout
    KONG_ADMIN_ERROR_LOG: /dev/stderr
    KONG_ADMIN_GUI_LISTEN: 0.0.0.0:${KONG_ADMIN_GUI_PORT}
    KONG_PROXY_LISTEN: 0.0.0.0:${KONG_PROXY_PORT}
    KONG_ADMIN_LISTEN: 0.0.0.0:${KONG_ADMIN_PORT}
    KONG_LOG_LEVEL: info
    # Uncomment for SSL after adding certificates:
    # KONG_PROXY_LISTEN: 0.0.0.0:${KONG_PROXY_PORT}, 0.0.0.0:${KONG_SSL_PROXY_PORT} ssl
    # KONG_ADMIN_LISTEN: 0.0.0.0:${KONG_ADMIN_PORT}, 0.0.0.0:${KONG_SSL_ADMIN_PORT} ssl

  services:
    db:
      image: postgres:13
      environment:
        POSTGRES_USER: ${KONG_PG_USER}
        POSTGRES_DB: ${KONG_PG_DATABASE}
        POSTGRES_PASSWORD_FILE: /run/secrets/kong_postgres_password
      secrets:
        - kong_postgres_password
      volumes:
        - postgres_data:/var/lib/postgresql/data
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U ${KONG_PG_USER} -d ${KONG_PG_DATABASE}"]
        interval: 5s
        timeout: 5s
        retries: 5
      networks:
        kong-net:
          aliases:
            - ${KONG_PG_HOST}
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

    kong-migrations:
      image: ${KONG_DOCKER_TAG}
      command: kong migrations bootstrap && kong migrations up
      depends_on:
        db:
          condition: service_healthy
      environment:
        <<: *kong-env
      secrets:
        - kong_postgres_password
      networks:
        - kong-net
      restart: on-failure

    kong:
      image: ${KONG_DOCKER_TAG}
      depends_on:
        db:
          condition: service_healthy
        kong-migrations:
          condition: service_completed_successfully
      environment:
        <<: *kong-env
      ports:
        - "${KONG_PROXY_PORT}:${KONG_PROXY_PORT}" # Proxy
        - "${KONG_ADMIN_PORT}:${KONG_ADMIN_PORT}" # Admin API
        - "${KONG_ADMIN_GUI_PORT}:${KONG_ADMIN_GUI_PORT}" # Kong Manager
        # Uncomment for SSL after adding certificates:
        # - "${KONG_SSL_PROXY_PORT}:${KONG_SSL_PROXY_PORT}" # SSL Proxy
        # - "${KONG_SSL_ADMIN_PORT}:${KONG_SSL_ADMIN_PORT}" # SSL Admin API
      secrets:
        - kong_postgres_password
      networks:
        - kong-net
      restart: unless-stopped
      logging:
        driver: json-file
        options:
          max-size: "10m"
          max-file: "3"

    # Optional: Uncomment to add quote-service backend
    # quote-service:
    #   image: my-quote-service:latest  # Replace with actual image
    #   ports:
    #     - "8080:8080"
    #   networks:
    #     - kong-net

  volumes:
    postgres_data:

  networks:
    kong-net:
      driver: bridge

  secrets:
    kong_postgres_password:
      file: ./POSTGRES_PASSWORD
  ```

### 4. Create Makefile
- **Create `Makefile`**:
  ```makefile
  .PHONY: up down reset logs health status clean

  include .env
  export

  up:
      docker compose up -d

  down:
      docker compose down

  reset: down
      -docker volume rm $(shell docker volume ls -q | grep postgres_data) || true
      docker compose up -d

  logs:
      docker compose logs -f kong

  health:
      curl -s http://localhost:${KONG_ADMIN_PORT}/status | jq

  status:
      docker compose ps kong

  clean:
      docker compose stop kong || true
      docker compose rm -f kong
  ```

### 5. Start the Services
```bash
make up
```

### 6. Configure Kong via Admin API
- Add a service (e.g., `quote-service`):
  ```bash
  curl -X POST http://localhost:8001/services \
    -H "Content-Type: application/json" \
    -d '{"name": "quote-service", "url": "http://quote-service:8080"}'
  ```
- Add a route for the service:
  ```bash
  curl -X POST http://localhost:8001/services/quote-service/routes \
    -H "Content-Type: application/json" \
    -d '{"name": "quote-service-routes", "paths": ["/"], "strip_path": true}'
  ```

**Note**: The `quote-service` backend (`http://quote-service:8080`) requires a running service. Uncomment the `quote-service` section in `docker-compose.yml` and specify the correct image, or use an external URL (e.g., `http://httpbin.org/get`).

### 7. Verify the Setup
- Check Kong status:
  ```bash
  make status
  ```
  Expected output:
  ```
  Name                     Command               State                   Ports
  --------------------------------------------------------------------------------
  <project>_kong_1   /docker-entrypoint.sh kong ...   Up      0.0.0.0:8000->8000/tcp, ...
  ```
- Check Kong health:
  ```bash
  make health
  ```
  Expected: JSON response from `http://localhost:8001/status`.
- Test the route:
  ```bash
  curl http://localhost:8000/
  ```
- Verify configurations:
  ```bash
  curl http://localhost:8001/services
  curl http://localhost:8001/routes
  ```

## Makefile Targets
- `make up`: Starts all services (`db`, `kong-migrations`, `kong`) in detached mode.
- `make down`: Stops and removes all containers and networks.
- `make reset`: Stops all services, removes the `postgres_data` volume, and restarts services.
- `make logs`: Shows real-time logs for the `kong` service.
- `make health`: Checks Kong's health via the Admin API `/status` endpoint.
- `make status`: Displays the status of the `kong` service.
- `make clean`: Stops and removes the `kong` container, preserving `db` and `postgres_data`.

## quote-service Backend
The example service uses `http://quote-service:8080`. To enable it:
- **Add to Docker Compose**:
  Uncomment the `quote-service` service in `docker-compose.yml` and replace `my-quote-service:latest` with the actual image.
- **Use an External URL**:
  ```bash
  curl -X POST http://localhost:8001/services \
    -H "Content-Type: application/json" \
    -d '{"name": "quote-service", "url": "http://httpbin.org/get"}'
  ```
  Test:
  ```bash
  curl http://localhost:8000/
  ```

## Production Considerations
1. **SSL Configuration**:
   - Create a `config/` directory with SSL certificates:
     ```bash
     mkdir config/ssl
     cp your-cert.crt config/ssl/kong.crt
     cp your-key.key config/ssl/kong.key
     chmod 644 config/ssl/*
     ```
   - Update `docker-compose.yml`:
     ```yaml
     # Add to kong service:
     volumes:
       - ./config:/opt/kong/config
     environment:
       <<: *kong-env
       KONG_SSL_CERT: /opt/kong/config/ssl/kong.crt
       KONG_SSL_CERT_KEY: /opt/kong/config/ssl/kong.key
     ```
     - Uncomment SSL ports and `KONG_*_LISTEN` settings.

2. **Admin API Security**:
   Restrict access:
   ```yaml
   KONG_ADMIN_LISTEN: 127.0.0.1:${KONG_ADMIN_PORT}
   ```

3. **PostgreSQL**:
   - Use a managed PostgreSQL service (e.g., AWS RDS).
   - Enable SSL:
     ```yaml
     # In db environment:
     POSTGRES_SSL_MODE: require
     ```

4. **Logging**:
   Use centralized logging:
   ```yaml
   logging:
     driver: syslog
     options:
       syslog-address: "udp://log-server:514"
   ```

5. **Backup**:
   Back up the `postgres_data` volume:
   ```bash
   docker run --rm -v <project>_postgres_data:/data busybox tar cvf /backup.tar /data
   ```

6. **Time Zone**:
   Set for +07:00 (e.g., Asia/Jakarta):
   ```yaml
   # Add to kong and db services:
   environment:
     <<: *kong-env
     TZ: Asia/Jakarta
   ```

## Troubleshooting
- **Image Pull Fails**:
  - Test: `docker pull kong:3.6`.
  - Check network/DNS:
    ```bash
    ping registry-1.docker.io
    ```
    Update `/etc/resolv.conf` with `nameserver 8.8.8.8` if needed.
  - Log in to Docker Hub:
    ```bash
    docker login
    ```
  - For M1/M2 Macs:
    ```bash
    export DOCKER_DEFAULT_PLATFORM=linux/amd64
    ```

- **Kong Fails to Start**:
  - Check logs: `make logs`.
  - Verify PostgreSQL: `docker compose ps db`.

- **Backend Unreachable**:
  - Ensure `quote-service` is running or use a public URL (e.g., `http://httpbin.org/get`).

- **clean Target Issues**:
  - Run: `make clean`.
  - Verify: `make status` (should show no `kong` container).
  - Check logs if errors occur: `make logs`.

## Contributing
Submit issues or pull requests to the repository at `<your-repo-url>`.

## License
Apache License 2.0

## Contact
Maintainer: Your Name `<your.email@example.com>`
.PHONY: up down reset logs health status clean build rebuild help clean_port_8000 \
        dump sync diff rsync setup

# Load environment variables from .env
include .env
export

# Default port if not set
KONG_ADMIN_PORT ?= 8001

# Default target
.DEFAULT_GOAL := help

# === SETUP ===
setup:
	@echo "Setting up the development environment..."
	@echo ""
	@echo "Requirements:"
	@echo "  - Docker & Docker Compose"
	@echo "  - deck (https://github.com/kong/deck)"
	@echo "  - jq (for formatting JSON output)"
	@echo ""
	@echo "Ensure your .env file contains at least:"
	@echo "  KONG_ADMIN_PORT=8001"
	@echo ""
	@echo "Then run: make up"

# === Docker Compose Commands ===
up:
	docker compose up --build

down:
	docker compose down

reset:
	docker volume rm $(shell docker volume ls -q | grep postgres_data) || true
	docker compose up -d

build:
	docker compose down || true
	docker compose up --build

rebuild:
	docker compose down -v || true
	docker compose up --build

logs:
	docker compose logs -f kong

status:
	docker compose ps kong

clean:
	docker compose stop
	docker compose rm -f kong

clean_port_8000:
	docker ps --format '{{.ID}} {{.Ports}}' | grep '0.0.0.0:8000' | awk '{print $$1}' | xargs -r docker stop

# === DecK (Kong Declarative Configuration) ===
dump:
	deck gateway dump --kong-addr http://localhost:$(KONG_ADMIN_PORT) --output-file kong.yaml

sync:
	deck gateway sync --kong-addr http://localhost:$(KONG_ADMIN_PORT) kong.yaml

diff:
	deck gateway diff --kong-addr http://localhost:$(KONG_ADMIN_PORT) kong.yaml

rsync:
	deck gateway reset --kong-addr http://localhost:$(KONG_ADMIN_PORT)
	deck gateway sync --kong-addr http://localhost:$(KONG_ADMIN_PORT) kong.yaml

health:
	curl -s http://localhost:$(KONG_ADMIN_PORT)/status | jq

# === Help ===
help:
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Setup & Utilities:"
	@echo "  setup               Display setup instructions"
	@echo "  help                Show this help message"
	@echo "  status              Show status of the 'kong' container"
	@echo "  health              Check Kong health status (Admin port $(KONG_ADMIN_PORT))"
	@echo ""
	@echo "Docker Compose:"
	@echo "  up                  Start all services (with build)"
	@echo "  down                Stop and remove all services"
	@echo "  build               Build all containers (with cache)"
	@echo "  rebuild             Rebuild containers from scratch (no cache, remove volumes)"
	@echo "  reset               Remove 'postgres_data' volume and restart services"
	@echo "  logs                Follow logs for the 'kong' service"
	@echo "  clean               Stop and remove only the 'kong' container"
	@echo "  clean_port_8000     Stop any container using port 8000 on host"
	@echo ""
	@echo "DecK CLI:"
	@echo "  dump                Export Kong config to kong.yaml"
	@echo "  sync                Sync kong.yaml to Kong Gateway"
	@echo "  diff                Show config differences between Kong and kong.yaml"
	@echo "  rsync               Reset Kong config and re-sync from kong.yaml"
	@echo ""

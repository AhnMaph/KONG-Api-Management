.PHONY: up down reset logs health status clean

include .env
export

up:
	docker compose up -d

down:
	docker compose down

reset: down
	docker volume rm $(shell docker volume ls -q | grep postgres_data) || true
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
	
.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  up        Start all services in detached mode"
	@echo "  down      Stop and remove all services"
	@echo "  reset     Stop, remove volume, and restart services"
	@echo "  logs      Show logs for the 'kong' service"
	@echo "  health    Check health status of Kong"
	@echo "  status    Show status of Kong container"
	@echo "  clean     Stop and remove Kong container"

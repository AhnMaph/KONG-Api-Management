.PHONY: up down reset logs health status clean build rebuild help

include .env
export

up:
	docker-compose up --build
down:
	docker compose down
reset: 
	docker volume rm $(shell docker volume ls -q | grep postgres_data) || true
	docker compose up -d
build:
	docker compose down || true
	docker compose up --build
rebuild:
	docker-compose down -v || true
	docker-compose up --build
logs:
	docker compose logs -f kong
health:
	curl -s http://localhost:${KONG_ADMIN_PORT}/status | jq

status:
	docker compose ps kong

clean:
	docker compose stop
#	docker-compose down -v
	docker compose rm -f kong
.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  up        Start all services in detached mode"
	@echo "  down      Stop and remove all services"
	@echo "  reset     Stop, remove volume (relate to postgres_data), and restart services"
	@echo "  build     Build all images (maybe) with cache"
	@echo "  rebuild   Rebuild all images without cache"
	@echo "  logs      Show logs for the 'kong' service"
	@echo "  health    Check health status of Kong"
	@echo "  status    Show status of Kong container"
	@echo "  clean     Stop and remove container"

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
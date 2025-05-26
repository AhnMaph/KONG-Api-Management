COMPOSE = docker-compose
DC_FILE = docker-compose.yml

up:
	$(COMPOSE) -f $(DC_FILE) up

down:
	$(COMPOSE) -f $(DC_FILE) down

restart:
	$(MAKE) down
	sleep 2
	$(MAKE) up

logs:
	$(COMPOSE) -f $(DC_FILE) logs -f

build:
	$(COMPOSE) -f $(DC_FILE) build

shell-backend:
	$(COMPOSE) -f $(DC_FILE) exec backend /bin/bash

shell-frontend:
	$(COMPOSE) -f $(DC_FILE) exec frontend /bin/bash

ps:
	$(COMPOSE) -f $(DC_FILE) ps

clean:
	$(COMPOSE) -f $(DC_FILE) down -v --remove-orphans

rebuild: clean build up

add-demo-data:
	mkdir -p backend/media
	python3 backend/novel/import_data.py || true
	python3 backend/manga/import_data.py || true
	python3 backend/chapter/import_unreal_chapter.py
.DEFAULT_GOAL := help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  up               Start containers"
	@echo "  down             Stop containers"
	@echo "  restart          Restart containers"
	@echo "  logs             View logs"
	@echo "  build            Build containers"
	@echo "  shell-backend    Open shell in backend container"
	@echo "  shell-frontend   Open shell in frontend container"
	@echo "  ps               Show container status"
	@echo "  clean            Remove containers, volumes, orphans"
	@echo "  rebuild          Clean, build, and up containers"
	@echo "  add-demo-data    Run backend import demo data"

.PHONY: up down restart logs build shell-backend shell-frontend ps clean rebuild add-data-base help

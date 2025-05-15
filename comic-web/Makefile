# Makefile

COMPOSE=docker-compose
DC_FILE=docker-compose.yml

up:
	$(COMPOSE) -f $(DC_FILE) up

down:
	$(COMPOSE) -f $(DC_FILE) down

restart: down up

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

.PHONY: run stop remove build

include .env
export

run:
	docker run -p 5174:5174 --name frontend_container frontend
stop:
	docker stop frontend_container
remove: 
	docker rm frontend_container
build:
	docker build -t frontend .
rebuild: stop remove build run

.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  run       Start frontend (run build first)"
	@echo "  stop      Stop frontend"
	@echo "  remove    remove container"
	@echo "  build     Build frontend"
	@echo "  Rebuild   Rebuild frontend"

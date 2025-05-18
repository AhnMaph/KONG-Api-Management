.PHONY: run stop remove build

include .env
export

up:
	docker run -p 5174:5174 --name frontend_container frontend
stop:
	docker stop frontend_container || true
	docker rm frontend_container || true
remove: 
	docker rm frontend_container || true
build:
	docker build -t frontend .
rebuild: stop remove build run

.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@echo "  up       Start frontend (run build first)"
	@echo "  stop      Stop frontend"
	@echo "  remove    remove container"
	@echo "  build     Build frontend"
	@echo "  Rebuild   Rebuild frontend"

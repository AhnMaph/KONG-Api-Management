<h1 align="center">CNA Platform</h1>
<h2 align="center">
  
![Version](https://img.shields.io/badge/version-1.0.0-blue) 
![Status](https://img.shields.io/badge/status-in%20development-yellow)
</h2>
<p align="center">
  A full-featured website for Comics, Novels and Audio.
</p>

## I. Overview
This project is a full-featured online platform where users can enjoy:

- 📚 Comics (manga-style graphic stories)
  
- 📖 Novels (text-based stories)

- 🎧 Audio Books (listen to narrated stories)

The system supports different content types seamlessly and offers a smooth reading and listening experience.

Additionally, it features a comprehensive user account system with VIP membership benefits, including premium content access and personalized user experiences.
## II. How to use?
### 1. Install with Docker

### Description

This project uses Docker and Docker Compose to deploy a web application consisting of a backend (Django) and a frontend (React/TypeScript). Using Docker Compose makes it easy to deploy both the backend and frontend services in separate containers.

### Prerequisites

Before getting started, ensure that Docker and Docker Compose are installed on your machine.

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Project Directory Structure

```

├── backend/                  # Backend source code (Django)
├── frontend/                 # Frontend source code (React/TypeScript)
├── docker-compose.yml        # Docker Compose configuration
├── .env                      # Environment variables for the project
└── README.md                 # Project usage guide

````

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/AhnMaph/comics-website
cd comics-website
````

2. **Install dependencies**

Since both the backend and frontend use Docker, you don't need to manually install dependencies. However, you'll need to prepare some configuration files before running Docker Compose.

3. **Configure environment variables**

Create a `.env` file in the root directory of the project and provide the necessary environment variables for your admin account.

```env
SUPERUSER_USERNAME=your_username
SUPERUSER_EMAIL=your_email
SUPERUSER_PASSWORD=your_password

```

### Using Docker Compose

#### 1. **First time start the services**

Run the following command to start all services (backend and frontend) in Docker Compose:

```bash
docker-compose up --build
```

This command will:

* **Rebuild** the containers if necessary (if there are changes in the Dockerfile or source code).
* **Start the services** (backend and frontend) in their respective containers.

After running the command, you can access:

* **Backend (Django)** at `http://127.0.0.1:8000/`.
* **Frontend (React/TypeScript)** at `http://127.0.0.1:5174/`.

Then whenever you want to turn it on just run:

```bash
docker-compose up
```

**If you've already build a container and want to rebuild:**

```bash
docker-compose down
docker-compose build
docker-compose up
```

#### 2. **View logs of services**

To view the logs of the running containers:

```bash
docker-compose logs
```

To view logs of a specific service (e.g., backend):

```bash
docker-compose logs backend
```

#### 3. **Stop the services**

To stop the running containers without shutting them down completely:

```bash
docker-compose stop
```

#### 4. **Shutdown and remove containers**

When you want to stop and remove all containers and their associated resources (volumes if needed), use the following command:

```bash
docker-compose down
```

To also remove volumes (data), use:

```bash
docker-compose down -v
```

#### 5. **Restart the services**

If you want to restart the containers after making changes to configurations or source code, run:

```bash
docker-compose restart
```

### Docker Compose Configuration

The `docker-compose.yml` file in this project configures the following services:

#### Backend (Django)

* This service runs your Django application and exposes port `8000` for external access.
* **Dockerfile**: Uses the Django Dockerfile to set up the environment and install dependencies.

#### Frontend (React/TypeScript)

* This service runs your frontend application (React/TypeScript) and exposes port `5174`.
* **Dockerfile**: Uses the React/TypeScript Dockerfile to build and run the frontend.

### Example `docker-compose.yml` Configuration

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: django-backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./frontend/dist:/app/frontend/dist
    env_file:
      - .env
    command: ["python", "manage.py", "runserver", "0.0.0.0:8000"]

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: typescript-frontend
    ports:
      - "5174:5174"
    volumes:
      - ./frontend:/app
    stdin_open: true
    command: ["npm", "run", "dev"]
```

#### Service Configuration:

* **backend**: This service uses volume mappings to sync the backend source code from the `./backend` folder on the host to the `/app` folder in the container and maps the `./frontend/dist` folder to serve static files.
* **frontend**: This service uses volume mappings to sync the frontend source code from the `./frontend` folder on the host to the `/app` folder in the container.

### Notes

* Make sure the ports defined in `docker-compose.yml` do not conflict with other services running on your machine.
* If you encounter any issues during startup, check the logs of the containers for more details.

---





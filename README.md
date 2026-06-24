# Dockerized App Blueprint

A beginner-friendly Docker starter template — multi-stage Alpine build, non-root security, structured JSON logging, graceful shutdown, and instant hot-reloading via Docker Compose. Clone it, swap in your code, ship it.

---

## 🗺️ Architecture Overview

```text
                                        [ docker-compose up ]
                                                │
                                                ▼
                                    ┌──────────────────────────────┐
                                    │       Docker Compose         │
                                    │    (docker-compose.yml)      │
                                    └──────────────┬───────────────┘
                                                │
                                    ┌──────────────▼───────────────┐
                                    │       DockerFile Build       │
                                    ├──────────────────────────────┤
                                    │  Stage 1 — Builder           │
                                    │   • node:20-alpine           │
                                    │   • npm ci (all deps)        │
                                    │   • Copy source files        │
                                    ├──────────────────────────────┤
                                    │  Stage 2 — Runner            │
                                    │   • node:20-alpine (fresh)   │
                                    │   • npm ci --only=production │
                                    │   • Non-root user (node)     │
                                    │   • NODE_ENV=production      │
                                    └──────────────┬───────────────┘
                                                │
                                    ┌──────────────▼───────────────┐
                                    │     Running Container        │
                                    │      devops-api              │
                                    │   localhost:3000             │
                                    ├──────────────────────────────┤
                                    │  Volume: .:/app (hot reload) │
                                    │  Healthcheck: GET /healthz   │
                                    │  Graceful shutdown: SIGTERM  │
                                    └──────────────────────────────┘
```

---

## 📁 Project Structure

```
Dockerized-App-blueprint/
├─ server.js             # Express app — routes, logging, graceful shutdown
├─ DockerFile            # Multi-stage production build
├─ docker-compose.yml    # Local dev orchestration with hot-reload & healthcheck
├─ package.json          # Dependencies and scripts
├─ .dockerignore         # Files excluded from Docker build context
└─ .gitignore            # Files excluded from Git
```

---

## 🐳 Docker Setup

### Multi-Stage Build

The `DockerFile` uses two stages to keep the production image lean and clean:

- **Builder Stage** (`node:20-alpine`): Installs all dependencies and copies the full codebase
- **Runner Stage** (`node:20-alpine`): Fresh base image — installs only production deps, copies `server.js`, runs as the built-in non-root `node` user

### Docker Compose (Local Dev)

`docker-compose.yml` wires everything up for local development:

| Config | Value |
|---|---|
| Container Name | `devops-api` |
| Port | `3000:3000` |
| Environment | `NODE_ENV=development` |
| Hot Reload | Volume mount `.:/app` — no rebuild needed on file changes |
| Health Check | `GET /healthz` every 30s, 5s timeout, 3 retries |
| Start Command | `npm start` (nodemon) |

---

## 🚀 Quickstart

### Local Dev with Docker Compose (recommended)

```bash
# Start the container with hot-reloading
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the container
docker-compose down
```

The server boots at `http://localhost:3000`. Any file change reflects instantly — no rebuild needed.

### Manual Docker Build

```bash
# Build the production image
docker build -t dockerized-app .

# Run the container
docker run -d -p 3000:3000 --name devops-api dockerized-app

# Check logs
docker logs devops-api

# Stop and remove
docker stop devops-api && docker rm devops-api
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/` | Base route | `{ status, message, environment, timestamp }` |
| `GET` | `/healthz` | Health check | `{ status: "UP", uptime, timestamp }` |
| `*` | `/*` | Catch-all 404 | `{ status: "error", message, timestamp }` |

---

## ⚙️ Key Features

- **Multi-stage Alpine build** — strips dev dependencies and build tools from the final image
- **Non-root execution** — runs as the built-in `node` user, not `root`
- **Structured JSON logging** — every request and server event logged with `timestamp`, `level`, and `message`
- **Graceful shutdown** — listens for `SIGTERM` / `SIGINT`, closes open connections cleanly before exit, force-kills after 10s if needed
- **Hot-reloading** — nodemon + Docker volume mount means zero rebuilds during local dev
- **Health endpoint** — `/healthz` ready for load balancers, Docker, or Kubernetes probes

---

*A blueprint for production-grade Docker setups — built to be cloned, extended, and shipped.*
# Project Memory & Context

This document records all important architectural decisions and their reasoning for future developers and AI agents.

## 📖 Overview

Connects patients with nearby pharmacies to check medication stock. Features user map and pharmacy admin dashboard.

## 🗄️ Database Models

1. **Medicine:** Static drug dictionary (from NIH RxTerms API).
2. **Pharmacy:** Owner account (bcrypt password, location).
3. **Stock:** Maps Pharmacy to Medicine (quantity, price).

### Health Check Endpoint

-  `GET /api/health`.
- Returns JSON with status, uptime, and timestamp.

## 🗺️ Workflows

- **Auth:** `SignupPage.jsx`/`LoginPage.jsx` -> `/api/pharmacy/*`. Returns JWT.
- **Stock:** Pharmacy logs in -> adds stock. Backend adds to `Medicine` if missing, updates `Stock`.
- **Search:** User searches drug -> Backend finds `Medicine` ID -> queries `Stock` -> Frontend plots on Leaflet map.

### Loading State

- Added loading state to the search action.
- Disabled duplicate submissions while requests are in progress.

## 🏗️ Architecture Decisions

### Zero-Config Local Development (June 2026)

- `mongodb-memory-server` is used as an **in-memory database** for local development when `MONGO_URL` is not set.
- It is a **devDependency only** — not installed in production (Render).
- It is **dynamically imported** in `server.js` (`await import(...)`) so the server doesn't crash on Render where the package isn't installed.
- `seedLocalDB.js` auto-seeds fake pharmacies, medicines, and stock into the in-memory DB on startup.

### Render Deployment

- Deployment is configured via the Render dashboard (no `render.yaml` Blueprint in the repo).
- Backend build uses `pnpm install --prod` to skip devDependencies (avoids 800MB mongodb-memory-server download).
- CORS whitelist includes `https://pharmanear-aneu.onrender.com` hardcoded, plus dynamic `CORS_ORIGIN` env var (supports comma-separated values).

### CORS Configuration

- Allowed origins are hardcoded for localhost:5173 and the Render frontend URL.
- Additional origins can be added via the `CORS_ORIGIN` environment variable (comma-separated).

## 🌿 Branching Strategy

- We currently use a single-branch workflow. All active development and pull requests target the `main` branch directly. The CI pipeline runs tests against PRs to `main` to keep everything simple and fast.

### Test Environment (June 2026)

- `server.js` skips all database seeding (`seedFakeData`, medicine fetch, pharmacy seed) when `NODE_ENV === "test"` to prevent `MongoTopologyClosedError` in Jest.

### Package Management Security (June 2026)

- All networked package manager commands (`pnpm install`, `npm`, `pip`, etc.) must be run through the `sfw` (Socket Firewall) tool to protect against malicious dependencies.
- Documented in `agent.md`, `CONTRIBUTING.md`, and `README.md`.
### Enforced pnpm Usage & Lockfile Cleanup (June 2026)

- Removed conflicting `package-lock.json` files from `frontend/` and `backend/` directories to prevent dependency inconsistencies in the pnpm-based monorepo.
- Added a root `.npmrc` file with `engine-strict=true`.
- Configured the `engines` field in the root `package.json` to intentionally block `npm install` commands, enforcing `pnpm` as the exclusive package manager.
### Issue Assignment Policy (June 2026)

- Contributors must only work on issues explicitly assigned to them by a maintainer.
- Enforced via `CONTRIBUTING.md`, `agent.md`, PR template checklist, and issue template warnings.
  
### Backend Modularization Refactor (June 2026)

- `server.js` was refactored from a single monolithic file into a modular folder structure for maintainability and scalability.
- **New structure introduced:**
  - `config/db.js` — Database connection logic extracted from `server.js`
  - `routes/pharmacyRoutes.js` — Pharmacy auth and profile routes
  - `routes/stockRoutes.js` — Stock CRUD routes
  - `routes/drugRoutes.js` — Drug search route
  - `controllers/pharmacyController.js` — Pharmacy business logic
  - `controllers/stockController.js` — Stock business logic
  - `controllers/drugController.js` — Drug search logic
  - `middleware/authMiddleware.js` — JWT authentication middleware extracted from `server.js`
- `server.js` is now responsible only for app initialization, middleware setup, and route mounting.
- **ESM note:** All local imports must include the `.js` extension (e.g. `import Medicine from "../models/medicine.js"`) — omitting it causes `ERR_MODULE_NOT_FOUND` in Node.js ESM mode.
- No breaking changes to existing API endpoints or database models.


**RECORD ANY AND ALL FUTURE ARCHITECTURAL OR IMPORTANT DETAILS IN THIS DOCUMENT.**

---

## 🔗 Related Documentation

- [agent.md](agent.md) - Strict behavioral rules for AI Agents.
- [README.md](README.md) - Tech Stack, Getting Started guide, and folder structure.

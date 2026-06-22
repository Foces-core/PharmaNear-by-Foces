# Project Memory & Context
This document records all important architectural decisions and their reasoning for future developers and AI agents.

## 📖 Overview
Connects patients with nearby pharmacies to check medication stock. Features user map and pharmacy admin dashboard.

## 🗄️ Database Models
1. **Medicine:** Static drug dictionary (from NIH RxTerms API).
2. **Pharmacy:** Owner account (bcrypt password, location).
3. **Stock:** Maps Pharmacy to Medicine (quantity, price).

### Health Check Endpoint 

- Added `GET /api/health`.
- Returns JSON with status, uptime, and timestamp.

## 🗺️ Workflows
- **Auth:** `SignupPage.jsx`/`LoginPage.jsx` -> `/api/pharmacy/*`. Returns JWT.
- **Stock:** Pharmacy logs in -> adds stock. Backend adds to `Medicine` if missing, updates `Stock`.
- **Search:** User searches drug -> Backend finds `Medicine` ID -> queries `Stock` -> Frontend plots on Leaflet map.

## 🏗️ Architecture Decisions

### Zero-Config Local Development (June 2026)
- `mongodb-memory-server` is used as an **in-memory database** for local development when `MONGO_URL` is not set.
- It is a **devDependency only** — not installed in production (Render).
- It is **dynamically imported** in `server.js` (`await import(...)`) so the server doesn't crash on Render where the package isn't installed.
- `seedLocalDB.js` auto-seeds fake pharmacies, medicines, and stock into the in-memory DB on startup.

### Render Deployment
- `render.yaml` defines the Blueprint for auto-deploy.
- Backend build uses `pnpm install --prod` to skip devDependencies (avoids 800MB mongodb-memory-server download).
- CORS whitelist includes `https://pharmanear-aneu.onrender.com` hardcoded, plus dynamic `CORS_ORIGIN` env var (supports comma-separated values).

### CORS Configuration
- Allowed origins are hardcoded for localhost:5173 and the Render frontend URL.
- Additional origins can be added via the `CORS_ORIGIN` environment variable (comma-separated).

## 🌿 Branching Strategy
- We currently use a single-branch workflow. All active development and pull requests target the `main` branch directly. The CI pipeline runs tests against PRs to `main` to keep everything simple and fast.

## 📝 Known Issues
- Currency symbol: Some UI elements still use `$` instead of `₹` (INR). See GitHub Issue #21.
- `<style jsx>` in `PharmacyPage.jsx` is Next.js syntax, not valid in Vite/React — causes a React warning.

**RECORD ANY AND ALL FUTURE ARCHITECTURAL OR IMPORTANT DETAILS IN THIS DOCUMENT.**

---

## 🔗 Related Documentation
- [agent.md](file:///agent.md) - Strict behavioral rules for AI Agents.
- [README.md](file:///README.md) - Tech Stack, Getting Started guide, and folder structure.

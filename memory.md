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

## Vite Development Proxy (June 2026)

- frontend/vite.config.js configures a development server proxy that forwards requests beginning with `/api` to `http://localhost:5000`.
- This enables zero-config local development for contributors by allowing frontend API requests to work without requiring a frontend `.env`file    containing `VITE_BACKEND_URL`.
- Production deployments continue to rely on `VITE_BACKEND_URL` as configured by the hosting platform.

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

## 📝 Known Issues

- Currency symbol: Some UI elements still use `$` instead of `₹` (INR). See GitHub Issue #21.
- `<style jsx>` in `PharmacyPage.jsx` is Next.js syntax, not valid in Vite/React — causes a React warning.
- `PharmacyDashboard.jsx` is a non-functional prototype using hardcoded dummy data (not connected to backend).
- Health endpoint catch block uses wrong variable name (`err` instead of `error`) — will crash if the endpoint throws.

### Environment Variable Configuration (June 2026)
- Frontend components use `VITE_BACKEND_URL` to connect to the backend API.
- Hardcoded `http://localhost:5000` fallback URLs were removed from frontend components.
- `frontend/.env-sample` serves as a reference template for required variables.
- When `VITE_BACKEND_URL` is undefined (e.g. in test environments), components fall back to an empty string (`""`) to prevent `TypeError` when calling `.replace()`.

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
- **ESM note:** All local imports must include the `.js` extension (e.g., `import Medicine from "../models/medicine.js"`) — omitting it causes `ERR_MODULE_NOT_FOUND` in Node.js ESM mode.
- No breaking changes to existing API endpoints or database models.

### Environment Variables & JWT Fallback (June 2026)
- `backend/.env.example` documents all required environment variables.
- `JWT_SECRET` is optional for local development (falls back to a hardcoded string) but **MUST** be set in production to prevent security vulnerabilities.
- `MONGO_URL` is optional for local development (triggers in-memory MongoDB) but required for production.

**RECORD ANY AND ALL FUTURE ARCHITECTURAL OR IMPORTANT DETAILS IN THIS DOCUMENT.**
---

### Signup Input Validation (June 2026)
- Input validation added to `signup` handler in `backend/controllers/pharmacyController.js`.
- No new dependencies — uses native JavaScript only.
- `phone_number`: digits only via regex `/^\d+$/`, exactly 10 digits.
- `password`: minimum 8 characters.
- Invalid input returns `400 Bad Request` with structured error array: `{ error, details: [{ field, message }] }`.
- Valid registrations proceed unchanged through existing flow.

### Profile Update Phone Key Fix (June 2026)
- Fixed key mismatch in `updateProfile` in `backend/controllers/pharmacyController.js`.
- Changed `contact_number` to `phone_number` in the `allowed` fields array.
- `phone_number` now correctly maps to the Pharmacy model field.

### Agent Customization Rules (June 2026)
- A workspace-scoped customization rules file [AGENTS.md](file:///d:/git%20folder/PharmaNear/.agents/AGENTS.md) is added to the repository.
- AI coding agents supporting the customizations framework will automatically parse and load the constraints defined in this file (e.g. Conventional Commit PR naming, security protocols, terse responses) directly into their system prompt for all turns.
- Keeps agent behavior aligned with repository guidelines without manual intervention.

### Optimized Drug Search API N+1 Fix (June 2026)
- Updated `GET /api/drugs` in `drugController.js` to use Mongoose `.populate()`. This returns full pharmacy details directly in the search response, eliminating the need for the frontend to fire multiple `/api/pharmacy/details` requests.
### API Response Rename (June 2026)
- For semantic clarity, the populated pharmacy object in the `/api/drugs` response was renamed from `pharmacy_id` to `pharmacy`.

### PWA & Favicon Configuration (June 2026)
- Added a complete favicon kit (16x16, 32x32, 192x192, 512x512) and `apple-touch-icon.png` to `frontend/public/`.
- Added `site.webmanifest` to enable Progressive Web App (PWA) installation and cross-browser compatibility.
- Updated `frontend/index.html` with standard `<link>` tags for these assets.
- **Note:** The original `favicon.png` (512x512) was retained as a fallback for legacy browsers and older bookmarking systems that may still look for the default `/favicon.png` path.

### Legal Documentation Enhancement (June 2026)

- Replaced placeholder content in `frontend/src/components/TermsOfService.jsx` with a comprehensive Terms of Service document tailored to PharmaNear.
- Replaced placeholder content in `frontend/src/components/PrivacyPolicy.jsx` with a detailed Privacy Policy covering data handling, user rights, and platform responsibilities.
- Updated `frontend/src/components/InfoPage.jsx` to support rendering structured JSX content, enabling legal pages to include section headings, paragraphs, and lists instead of plain text strings.
- Enhanced `frontend/src/components/InfoPage.css` to improve readability and presentation of legal documents through refined typography, section styling, and responsive layout adjustments.
- These changes are limited to frontend presentation and content improvements and do not affect existing routes, APIs, or backend behavior.

## 🔗 Related Documentation

- [.agents/AGENTS.md](file:///d:/git%20folder/PharmaNear/.agents/AGENTS.md) - Auto-loading workspace customization rules and behavior guidelines for AI agents.
- [README.md](file:///d:/git%20folder/PharmaNear/README.md) - Tech Stack, Getting Started guide, and folder structure.

# Contributing to PharmaNear

> **⚠️ CAUTION:** This repository is currently exclusively for contributions from participants in the Season of Code event by Google Developers Group (GDG). In the future, others might be allowed to contribute, but right now it is restricted to participants only.

**⚠️ IMPORTANT: You must ONLY work on an issue if it has been explicitly assigned to you.**

First off, thank you for considering contributing to PharmaNear! It's people like you that make open-source a great community.

## 🛠️ Local Development Setup

We use `pnpm` as our package manager. Please ensure you have Node.js and `pnpm` installed.

**Need help installing?**

- 🟢 [Node.js Official Download](https://nodejs.org/en/download/)
- 🟡 [pnpm Official Installation Guide](https://pnpm.io/installation)
- 📺 [YouTube Video: How to install Node.js](https://www.youtube.com/watch?v=EIJeLiaGfA0) _(Note: Once Node is installed, open your terminal and run `npm install -g pnpm` to install pnpm!)_

1. **Clone the repo**

   ```bash
   git clone https://github.com/Foces-core/PharmaNear-by-Foces.git
   cd PharmaNear-by-Foces
   ```

2. **Install Dependencies**
   Open two terminals, one for the frontend and one for the backend.

   ```bash
   # Terminal 1 (Backend)
   cd backend
   sfw pnpm install

   # Terminal 2 (Frontend)
   cd frontend
   sfw pnpm install
   ```

   > **🛡️ Security Note:** We strongly recommend prepending `sfw` to all package manager commands (like `sfw pnpm install`) to protect against malicious dependencies.

## 🧪 Testing Your Changes (CRITICAL)

**Before opening a Pull Request, you MUST test your changes locally!**

We have automated tests set up for both the frontend and backend. Your PR will be blocked by GitHub if these tests fail.

To run all tests across the entire project at once, run the following from the root `PharmaNear` directory:

```bash
pnpm run test
```

If you only want to test a specific area:

- Backend: `cd backend && pnpm test`
- Frontend: `cd frontend && pnpm test`

_(If you are ever confused about which test to run, just run the full `pnpm run test` command from the root directory!)_

## 📝 Issue Claiming Process

Before starting work on any feature or bug fix:

1. Browse the [Issues](https://github.com/Foces-core/pharmanear/issues) tab.
2. If you find an issue you'd like to work on, leave a comment: _"I would like to work on this."_
3. Wait for a maintainer to assign the issue to you.
4. If the issue you want to work on doesn't exist, create a new issue first and request to be assigned.

## 🌿 Branching Workflow

We use a feature-branch workflow. Please follow these naming conventions for branches:

- **Feature:** `feature/<issue-number>-<short-description>` (e.g., `feature/42-add-map-view`)
- **Bug Fix:** `fix/<issue-number>-<short-description>` (e.g., `fix/15-login-crash`)
- **Documentation:** `docs/<short-description>`
- **Chore:** `chore/<short-description>`

1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`.
2. Keep your branch up to date with `main` by rebasing or merging regularly.

## 💬 Commit Naming Format

We follow [Conventional Commits](https://www.conventionalcommits.org/). Your commit messages should be structured as follows:

`<type>(<optional scope>): <description>`

Examples:

- `feat: add medicine search bar`
- `fix(auth): resolve JWT expiration bug`
- `docs: update README with screenshots`
- `style: format server.js`
- `test: add unit tests for medicine controller`

## 📝 Pull Request Process

1. Make your changes in your created branch.
2. Commit them using the Conventional Commits format.
3. Run the tests locally using `pnpm run test` and ensure they pass.
4. Push your branch and open a Pull Request targeting the `main` branch.
5. Fill out the PR template completely. Link the issue your PR resolves (e.g., "Closes #42").
6. Await review from maintainers or automated reviewing tools and make any requested changes ar made.

## 🏛️ Architecture Goals & Memory

- If you are contributing to the backend, please note that we are actively trying to migrate away from a monolithic `server.js` file toward a strict MVC pattern (`routes/`, `controllers/`, `middleware/`). If your PR helps us move toward that goal, we will love you forever! Here is how we define the components:
  - **Models (`models/`)**: Mongoose schemas defining the structure of our database documents.
  - **Views (`frontend/src/`)**: Our React components (we keep views completely decoupled from the backend API).
  - **Controllers (`controllers/`)**: Business logic. They receive requests from routes, interact with models, and send responses.
  - **Routes (`routes/`)**: Define the API endpoints and map them to the appropriate controller functions.
  - **Middleware (`middleware/`)**: Authentication (e.g., verifying JWTs) and error handling functions.
- **CRITICAL:** All important architectural decisions made by humans or AI agents MUST be recorded in the `memory.md` file to provide context for future development.

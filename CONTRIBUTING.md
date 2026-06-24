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

## 🎨 Editor Configuration

To maintain consistency and ensure clean code formatting across all contributions, we require everyone to enable the **Insert Final Newline** setting in their text editors.

### VS Code
If you are using Visual Studio Code:
1. Open your settings (`Ctrl + ,` or `Cmd + ,`).
2. Search for `Insert Final Newline`.
3. Check the box for **Files: Insert Final Newline** (or add `"files.insertFinalNewline": true` to your `settings.json`).

### Why is this required?
- **Git Diff Cleanliness**: When you append lines to a file that doesn't end with a newline, Git views the addition of a newline to the previous line as a modification. This creates unnecessary noise in pull requests and triggers a `\ No newline at end of file` warning.
- **POSIX/UNIX Standard Compliance**: POSIX defines a line as ending with a newline character (`\n`). Many shell tools, compilers, and parsers expect files to end with a newline and might miss the last line or fail to process it correctly without one.
- **Consistency**: It prevents formatting conflicts and unnecessary churn between different developers' code editors.

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
6. Await review from maintainers or automated reviewing tools and make any requested changes are made.

## 🧹 Preventing Noisy PRs (PR Cleanliness)

To ensure that pull requests are easy to review, please adhere to the following rules:

1. **Do Not Auto-Format Unrelated Code**:
   - Do **NOT** run automatic code formatters (like Prettier, ESLint `--fix`, or editor-specific auto-formatters) on entire files if you are only editing a few lines.
   - Forcing style changes on lines of code you are not working on generates huge diffs with hundreds of lines of whitespace/style changes. This makes it extremely difficult for maintainers to spot the actual logic changes.
   - **Tip**: Configure your IDE to "Format Selection" or "Format Modified Lines Only" instead of "Format on Save" for the entire document.

2. **No Dead or Debug Code**:
   - Clean up all temporary debugging statement(s) (e.g., `console.log`, `print`, or debug comments), commented-out blocks of code, or unused imports/variables before opening your PR.

3. **Keep PRs Single-focused**:
   - A pull request should do one thing. If you notice unrelated bugs or refactoring opportunities, please open a separate issue and PR for them. Do not bundle unrelated changes together.

4. **Line Ending Consistency**:
   - Configure your editor to use `LF` (Unix) line endings. If your editor automatically converts files to `CRLF` (Windows) on save, it will mark the entire file as modified in Git, causing unnecessary diff noise.

## 🏛️ Architecture Goals & Memory

- If you are contributing to the backend, please note that we are actively trying to migrate away from a monolithic `server.js` file toward a strict MVC pattern (`routes/`, `controllers/`, `middleware/`). If your PR helps us move toward that goal, we will love you forever! Here is how we define the components:
  - **Models (`models/`)**: Mongoose schemas defining the structure of our database documents.
  - **Views (`frontend/src/`)**: Our React components (we keep views completely decoupled from the backend API).
  - **Controllers (`controllers/`)**: Business logic. They receive requests from routes, interact with models, and send responses.
  - **Routes (`routes/`)**: Define the API endpoints and map them to the appropriate controller functions.
  - **Middleware (`middleware/`)**: Authentication (e.g., verifying JWTs) and error handling functions.

## 📝 Architectural Documentation Requirement (CRITICAL)

**[memory.md](memory.md) is the single source of architectural truth for this project.**

For any PR that is **not** a documentation change (i.e., changes to `.md` files), you MUST update `memory.md` with:
- Architectural decisions made
- New patterns or approaches introduced
- Breaking changes or deprecations
- Context for future contributors

**Failure to update memory.md for non-documentation PRs will result in the PR being rejected.** This ensures that architectural knowledge is centralized and accessible to all contributors.

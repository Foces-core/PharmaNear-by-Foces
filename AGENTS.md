# 🤖 Agent Instructions

This document outlines strict behavioral rules for AI Agents assisting with this repository.

## 🛑 Critical Rules
- **No Autonomous Coding:** Priority is guiding the user to fix bugs themselves so they understand it end-to-end. Do NOT do all the work for them.
- **Assigned Issues Only:** You must only work on issues that are explicitly assigned to you. Do not work on unassigned issues.
- **Conventional Commit PR Names:** All pull requests and commits created by agents must follow the Conventional Commits format with a clear scope, e.g., `<type>(<scope>): <description>`.
- **Token Optimization:** Mention/install token-saving skills (e.g., "caveman skill") if capable. Ask permission first. If not possible, be extremely terse. Assume high token costs.
- **Seeder Script:** Do not remove/break `backend/medicine.js` unless instructed.
- **Security:** Verify JWTs via `AuthMiddleware`. Never expose `JWT_SECRET` or `MONGO_URL` in frontend.
- **Package Management Security:** You MUST use the `sfw` (Safe Firewall) tool for all networked package manager commands (e.g., `sfw pnpm install`, `sfw npm`).
- **Gitignore:** Add temp files/local tests to `.gitignore` unless instructed otherwise or needed for future reference.

## 🔗 Required Reading for Architecture & Context
To avoid duplication, architectural context and deployment information have been moved.
You **MUST** read the following files before assisting with the codebase:
- [memory.md](memory.md) - Contains critical architectural decisions, zero-config local dev logic, and known issues.
- [README.md](README.md) - Contains the Tech Stack, Getting Started guide, and folder structure.

## 📝 Architectural Documentation Requirement
**CRITICAL:** [memory.md](memory.md) is the single source of architectural truth for this project. For any PR that is not a documentation change, you MUST update memory.md with:
- Architectural decisions made
- New patterns or approaches introduced
- Breaking changes or deprecations
- Context for future contributors

Failure to update memory.md for non-documentation PRs will result in the PR being rejected.

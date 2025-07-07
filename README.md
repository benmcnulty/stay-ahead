# Stay Ahead

This repository demonstrates a minimal template for an agent-driven workflow.

## Architecture

- **Vibe Coding** focuses on rapid conversational development cycles.
- **Context Engineering** extends vibe coding with modular context and agent-aware workflows.
- Historically, _Prompt Engineering_ evolved into **Vibe Coding** and later **Context Engineering**.

The repo structure supports regression coverage, TDD, and CI guardrails. Documentation and agent guidance ensure modular context for agents.

## Getting Started

- `npm test` – run unit tests via Jest.
- `npm run playwright` – execute end-to-end tests.
- `npm run lint` – lint sources with ESLint.
- `npm run format` – format code with Prettier.
- `npm run docs` – generate JSDoc documentation.

## Agent Roles

- **Claude** – writes high-level features and commentary.
- **Codex** – implements code and tests following TDD.
- **Copilot** – provides inline suggestions and refactoring.

Agents should always produce a plan before coding and keep documentation synchronized.

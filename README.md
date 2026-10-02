# Stay Ahead

This repository demonstrates a minimal template for an agent-driven workflow. It
contains a small JavaScript/TypeScript codebase with unit tests, simple UI
components and a service layer used to showcase how multiple agents can
collaborate via TDD and code reviews.

## Current scope and verification limits

This is a small workflow/template experiment, not evidence of a deployed service.
[`src/app.js`](src/app.js) contains arithmetic, array transformation, validation
and retry examples; [`src/components.js`](src/components.js) and
[`src/service.js`](src/service.js) contain the other demonstration modules.
The page in [`src/index.html`](src/index.html) is a minimal smoke-test surface.
Agent roles below describe the intended process, not independently verified
multi-agent productivity results.

The manifest requires Node >=18; the committed CI uses Node 20. Prefer the
lockfile with `npm ci` for an install attempt. Installation runs the existing
Husky preparation hook. No provider environment variables are required by these
examples. Do not run `npm run dev` expecting a website server: it watches the
utility module, whose CommonJS export also conflicts with the package's ESM mode.

The current Playwright configuration has no `baseURL` or `webServer`, while its
test navigates to `/index.html`. `npm run e2e` therefore is not a complete
reproducible browser setup as committed. `npm run build` is an aggregate
lint/type/unit/browser gate, not a distributable application build. These issues
are disclosed rather than treated as passing validation. This docs review did
not execute the full suite or update dependencies.

For a static preview only, use Python 3:
`python -m http.server 8000 --bind 127.0.0.1 --directory src`, open
`http://127.0.0.1:8000` and stop with Ctrl+C. This does not repair the browser suite.

## Architecture

- **Vibe Coding** focuses on rapid conversational development cycles.
- **Context Engineering** extends vibe coding with modular context and agent-aware workflows.
- Historically, _Prompt Engineering_ evolved into **Vibe Coding** and later **Context Engineering**.

The repo structure supports regression coverage, TDD, and CI guardrails. Documentation and agent guidance ensure modular context for agents.

## Getting Started

Install dependencies and Playwright browsers:

```bash
npm install
npx playwright install
npx playwright install-deps  # Linux only
```

Useful commands:

- `npm test` – run unit tests via Jest.
- `npm run e2e` – execute end-to-end tests.
- `npm run lint` – lint sources with ESLint.
- `npm run format` – format code with Prettier.
- `npm run docs` – generate JSDoc documentation.

## Agent Roles

- **Claude** – writes high-level features and commentary.
- **Codex** – implements code and tests following TDD.
- **Copilot** – provides inline suggestions and refactoring.

Agents should always produce a plan before coding and keep documentation synchronized.

## Contributions and license

Read [AGENTS.md](AGENTS.md), keep examples and documentation aligned, and include
actual gate output with changes. The existing CI performs checks, documentation
generation and artifact/coverage uploads; its Dependabot merge job is restricted
to Dependabot's actor and was not requested for this documentation branch.
See [LICENSE](LICENSE) for MIT terms. No fresh CI success or deployment is claimed.

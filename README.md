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

The manifest requires Node >=18; the committed CI uses Node 20. The 2026-10-02
candidate was checked locally on Node 24 with its locked Playwright 1.53.2 /
Chromium 138.0.7204.23 build 1179. Install the lockfile with lifecycle hooks disabled
for a review checkout:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium --only-shell
npm run dev
```

Open `http://127.0.0.1:4173`; Ctrl+C stops the loopback static preview.
`scripts/serve.js` serves only the demonstration page and declared assets. `PORT`
can override the development preview port. Playwright starts its own preview on
4173, supplies `baseURL`, uses one worker and closes that server after testing.
The utility module retains guarded CommonJS exports for Jest and loads without
throwing in the browser/native ESM context. No model/provider variables are needed.

```sh
npm run lint
npm run typecheck
npm run format:check
npm test -- --runInBand
npm run test:coverage -- --runInBand
npm run docs
npm run e2e
```

The candidate passed all these checks locally: 38 unit tests and 2 real-browser /
preview checks. Coverage 86.27% statements, 84.37% branches, 85.31% lines and 82%
functions meets the unchanged configured gates. The browser test also asserts
no runtime page errors and verifies allowed assets, 404 for repository files and
405 for POST. Both the Linux e2e job and the separate aggregate-build runner
install their required Playwright browser and operating-system dependencies.

`npm run build` is an aggregate lint/type/unit/browser gate, not a distributable
application build. Full product/accessibility or multi-agent outcome validation
is not established by this small template's tests. The supported artifact action
in CI packages generated documentation/test artifacts without deploying a site.

## Architecture

- **Vibe Coding** focuses on rapid conversational development cycles.
- **Context Engineering** extends vibe coding with modular context and agent-aware workflows.
- Historically, _Prompt Engineering_ evolved into **Vibe Coding** and later **Context Engineering**.

The repo structure supports regression coverage, TDD, and CI guardrails. Documentation and agent guidance ensure modular context for agents.

## Getting Started

Install dependencies and Playwright browsers:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium --only-shell
# Linux may also need Playwright browser dependencies.
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
See [LICENSE](LICENSE) for MIT terms. Consult exact candidate CI; no deployment is performed or claimed.

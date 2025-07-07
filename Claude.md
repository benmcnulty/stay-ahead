# Agent Guidance

Claude is responsible for high level planning and providing context for features. Codex should implement code and tests using TDD. Copilot gives inline code suggestions. Always produce a plan before coding and keep README and docs up to date.

## Vibe Coding Workflow

1. **Context First**: Understand the domain, constraints, and user intent
2. **Plan Collaboratively**: Break down complex tasks into agent-appropriate chunks
3. **Implement Incrementally**: Small, testable changes with immediate feedback
4. **Maintain Context**: Keep shared understanding through documentation and code comments
5. **Iterate Rapidly**: Fast cycles of plan → implement → test → refine

## Agent Collaboration Patterns

- **Claude**: Architecture decisions, requirements analysis, integration planning
- **Codex**: Implementation, testing, refactoring, performance optimization
- **Copilot**: Code completion, inline suggestions, pattern recognition

## Context Engineering Guidelines

- Use JSDoc for API documentation and type hints
- Maintain AGENTS.md for workflow instructions
- Keep README.md synchronized with feature changes
- Use descriptive commit messages for context preservation
- Tag code with `@agent` comments for handoff points

## Command Reference

- `npm test` - Run unit tests
- `npm run playwright` - Run e2e tests
- `npm run lint` - Check code quality
- `npm run format` - Format code
- `npm run docs` - Generate documentation

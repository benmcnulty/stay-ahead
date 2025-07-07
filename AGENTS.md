# Agent Instructions

## Core Principles

1. Always craft a clear plan before changing code.
2. Keep tasks small within your context window.
3. Follow TDD; write failing tests first.
4. Update README and docs whenever features change.

## Vibe Coding Workflow

### Phase 1: Context Gathering

- **Claude**: Analyze requirements, understand domain
- **All agents**: Review existing code and documentation
- **Output**: Clear problem statement and success criteria

### Phase 2: Planning

- **Claude**: Break down into testable increments
- **Codex**: Identify implementation approach and dependencies
- **Copilot**: Suggest code patterns and optimizations
- **Output**: Detailed implementation plan with agent assignments

### Phase 3: Implementation

- **Codex**: Write failing tests first (TDD)
- **Codex**: Implement minimal code to pass tests
- **Copilot**: Refactor and optimize implementation
- **All agents**: Review and provide feedback

### Phase 4: Integration

- **Claude**: Ensure solution meets requirements
- **Codex**: Run full test suite and fix issues
- **All agents**: Update documentation and README

## Agent Handoff Patterns

- Use `@agent` comments for explicit handoffs
- Include context in commit messages
- Tag code blocks with intended agent
- Use JSDoc for API contracts between agents

## Quality Gates

- All tests must pass before merge
- Code must pass lint checks
- Documentation must be updated
- Performance impact must be considered

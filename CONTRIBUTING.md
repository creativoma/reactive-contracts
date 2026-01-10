# Contributing to Reactive Contracts

Thank you for your interest in contributing to Reactive Contracts! We welcome contributions from the community.

## Development Setup

### Prerequisites

- Node.js 20+ LTS
- pnpm 9+
- Git

### Getting Started

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/reactive-contracts.git
cd reactive-contracts
```

2. Install dependencies:

```bash
pnpm install
```

3. Build all packages:

```bash
pnpm run build
```

4. Run tests:

```bash
pnpm run test
```

## Project Structure

```
reactive-contracts/
├── packages/
│   ├── core/          # Core contract types and functions
│   ├── react/         # React hooks and components
│   ├── server/        # Server-side implementation utilities
│   └── compiler/      # Contract compiler and CLI
├── apps/
│   └── docs/          # Documentation site (planned)
├── examples/
│   └── basic-usage/   # Working example with Express server
└── ...
```

## Development Workflow

### Making Changes

1. Create a new branch:

```bash
git checkout -b feature/my-feature
```

2. Make your changes and ensure:
   - Code follows existing style (use `pnpm run format`)
   - All tests pass (`pnpm run test`)
   - TypeScript compiles without errors (`pnpm run typecheck`)
   - Linting passes (`pnpm run lint`)

3. Write tests for new functionality

4. Update documentation if needed

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
docs: update documentation
test: add tests
chore: update dependencies
refactor: refactor code
```

Examples:
```bash
git commit -m "feat: add useContractSuspense hook"
git commit -m "fix: handle undefined params in useContract"
git commit -m "docs: update README with new examples"
```

### Adding a Changeset

Before submitting a PR, add a changeset describing your changes:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select packages affected by your change
2. Choose the version bump type (major, minor, patch)
3. Write a summary of your changes

## Running Tests

```bash
# Run all tests
pnpm run test

# Run tests for a specific package
cd packages/core
pnpm run test

# Run tests with coverage
pnpm run test:coverage
```

## Code Style

- Use TypeScript strict mode
- Prefer functional programming patterns
- Use named exports (except for main entry points)
- Add JSDoc comments for public APIs
- Follow existing naming conventions:
  - camelCase for functions and variables
  - PascalCase for types and interfaces

### Example

```typescript
/**
 * Creates a contract definition
 *
 * @param definition - Contract configuration
 * @returns A typed contract object
 *
 * @example
 * ```typescript
 * const MyContract = contract({
 *   name: 'MyContract',
 *   intent: 'Example contract',
 *   shape: { id: 'string' }
 * });
 * ```
 */
export function contract<TShape>(
  definition: ContractDefinition<TShape>
): Contract<TShape> {
  // Implementation
}
```

## Testing Guidelines

- Write unit tests for all new functions
- Aim for >90% coverage
- Test edge cases and error conditions
- Use descriptive test names

### Example Test

```typescript
describe('contract', () => {
  it('should create a valid contract', () => {
    const testContract = contract({
      name: 'Test',
      intent: 'Test contract',
      shape: { field: 'string' },
    });

    expect(testContract._brand).toBe('Contract');
    expect(testContract.definition.name).toBe('Test');
  });

  it('should throw error for missing name', () => {
    expect(() =>
      contract({ name: '', intent: 'Test', shape: {} })
    ).toThrow('Contract must have a valid name');
  });
});
```

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for all public APIs
- Include examples in documentation
- Keep examples up-to-date with API changes

## Pull Request Process

1. Update the README.md or documentation with details of changes
2. Add tests for new functionality
3. Ensure all tests pass and code is formatted
4. Add a changeset describing your changes
5. Submit the PR with a clear description

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changeset added
- [ ] All tests passing
- [ ] Code formatted and linted
```

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, etc.)
- Relevant code samples

## Questions?

Feel free to open an issue for questions or join discussions in GitHub Discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

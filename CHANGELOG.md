# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta] - 2026-01-10

### 🎉 First Beta Release

This is the first beta release of Reactive Contracts, marking the transition from alpha to a production-ready state for early adopters.

### Added

#### @reactive-contracts/core
- Complete type system (`Contract`, `ContractDefinition`, all constraints)
- Helper functions: `contract()`, `derive()`, `max()`, `fallback()`, `daysAgo()`
- Shared utilities: `parseLatencyToMs()`, `parseDurationToMs()`
- 100% test coverage

#### @reactive-contracts/react
- `useContract` hook - Main hook for fetching contract data
- `useContractSuspense` hook - Suspense-compatible data fetching
- `useContractMutation` hook - Mutations with optimistic updates
- `prefetchContract()` - Prefetch contract data for performance
- Real HTTP client with configurable base URL, headers, and timeout
- Automatic fallback to mock data in development mode
- Cache management with freshness tracking
- Latency constraint evaluation

#### @reactive-contracts/server
- `implementContract()` - Type-safe contract resolver implementation
- `createContractHandler()` - Express middleware for single contracts
- `createContractRouter()` - Express router for multiple contracts
- SLA monitoring and status reporting
- Latency tracking with warnings

#### @reactive-contracts/compiler
- CLI commands: `init`, `compile`, `validate`
- TypeScript support via tsx integration
- Contract parsing and validation
- Code generation for frontend types
- Code generation for backend resolvers
- Code generation for runtime negotiators
- Latency analysis with optimization suggestions
- Configuration file support (`rcontracts.config.ts`)
- Colorful CLI output with progress indicators

### Infrastructure
- Monorepo structure with pnpm workspaces
- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESLint, Prettier, and Husky configured
- Vitest for unit testing (34 tests)
- Changesets for versioning
- GitHub Actions CI/CD
- ESM/CJS dual build output
- Turbo for build orchestration

### Documentation
- Comprehensive README with API reference
- Working example project (`examples/basic-usage`)
- CONTRIBUTING.md with development guidelines
- ROADMAP.md with project status

---

## [0.1.0-alpha] - 2026-01-01

### Added
- Initial alpha release
- Core contract definition API
- Basic React hooks
- Express middleware foundation

---

[0.1.0-beta]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.0-beta
[0.1.0-alpha]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.0-alpha

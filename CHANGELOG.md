# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Website

- **Landing Page Enhancements**:
  - Added "How It Works" section with 4-step flow diagram explaining the bidirectional contract lifecycle
  - Added "Type Safety Showcase" section with before/after code examples demonstrating full TypeScript inference
  - Added "Packages" section with bento grid layout showcasing all 4 packages with install commands and npm links
  - Added comprehensive FAQ section with 8 common questions (GraphQL, tRPC, REST, SSR, bundle size, etc.)
  - Added beta status banner in hero section with link to roadmap
  - Enhanced comparison section with build-time vs runtime validation comparison table
  - Added syntax highlighting with Shiki using github-dark-dimmed theme for professional code presentation
  - Added custom NPM and GitHub icons for consistent branding across the site

### Changed - Website

- Updated header navigation to focus on key sections (How It Works, Examples, Packages, FAQ)
- Improved CodeBlock component with professional syntax highlighting and better visual consistency
- Enhanced project config to include all package npm links (core, react, server, compiler)
- Reorganized page structure for better user flow and information architecture

---

## [0.1.3-beta] - 2026-01-10

### Fixed

- **ESLint Configuration**: Added `generated/` folder to ignore patterns in `with-vite` and `with-nextjs` examples to prevent linting auto-generated files
- **TypeScript Errors**: Fixed `Object.entries()` type errors in compiler commands (`compile.ts` and `validate.ts`) by adding proper type assertions for module imports
- **Prettier Formatting**: Formatted compiler source files to pass format:check

### Changed

- Updated ESLint configs to properly exclude generated code directories
- Improved TypeScript strictness compliance in compiler package

---

## [0.1.2-beta] - 2026-01-09

### Added

- **New Examples**: Added `with-nextjs`, `with-vite`, and `with-astro` example projects demonstrating framework integrations
- **PostsList Component**: New component showing multiple contracts in action
- **Mock Server**: Each example now includes a working Express mock server

### Changed

- Improved example documentation with clearer setup instructions
- Enhanced contract definitions with more realistic data shapes

---

## [0.1.1-beta] - 2026-01-08

### Added

- Initial example implementations with real server integration
- Contract client configuration with mock mode for development

### Fixed

- Build configuration for dual ESM/CJS output
- Package exports configuration

---

## [0.1.0-beta] - 2026-01-07

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

[0.1.3-beta]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.3-beta
[0.1.2-beta]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.2-beta
[0.1.1-beta]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.1-beta
[0.1.0-beta]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.0-beta
[0.1.0-alpha]: https://github.com/creativoma/reactive-contracts/releases/tag/v0.1.0-alpha

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reactive Contracts is a TypeScript monorepo implementing bidirectional API contracts where frontend declares data requirements and the compiler ensures both frontend and backend honor the agreement at build time. Currently in alpha (v0.1.0-alpha).

## Commands

### Root workspace commands (pnpm run)
- `build` - Build all packages via Turbo
- `test` - Run all tests via Vitest
- `test:coverage` - Run tests with coverage
- `lint` - Lint all packages
- `format` - Format with Prettier
- `typecheck` - TypeScript type checking
- `clean` - Remove dist and node_modules

### Per-package commands (run from package directory)
- `pnpm run build` - Build single package
- `pnpm run dev` - Watch mode
- `pnpm run test` - Run package tests
- `pnpm vitest run src/path/to/file.test.ts` - Run single test file

### CLI tool (compiler package)
```bash
npx rcontracts init       # Initialize project
npx rcontracts compile    # Compile contracts
npx rcontracts validate   # Validate without generating
npx rcontracts diagnose <name>  # Analyze single contract
npx rcontracts diff       # Show changes since last compile
npx rcontracts migrate    # Run migrations
```

## Architecture

```
packages/
├── core/      - Contract types and functions (zero dependencies)
├── react/     - React hooks: useContract, useContractSuspense, useContractMutation
├── server/    - Backend resolver utilities (implementContract)
└── compiler/  - CLI tool and build-time validation
```

**Package dependencies flow:** core → react/server → compiler

**Compiler dual-build:** Outputs both library (ESM/CJS) and CLI (ESM with shebang) via tsup.

## Code Standards

- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESM-first with CJS compatibility
- Functional programming preferred, classes only when necessary
- Named exports preferred
- Underscore prefix for unused parameters (`_param`)
- Test coverage target: >90%

## Key Files

- `AGENT.md` - Implementation phases and detailed technical requirements
- `rcontracts.config.ts` - Compiler configuration (created by `rcontracts init`)
- `packages/compiler/templates/` - Templates copied during initialization

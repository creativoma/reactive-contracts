# @reactive-contracts/compiler

Build-time compiler and CLI for Reactive Contracts - generates type-safe code from your contract definitions.

## Installation

```bash
npm install @reactive-contracts/compiler
# or
yarn add @reactive-contracts/compiler
# or
pnpm add @reactive-contracts/compiler
```

## CLI Usage

The compiler provides a CLI tool called `rcontracts`:

### Initialize a Project

```bash
npx rcontracts init
```

This creates:
- `rcontracts.config.ts` - Configuration file
- `contracts/` - Directory for your contract definitions
- `contracts/sample.contract.ts` - Example contract

### Compile Contracts

```bash
npx rcontracts compile
```

Compiles all contracts and generates:
- **Frontend code** - Type-safe hooks and client utilities
- **Backend code** - Resolver stubs and type definitions
- **Runtime utilities** - Shared validation and types

### Validate Contracts

```bash
npx rcontracts validate
```

Validates all contracts without generating code. Useful for CI pipelines.

### Diagnose a Contract

```bash
npx rcontracts diagnose UserProfile
```

Shows detailed analysis for a specific contract including:
- Shape analysis
- Constraint validation
- Reactivity configuration
- Potential issues

### Show Changes

```bash
npx rcontracts diff
```

Shows changes since last compile.

### Run Migrations

```bash
npx rcontracts migrate
```

Runs contract migrations for version updates.

## Configuration

Create a `rcontracts.config.ts` in your project root:

```typescript
import { defineConfig } from '@reactive-contracts/compiler';

export default defineConfig({
  // Directory containing your .contract.ts files
  contractsDir: './contracts',
  
  // Output directory for generated code
  outputDir: './generated',
  
  // Generate frontend code (React hooks, etc.)
  generateFrontend: true,
  
  // Generate backend code (resolvers, etc.)
  generateBackend: true,
  
  // Enable strict validation
  strict: true,
});
```

## Programmatic API

You can also use the compiler programmatically:

```typescript
import { compile, validate } from '@reactive-contracts/compiler';

// Compile contracts
await compile({
  contractsDir: './contracts',
  outputDir: './generated',
});

// Validate only
const result = await validate({
  contractsDir: './contracts',
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

## Generated Code Structure

After running `rcontracts compile`, the output directory will contain:

```
generated/
├── frontend/
│   ├── UserProfile.ts      # React hooks and client code
│   └── ...
├── backend/
│   ├── UserProfile.resolver.ts  # Resolver stubs
│   └── ...
└── runtime/
    ├── types.ts            # Shared types
    └── validation.ts       # Runtime validation
```

## Integration with Build Tools

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // Run rcontracts compile before build
    {
      name: 'reactive-contracts',
      buildStart: async () => {
        const { compile } = await import('@reactive-contracts/compiler');
        await compile();
      },
    },
  ],
});
```

### package.json scripts

```json
{
  "scripts": {
    "contracts:compile": "rcontracts compile",
    "contracts:validate": "rcontracts validate",
    "contracts:watch": "rcontracts compile --watch",
    "prebuild": "pnpm contracts:compile"
  }
}
```

## Related Packages

- [`@reactive-contracts/core`](https://www.npmjs.com/package/@reactive-contracts/core) - Core types and contract definitions
- [`@reactive-contracts/react`](https://www.npmjs.com/package/@reactive-contracts/react) - React hooks and client utilities
- [`@reactive-contracts/server`](https://www.npmjs.com/package/@reactive-contracts/server) - Server-side implementation utilities

## License

MIT

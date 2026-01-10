# @reactive-contracts/compiler

## 0.2.0

### Minor Changes

- ## New Package: @reactive-contracts/vite-plugin

  Added a new Vite plugin for automatic contract compilation with HMR support.

  ### Features
  - **Auto-compile on build**: Contracts are automatically compiled when Vite builds
  - **HMR support**: Contract changes trigger automatic recompilation during development
  - **Configurable logging**: Control verbosity with `logLevel` option
  - **Flexible configuration**: Use config file or inline config

  ### Usage

  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import { reactiveContracts } from '@reactive-contracts/vite-plugin';

  export default defineConfig({
    plugins: [
      react(),
      reactiveContracts(), // Compiles contracts on build & HMR
    ],
  });
  ```

  ### Compiler Updates
  - Exposed core functions for programmatic usage: `compileAll`, `compileContract`, `parseContractFile`, `loadConfig`
  - Added `jiti` for runtime TypeScript config file loading
  - Improved config file auto-discovery

## 0.1.2

### Patch Changes

- ## 0.1.3-beta

  ### Fixed
  - ESLint configuration now properly ignores generated files in examples
  - TypeScript errors in compiler commands (compile.ts, validate.ts)

  ### Added
  - New example: with-nextjs (Next.js 16 App Router with Client Components)
  - New example: with-vite (Vite + React with HMR)
  - New example: with-astro (Astro with React islands)

  ### Documentation
  - Updated README with Examples section
  - Updated ROADMAP to 88% completion
  - Updated CHANGELOG with version history
  - Cross-linked all example READMEs

- Updated dependencies
  - @reactive-contracts/core@0.1.2

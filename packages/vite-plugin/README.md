# @reactive-contracts/vite-plugin

Vite plugin for [Reactive Contracts](https://github.com/creativoma/reactive-contracts) - automatically compile contracts during development with HMR support.

## Features

- 🔄 **Auto-compile** - Contracts are automatically compiled when files change
- ⚡ **HMR Support** - Hot Module Replacement for contract changes
- 🛠️ **Dev Mode Warnings** - Clear console warnings and error messages
- 📦 **Zero Configuration** - Works out of the box with `rcontracts.config.ts`

## Installation

```bash
# npm
npm install @reactive-contracts/vite-plugin -D

# pnpm
pnpm add @reactive-contracts/vite-plugin -D

# yarn
yarn add @reactive-contracts/vite-plugin -D
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactiveContracts } from '@reactive-contracts/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactiveContracts(),
  ],
});
```

## Configuration

The plugin uses your existing `rcontracts.config.ts` file by default. You can also pass options directly:

```typescript
reactiveContracts({
  // Path to config file (default: './rcontracts.config.ts')
  configFile: './rcontracts.config.ts',

  // Enable/disable HMR (default: true)
  hmr: true,

  // Compile on build start (default: true)
  compileOnBuildStart: true,

  // Log level: 'verbose' | 'normal' | 'silent' (default: 'normal')
  logLevel: 'normal',
})
```

## How It Works

1. **Build Start**: Compiles all contracts when Vite starts
2. **File Watch**: Watches `contracts/**/*.contract.ts` for changes
3. **HMR**: When a contract changes, it recompiles and triggers HMR for affected modules
4. **Error Reporting**: Shows clear errors in the Vite console

## Requirements

- Vite 5.0+
- A valid `rcontracts.config.ts` configuration file
- Contract files matching the configured glob pattern

## License

MIT

import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    outDir: 'dist',
  },
  // CLI build
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    clean: false,
    outDir: 'dist',
    outExtension: () => ({ js: '.cli.js' }),
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['commander', 'picocolors', 'ora', 'glob', 'fs-extra', 'zod'],
  },
]);

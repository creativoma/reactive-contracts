import { defineConfig } from '@reactive-contracts/compiler';

export default defineConfig({
  // Pattern to find contract files
  contracts: './contracts/**/*.contract.ts',

  // Where to generate code
  output: {
    frontend: './generated/frontend',
    backend: './generated/backend',
    runtime: './generated/runtime',
  },

  // Validation rules
  validation: {
    strictLatency: false, // Alpha: warn only, don't fail
    requireIntent: true, // All contracts should have an intent
    maxComplexity: 10, // Limit derivation complexity
  },

  // Optimization flags (alpha: disabled)
  optimization: {
    bundleSplitting: false,
    treeShaking: false,
    precompute: [],
  },

  // External integrations (not yet implemented)
  integrations: {
    // prisma: './prisma/schema.prisma',
    // graphql: './schema.graphql',
  },
});

import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { reactiveContracts } from '@reactive-contracts/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Reactive Contracts plugin - auto-compiles contracts on change
    reactiveContracts({
      // Uses rcontracts.config.ts by default
      // Enable verbose logging for development
      logLevel: 'normal',
    }) as Plugin,
  ],
});

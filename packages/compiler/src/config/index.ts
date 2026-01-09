import type { CompilerConfig, ConfigDefinition } from '../types.js';

/**
 * Define a Reactive Contracts compiler configuration
 */
export function defineConfig(config: CompilerConfig): ConfigDefinition {
  return config;
}

/**
 * Load configuration from file
 */
export async function loadConfig(
  _configPath: string = './rcontracts.config.ts'
): Promise<CompilerConfig> {
  // TODO: Implement config loading
  return {
    contracts: './contracts/**/*.contract.ts',
    output: {
      frontend: './generated/frontend',
      backend: './generated/backend',
      runtime: './generated/runtime',
    },
  };
}

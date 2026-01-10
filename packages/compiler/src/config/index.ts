import { createJiti } from 'jiti';
import * as path from 'path';
import { existsSync } from 'fs';
import type { CompilerConfig, ConfigDefinition } from '../types.js';

/**
 * Default configuration values
 */
const defaultConfig: CompilerConfig = {
  contracts: './contracts/**/*.contract.ts',
  output: {
    frontend: './generated/frontend',
    backend: './generated/backend',
    runtime: './generated/runtime',
  },
  validation: {
    strictLatency: false,
    requireIntent: true,
    maxComplexity: 10,
  },
  optimization: {
    bundleSplitting: false,
    treeShaking: false,
    precompute: [],
  },
};

/**
 * Define a Reactive Contracts compiler configuration
 */
export function defineConfig(config: CompilerConfig): ConfigDefinition {
  return config;
}

/**
 * Resolve config file path
 */
export function resolveConfigPath(configPath?: string, cwd: string = process.cwd()): string | null {
  // If explicit path provided, use it
  if (configPath) {
    const absolutePath = path.isAbsolute(configPath) ? configPath : path.join(cwd, configPath);
    return existsSync(absolutePath) ? absolutePath : null;
  }

  // Look for config files in order of preference
  const configNames = [
    'rcontracts.config.ts',
    'rcontracts.config.js',
    'rcontracts.config.mjs',
    'reactive-contracts.config.ts',
    'reactive-contracts.config.js',
  ];

  for (const name of configNames) {
    const fullPath = path.join(cwd, name);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Load configuration from file
 *
 * @param configPath - Path to config file or undefined for auto-discovery
 * @param cwd - Working directory for relative paths
 * @returns Resolved compiler configuration
 */
export async function loadConfig(
  configPath?: string,
  cwd: string = process.cwd()
): Promise<CompilerConfig> {
  const resolvedPath = resolveConfigPath(configPath, cwd);

  // If no config file found, return defaults
  if (!resolvedPath) {
    return { ...defaultConfig };
  }

  // Create jiti instance for loading TypeScript config files
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    moduleCache: false, // Disable cache to get fresh config on reload
  });

  try {
    const module = await jiti.import(resolvedPath);
    const config = (module as { default?: CompilerConfig }).default || (module as CompilerConfig);

    // Merge with defaults
    return {
      ...defaultConfig,
      ...config,
      output: {
        ...defaultConfig.output,
        ...(config.output || {}),
      },
      validation: {
        ...defaultConfig.validation,
        ...(config.validation || {}),
      },
      optimization: {
        ...defaultConfig.optimization,
        ...(config.optimization || {}),
      },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load config from ${resolvedPath}: ${errorMessage}`);
  }
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): CompilerConfig {
  return { ...defaultConfig };
}

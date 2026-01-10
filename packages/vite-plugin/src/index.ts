/**
 * @reactive-contracts/vite-plugin
 *
 * Vite plugin for Reactive Contracts - auto-compile contracts with HMR support
 */

import type { CompilerConfig, CompilerLogger } from '@reactive-contracts/compiler';
import {
  loadConfig,
  compileAll,
  compileContract,
  parseContractFile,
  isContractFile,
} from '@reactive-contracts/compiler';
import pc from 'picocolors';
import * as path from 'path';

// Use inline types to avoid version conflicts between Vite versions in monorepo
interface VitePlugin {
  name: string;
  configResolved?: (config: { root: string }) => void | Promise<void>;
  buildStart?: () => void | Promise<void>;
  configureServer?: (server: { watcher: { add: (path: string) => void } }) => void;
  handleHotUpdate?: (ctx: {
    file: string;
    server: {
      moduleGraph: {
        getModuleById: (id: string) => { id: string } | null | undefined;
        invalidateModule: (mod: { id: string }) => void;
      };
      ws: {
        send: (payload: { type: string; path: string }) => void;
      };
    };
  }) => void | Promise<void>;
}

/**
 * Plugin options
 */
export interface ReactiveContractsPluginOptions {
  /**
   * Path to the config file
   * @default './rcontracts.config.ts'
   */
  configFile?: string;

  /**
   * Inline configuration (overrides config file)
   */
  config?: Partial<CompilerConfig>;

  /**
   * Enable HMR for contract changes
   * @default true
   */
  hmr?: boolean;

  /**
   * Compile contracts on build start
   * @default true
   */
  compileOnBuildStart?: boolean;

  /**
   * Log level
   * @default 'normal'
   */
  logLevel?: 'verbose' | 'normal' | 'silent';
}

/**
 * Create a logger for Vite console output
 */
function createViteLogger(logLevel: 'verbose' | 'normal' | 'silent'): CompilerLogger {
  const prefix = pc.cyan('[reactive-contracts]');

  if (logLevel === 'silent') {
    return {
      info: () => {},
      success: () => {},
      warning: () => {},
      error: () => {},
      verbose: () => {},
    };
  }

  return {
    info: (msg) => console.log(`${prefix} ${msg}`),
    success: (msg) => console.log(`${prefix} ${pc.green('✓')} ${msg}`),
    warning: (msg) => console.warn(`${prefix} ${pc.yellow('⚠')} ${msg}`),
    error: (msg) => console.error(`${prefix} ${pc.red('✗')} ${msg}`),
    verbose: logLevel === 'verbose' ? (msg) => console.log(`${prefix} ${pc.dim(msg)}`) : () => {},
  };
}

/**
 * Vite plugin for Reactive Contracts
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import react from '@vitejs/plugin-react';
 * import { reactiveContracts } from '@reactive-contracts/vite-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     reactiveContracts(),
 *   ],
 * });
 * ```
 */
export function reactiveContracts(options: ReactiveContractsPluginOptions = {}): VitePlugin {
  const {
    configFile,
    config: inlineConfig,
    hmr = true,
    compileOnBuildStart = true,
    logLevel = 'normal',
  } = options;

  let config: CompilerConfig;
  let logger: CompilerLogger;
  let root: string;

  return {
    name: 'reactive-contracts',

    /**
     * Initialize plugin configuration
     */
    async configResolved(resolvedConfig) {
      root = resolvedConfig.root;
      logger = createViteLogger(logLevel);

      // Load config
      try {
        config = await loadConfig(configFile, root);

        // Apply inline config overrides
        if (inlineConfig) {
          config = {
            ...config,
            ...inlineConfig,
            output: {
              ...config.output,
              ...(inlineConfig.output || {}),
            },
            validation: {
              ...config.validation,
              ...(inlineConfig.validation || {}),
            },
          };
        }

        logger.verbose?.(`Configuration loaded from ${configFile || 'rcontracts.config.ts'}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`Failed to load config: ${errorMessage}`);
        // Use default config
        config = {
          contracts: './contracts/**/*.contract.ts',
          output: {
            frontend: './generated/frontend',
            backend: './generated/backend',
            runtime: './generated/runtime',
          },
        };
      }
    },

    /**
     * Compile contracts when build starts
     */
    async buildStart() {
      if (!compileOnBuildStart) {
        return;
      }

      logger.info('Compiling contracts...');

      const result = await compileAll({
        config,
        cwd: root,
        logger,
      });

      if (!result.success) {
        const errorMsg = `Contract compilation failed with ${result.errors.length} error(s)`;
        logger.error(errorMsg);

        // In dev mode, don't fail build - just warn
        // In production build, throw
        if (process.env.NODE_ENV === 'production') {
          throw new Error(errorMsg);
        }
      }
    },

    /**
     * Configure dev server for file watching
     */
    configureServer(devServer) {
      if (!hmr) {
        return;
      }

      // Watch contract files for changes
      devServer.watcher.add(path.join(root, 'contracts'));

      logger.verbose?.('Watching contracts directory for changes');
    },

    /**
     * Handle HMR for contract files
     */
    async handleHotUpdate(ctx) {
      const { file, server: hmrServer } = ctx;

      // Only handle contract files
      if (!isContractFile(file)) {
        return;
      }

      logger.info(`Contract changed: ${path.basename(file)}`);

      try {
        // Parse the changed contract file
        const { contracts, errors } = await parseContractFile(file, logger);

        if (errors.length > 0) {
          for (const err of errors) {
            logger.error(err);
          }
          return;
        }

        // Compile each contract in the file
        for (const { name, contract } of contracts) {
          logger.verbose?.(`Recompiling ${name}...`);

          const result = await compileContract(contract, config, root, logger);

          if (!result.validation.valid) {
            logger.error(`Validation failed for ${name}`);
            continue;
          }

          logger.success(`Recompiled ${name}`);

          // Invalidate generated modules to trigger HMR
          if (result.generated.frontend) {
            const frontendModule = hmrServer.moduleGraph.getModuleById(result.generated.frontend);
            if (frontendModule) {
              hmrServer.moduleGraph.invalidateModule(frontendModule);
            }
          }
        }

        // Trigger full reload for affected modules
        // The generated files import chain will propagate HMR
        hmrServer.ws.send({
          type: 'full-reload',
          path: '*',
        });

        logger.verbose?.('HMR update sent');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error(`HMR update failed: ${errorMessage}`);
      }
    },
  };
}

// Default export for convenience
export default reactiveContracts;

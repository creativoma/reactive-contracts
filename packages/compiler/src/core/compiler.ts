/**
 * Core compiler module for programmatic usage
 *
 * This module exposes the core compilation functions that can be used
 * by both the CLI and build tool plugins (Vite, Webpack, etc.)
 */

import { glob } from 'glob';
import * as path from 'path';
import { createJiti } from 'jiti';
import { validateContract } from '../validator/index.js';
import { analyzeLatency } from '../analyzer/index.js';
import {
  generateFrontendTypes,
  generateBackendResolver,
  generateRuntimeNegotiator,
} from '../generator/index.js';
import type { Contract } from '@reactive-contracts/core';
import type { CompilerConfig, CompilationResult } from '../types.js';

/**
 * Logger interface for customizable output
 */
export interface CompilerLogger {
  info: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  verbose?: (message: string) => void;
}

/**
 * Default silent logger
 */
export const silentLogger: CompilerLogger = {
  info: () => {},
  success: () => {},
  warning: () => {},
  error: () => {},
  verbose: () => {},
};

/**
 * Console logger for basic output
 */
export const consoleLogger: CompilerLogger = {
  info: (msg) => console.log('[rcontracts]', msg),
  success: (msg) => console.log('[rcontracts] ✓', msg),
  warning: (msg) => console.warn('[rcontracts] ⚠', msg),
  error: (msg) => console.error('[rcontracts] ✗', msg),
  verbose: (msg) => console.log('[rcontracts]', msg),
};

/**
 * Options for compiling contracts
 */
export interface CompileOptions {
  /** Compiler configuration */
  config: CompilerConfig;
  /** Base directory (defaults to process.cwd()) */
  cwd?: string;
  /** Logger for output */
  logger?: CompilerLogger;
  /** Only compile specific file (for incremental compilation) */
  file?: string;
}

/**
 * Result of a compilation run
 */
export interface CompileResult {
  success: boolean;
  results: CompilationResult[];
  errors: string[];
  warnings: string[];
}

/**
 * Parse a contract from a file
 */
export async function parseContractFile(
  filePath: string,
  logger: CompilerLogger = silentLogger
): Promise<{ contracts: Array<{ name: string; contract: Contract }>; errors: string[] }> {
  const contracts: Array<{ name: string; contract: Contract }> = [];
  const errors: string[] = [];

  // Create jiti instance for loading TypeScript files
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    moduleCache: false, // Disable cache to avoid stale imports
  });

  try {
    // Import the contract file using jiti (handles TypeScript files)
    const module = await jiti.import(filePath);

    // Find the contract exports (look for exports ending with Contract)
    const contractExports = Object.entries(module as Record<string, unknown>).filter(
      ([key, value]) =>
        key.endsWith('Contract') &&
        typeof value === 'object' &&
        value !== null &&
        '_brand' in value &&
        (value as { _brand: string })._brand === 'Contract'
    );

    if (contractExports.length === 0) {
      errors.push(`No contract found in ${path.basename(filePath)}`);
      return { contracts, errors };
    }

    for (const [exportName, contractObj] of contractExports) {
      contracts.push({
        name: exportName,
        contract: contractObj as Contract,
      });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to parse ${path.basename(filePath)}: ${errorMessage}`);
    logger.error?.(errorMessage);
  }

  return { contracts, errors };
}

/**
 * Compile a single contract and generate output files
 */
export async function compileContract(
  contract: Contract,
  config: CompilerConfig,
  cwd: string = process.cwd(),
  logger: CompilerLogger = silentLogger
): Promise<CompilationResult> {
  const validation = validateContract(contract);
  const latency = analyzeLatency(contract);
  const generated: CompilationResult['generated'] = {};

  // Log warnings
  for (const warn of validation.warnings) {
    logger.warning?.(warn);
  }

  // Check validation errors
  if (!validation.valid) {
    for (const err of validation.errors) {
      logger.error?.(err);
    }
    return { contract, validation, latency, generated };
  }

  // Check latency analysis
  if (latency.status === 'error') {
    logger.error?.(latency.message || 'Latency analysis failed');
    if (config.validation?.strictLatency) {
      return { contract, validation, latency, generated };
    }
  } else if (latency.status === 'warning') {
    logger.warning?.(latency.message || 'Latency constraint may not be met');
  }

  // Show latency suggestions
  if (latency.suggestions?.length) {
    for (const suggestion of latency.suggestions) {
      logger.info?.(`💡 ${suggestion}`);
    }
  }

  // Generate output files
  const contractName = contract.definition.name;

  try {
    // Frontend types
    const frontendPath = path.join(cwd, config.output.frontend, `${contractName}.ts`);
    await generateFrontendTypes(contract, frontendPath);
    generated.frontend = frontendPath;

    // Backend resolver
    const backendPath = path.join(cwd, config.output.backend, `${contractName}.resolver.ts`);
    await generateBackendResolver(contract, backendPath);
    generated.backend = backendPath;

    // Runtime negotiator
    const runtimePath = path.join(cwd, config.output.runtime, `${contractName}.negotiator.ts`);
    await generateRuntimeNegotiator(contract, runtimePath);
    generated.runtime = runtimePath;

    logger.success?.(`Generated code for ${contractName}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error?.(`Failed to generate code for ${contractName}: ${errorMessage}`);
    validation.errors.push(errorMessage);
    validation.valid = false;
  }

  return { contract, validation, latency, generated };
}

/**
 * Find all contract files matching the configured pattern
 */
export async function findContractFiles(
  config: CompilerConfig,
  cwd: string = process.cwd()
): Promise<string[]> {
  return glob(config.contracts, {
    cwd,
    absolute: true,
  });
}

/**
 * Compile all contracts in a project
 */
export async function compileAll(options: CompileOptions): Promise<CompileResult> {
  const { config, cwd = process.cwd(), logger = silentLogger, file } = options;

  const results: CompilationResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find contract files
  let contractFiles: string[];

  if (file) {
    // Compile single file
    contractFiles = [path.isAbsolute(file) ? file : path.join(cwd, file)];
  } else {
    // Find all matching files
    contractFiles = await findContractFiles(config, cwd);
  }

  if (contractFiles.length === 0) {
    errors.push(`No contract files found matching pattern: ${config.contracts}`);
    return { success: false, results, errors, warnings };
  }

  logger.info?.(`Found ${contractFiles.length} contract file(s)`);

  // Process each contract file
  for (const filePath of contractFiles) {
    const fileName = path.basename(filePath, '.contract.ts');
    logger.verbose?.(`Processing ${fileName}...`);

    // Parse contracts from file
    const { contracts, errors: parseErrors } = await parseContractFile(filePath, logger);

    if (parseErrors.length > 0) {
      errors.push(...parseErrors);
      continue;
    }

    // Compile each contract
    for (const { name, contract } of contracts) {
      const result = await compileContract(contract, config, cwd, logger);
      results.push(result);

      if (!result.validation.valid) {
        errors.push(`Validation failed for ${name}`);
      }

      warnings.push(...result.validation.warnings);
    }
  }

  const success = errors.length === 0;

  if (success) {
    logger.success?.(`Successfully compiled ${results.length} contract(s)`);
  } else {
    logger.error?.(`Compilation failed with ${errors.length} error(s)`);
  }

  return { success, results, errors, warnings };
}

/**
 * Check if a file is a contract file based on its path
 */
export function isContractFile(filePath: string): boolean {
  return filePath.endsWith('.contract.ts');
}

/**
 * Get the affected generated files for a contract
 */
export function getGeneratedFilesForContract(
  contractName: string,
  config: CompilerConfig,
  cwd: string = process.cwd()
): { frontend: string; backend: string; runtime: string } {
  return {
    frontend: path.join(cwd, config.output.frontend, `${contractName}.ts`),
    backend: path.join(cwd, config.output.backend, `${contractName}.resolver.ts`),
    runtime: path.join(cwd, config.output.runtime, `${contractName}.negotiator.ts`),
  };
}

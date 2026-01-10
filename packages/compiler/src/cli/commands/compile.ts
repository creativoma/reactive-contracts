import { glob } from 'glob';
import * as path from 'path';
import { createJiti } from 'jiti';
import { header, success, error, info, warning } from '../utils/logger.js';
import * as spinner from '../utils/spinner.js';
import { loadConfig } from '../../config/index.js';
import { validateContract } from '../../validator/index.js';
import { analyzeLatency } from '../../analyzer/index.js';
import {
  generateFrontendTypes,
  generateBackendResolver,
  generateRuntimeNegotiator,
} from '../../generator/index.js';
import type { Contract } from '@reactive-contracts/core';

// Create jiti instance for loading TypeScript files
const jiti = createJiti(import.meta.url, {
  interopDefault: true,
  moduleCache: false, // Disable cache to avoid stale imports
});

export async function compile(): Promise<void> {
  try {
    header('Compiling Reactive Contracts');

    // Load configuration
    spinner.start('Loading configuration...');
    const config = await loadConfig();
    spinner.succeed('Configuration loaded');

    // Find all contract files
    spinner.start('Finding contract files...');
    const contractFiles = await glob(config.contracts, {
      cwd: process.cwd(),
      absolute: true,
    });

    if (contractFiles.length === 0) {
      spinner.fail('No contract files found');
      warning(`No files matching pattern: ${config.contracts}`);
      info('Run "npx rcontracts init" to create a sample contract');
      return;
    }

    spinner.succeed(`Found ${contractFiles.length} contract file(s)`);

    // Process each contract
    let successCount = 0;
    let errorCount = 0;

    for (const file of contractFiles) {
      const fileName = path.basename(file, '.contract.ts');
      spinner.start(`Processing ${fileName}...`);

      try {
        // Import the contract file using jiti (handles TypeScript files)
        const module = await jiti.import(file);

        // Find the contract export (look for exports ending with Contract)
        const contractExports = Object.entries(module as Record<string, unknown>).filter(
          ([key, value]) =>
            key.endsWith('Contract') &&
            typeof value === 'object' &&
            value !== null &&
            '_brand' in value &&
            (value as { _brand: string })._brand === 'Contract'
        );

        if (contractExports.length === 0) {
          spinner.fail(`No contract found in ${fileName}`);
          warning(`File ${file} does not export a contract`);
          errorCount++;
          continue;
        }

        for (const [exportName, contractObj] of contractExports) {
          const contract = contractObj as Contract;

          // Validate contract
          const validation = validateContract(contract);

          if (!validation.valid) {
            spinner.fail(`Validation failed for ${exportName}`);
            for (const err of validation.errors) {
              error(`  ✗ ${err}`);
            }
            errorCount++;
            continue;
          }

          // Show warnings if any
          if (validation.warnings.length > 0) {
            for (const warn of validation.warnings) {
              warning(`  ⚠ ${warn}`);
            }
          }

          // Analyze latency
          const latencyAnalysis = analyzeLatency(contract);
          if (latencyAnalysis.status === 'error') {
            spinner.fail(`Latency analysis failed for ${exportName}`);
            error(`  ✗ ${latencyAnalysis.message}`);
            if (config.validation?.strictLatency) {
              errorCount++;
              continue;
            }
          } else if (latencyAnalysis.status === 'warning') {
            warning(`  ⚠ ${latencyAnalysis.message}`);
          }

          // Show latency suggestions
          if (latencyAnalysis.suggestions && latencyAnalysis.suggestions.length > 0) {
            for (const suggestion of latencyAnalysis.suggestions) {
              info(`  💡 ${suggestion}`);
            }
          }

          // Generate output files
          const contractName = contract.definition.name;

          // Frontend types
          const frontendPath = path.join(
            process.cwd(),
            config.output.frontend,
            `${contractName}.ts`
          );
          await generateFrontendTypes(contract, frontendPath);

          // Backend resolver
          const backendPath = path.join(
            process.cwd(),
            config.output.backend,
            `${contractName}.resolver.ts`
          );
          await generateBackendResolver(contract, backendPath);

          // Runtime negotiator
          const runtimePath = path.join(
            process.cwd(),
            config.output.runtime,
            `${contractName}.negotiator.ts`
          );
          await generateRuntimeNegotiator(contract, runtimePath);

          spinner.succeed(`✓ Validated and generated code for ${exportName}`);
          successCount++;
        }
      } catch (err) {
        spinner.fail(`Failed to process ${fileName}`);
        error(`  ${err instanceof Error ? err.message : String(err)}`);
        errorCount++;
      }
    }

    // Summary
    console.log('');
    if (successCount > 0) {
      success(`✓ Successfully compiled ${successCount} contract(s)`);
      info(`  Frontend types → ${config.output.frontend}`);
      info(`  Backend resolvers → ${config.output.backend}`);
      info(`  Runtime negotiators → ${config.output.runtime}`);
    }

    if (errorCount > 0) {
      error(`✗ Failed to compile ${errorCount} contract(s)`);
      process.exit(1);
    }
  } catch (err) {
    error(`Failed to compile: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

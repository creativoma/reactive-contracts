import { glob } from 'glob';
import * as path from 'path';
import { createJiti } from 'jiti';
import { header, success, error, info, warning } from '../utils/logger.js';
import * as spinner from '../utils/spinner.js';
import { loadConfig } from '../../config/index.js';
import { validateContract } from '../../validator/index.js';
import { analyzeLatency } from '../../analyzer/index.js';
import type { Contract } from '@reactive-contracts/core';

// Create jiti instance for loading TypeScript files
const jiti = createJiti(import.meta.url, {
  interopDefault: true,
  moduleCache: false, // Disable cache to avoid stale imports
});

export async function validate(): Promise<void> {
  try {
    header('Validating Reactive Contracts');

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

    // Validate each contract
    let validCount = 0;
    let invalidCount = 0;
    let warningCount = 0;

    for (const file of contractFiles) {
      const fileName = path.basename(file, '.contract.ts');
      spinner.start(`Validating ${fileName}...`);

      try {
        // Import the contract file using jiti (handles TypeScript files)
        const module = await jiti.import(file);

        // Find the contract exports
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
          invalidCount++;
          continue;
        }

        for (const [exportName, contractObj] of contractExports) {
          const contract = contractObj as Contract;

          // Validate contract structure
          const validation = validateContract(contract);

          if (!validation.valid) {
            spinner.fail(`✗ ${exportName} - INVALID`);
            for (const err of validation.errors) {
              error(`    ${err}`);
            }
            invalidCount++;
          } else {
            // Analyze latency
            const latencyAnalysis = analyzeLatency(contract);

            if (latencyAnalysis.status === 'error') {
              if (config.validation?.strictLatency) {
                spinner.fail(`✗ ${exportName} - INVALID (latency constraint violation)`);
                error(`    ${latencyAnalysis.message}`);
                invalidCount++;
              } else {
                spinner.stop();
                warning(`⚠ ${exportName} - WARNING (latency issue)`);
                warning(`    ${latencyAnalysis.message}`);
                warningCount++;
                validCount++;
              }
            } else {
              spinner.succeed(`✓ ${exportName} - VALID`);
              validCount++;

              // Show warnings
              if (validation.warnings.length > 0) {
                for (const warn of validation.warnings) {
                  warning(`    ${warn}`);
                }
                warningCount++;
              }

              if (latencyAnalysis.status === 'warning') {
                warning(`    ${latencyAnalysis.message}`);
                warningCount++;
              }

              // Show suggestions
              if (latencyAnalysis.suggestions && latencyAnalysis.suggestions.length > 0) {
                for (const suggestion of latencyAnalysis.suggestions) {
                  info(`    💡 ${suggestion}`);
                }
              }
            }
          }
        }
      } catch (err) {
        spinner.fail(`Failed to validate ${fileName}`);
        error(`  ${err instanceof Error ? err.message : String(err)}`);
        invalidCount++;
      }
    }

    // Summary
    console.log('');
    console.log('Validation Summary:');
    console.log(`  ✓ Valid: ${validCount}`);
    if (warningCount > 0) {
      console.log(`  ⚠ Warnings: ${warningCount}`);
    }
    if (invalidCount > 0) {
      console.log(`  ✗ Invalid: ${invalidCount}`);
    }

    if (invalidCount > 0) {
      error('\nValidation failed. Please fix the errors above.');
      process.exit(1);
    } else if (warningCount > 0) {
      success('\nValidation passed with warnings');
    } else {
      success('\nAll contracts are valid!');
    }
  } catch (err) {
    error(`Failed to validate: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

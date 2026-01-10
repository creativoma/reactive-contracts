export type {
  CompilerConfig,
  ValidationResult,
  LatencyAnalysisResult,
  CompilationResult,
  ConfigDefinition,
} from './types.js';

export { defineConfig, loadConfig } from './config/index.js';
export { validateContract } from './validator/index.js';
export { analyzeLatency } from './analyzer/index.js';
export {
  generateFrontendTypes,
  generateBackendResolver,
  generateRuntimeNegotiator,
} from './generator/index.js';

// Core compiler functions for programmatic usage
export {
  compileAll,
  compileContract,
  parseContractFile,
  findContractFiles,
  isContractFile,
  getGeneratedFilesForContract,
  silentLogger,
  consoleLogger,
  type CompilerLogger,
  type CompileOptions,
  type CompileResult,
} from './core/index.js';

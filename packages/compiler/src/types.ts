import type { Contract } from '@reactive-contracts/core';

/**
 * Configuration for the Reactive Contracts compiler
 */
export interface CompilerConfig {
  contracts: string;
  output: {
    frontend: string;
    backend: string;
    runtime: string;
  };
  validation?: {
    strictLatency?: boolean;
    requireIntent?: boolean;
    maxComplexity?: number;
  };
  optimization?: {
    bundleSplitting?: boolean;
    treeShaking?: boolean;
    precompute?: string[];
  };
  integrations?: Record<string, unknown>;
}

/**
 * Result of contract validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Result of latency analysis
 */
export interface LatencyAnalysisResult {
  status: 'ok' | 'warning' | 'error';
  estimated?: string;
  suggestions: string[];
  message?: string;
}

/**
 * Contract compilation result
 */
export interface CompilationResult {
  contract: Contract;
  validation: ValidationResult;
  latency: LatencyAnalysisResult;
  generated: {
    frontend?: string;
    backend?: string;
    runtime?: string;
  };
}

/**
 * Config definition function return type
 */
export type ConfigDefinition = CompilerConfig;

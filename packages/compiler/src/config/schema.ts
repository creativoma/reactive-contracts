import { z } from 'zod';

/**
 * Zod schema for compiler configuration
 */
export const compilerConfigSchema = z.object({
  contracts: z.string().describe('Glob pattern to find contract files'),

  output: z.object({
    frontend: z.string().describe('Output directory for frontend types'),
    backend: z.string().describe('Output directory for backend resolvers'),
    runtime: z.string().describe('Output directory for runtime negotiators'),
  }),

  validation: z
    .object({
      strictLatency: z.boolean().optional().describe('Fail compilation on latency violations'),
      requireIntent: z.boolean().optional().describe('Require intent documentation'),
      maxComplexity: z.number().optional().describe('Maximum derivation complexity'),
    })
    .optional(),

  optimization: z
    .object({
      bundleSplitting: z.boolean().optional().describe('Split bundles by contract'),
      treeShaking: z.boolean().optional().describe('Remove unused fields'),
      precompute: z.array(z.string()).optional().describe('Layers to precompute derivations'),
    })
    .optional(),

  integrations: z.record(z.string(), z.unknown()).optional().describe('External integrations'),
});

export type CompilerConfigSchema = z.infer<typeof compilerConfigSchema>;

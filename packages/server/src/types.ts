import type { Contract } from '@reactive-contracts/core';

/**
 * Base context passed to resolver functions
 * Extend this interface for custom context properties
 */
export interface ResolverContext {
  request?: Request;
  headers?: Record<string, string>;
  user?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Resolver function type - fully generic
 */
export type ResolverFn<TParams, TData, TContext extends ResolverContext = ResolverContext> = (
  params: TParams,
  context: TContext
) => Promise<TData> | TData;

/**
 * Cache configuration for contract resolvers
 */
export interface CacheConfig<TParams> {
  ttl?: string;
  staleWhileRevalidate?: string;
  tags?: (params: TParams) => string[];
}

/**
 * Contract implementation configuration - requires explicit type parameters
 */
export interface ContractImplementation<
  TParams,
  TData,
  TContext extends ResolverContext = ResolverContext,
> {
  resolve: ResolverFn<TParams, TData, TContext>;
  cache?: CacheConfig<TParams>;
  validate?: (params: TParams) => boolean | Promise<boolean>;
  onError?: (error: Error, params: TParams, context: TContext) => void;
}

/**
 * Implemented contract resolver - requires explicit type parameters
 */
export interface ContractResolver<TParams, TData> {
  contract: Contract;
  implementation: ContractImplementation<TParams, TData>;
  execute: (params: TParams, context?: ResolverContext) => Promise<TData>;
}

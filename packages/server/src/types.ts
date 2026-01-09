import type { Contract } from '@reactive-contracts/core';

/**
 * Context passed to resolver functions
 */
export interface ResolverContext {
  request?: Request;
  headers?: Record<string, string>;
  user?: any;
  [key: string]: any;
}

/**
 * Resolver function type
 */
export type ResolverFn<TParams, TData, TContext extends ResolverContext = ResolverContext> = (
  params: TParams,
  context: TContext
) => Promise<TData> | TData;

/**
 * Cache configuration for contract resolvers
 */
export interface CacheConfig {
  ttl?: string;
  staleWhileRevalidate?: string;
  tags?: (params: any) => string[];
}

/**
 * Contract implementation configuration
 */
export interface ContractImplementation<
  TParams = any,
  TData = any,
  TContext extends ResolverContext = ResolverContext,
> {
  resolve: ResolverFn<TParams, TData, TContext>;
  cache?: CacheConfig;
  validate?: (params: TParams) => boolean | Promise<boolean>;
  onError?: (error: Error, params: TParams, context: TContext) => void;
}

/**
 * Implemented contract resolver
 */
export interface ContractResolver<TParams = any, TData = any> {
  contract: Contract;
  implementation: ContractImplementation<TParams, TData>;
  execute: (params: TParams, context?: ResolverContext) => Promise<TData>;
}

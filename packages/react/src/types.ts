import type { ContractStatus } from '@reactive-contracts/core';

/**
 * Options for useContract hook
 */
export interface UseContractOptions<TParams = any> {
  params?: TParams;
  enabled?: boolean;
  refetchInterval?: number;
  useMockData?: boolean; // If true, uses mock data instead of HTTP
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Result returned by useContract hook
 */
export interface UseContractResult<TData> {
  data: TData | undefined;
  loading: boolean;
  error: Error | null;
  contractStatus: ContractStatus;
  refetch: () => Promise<void>;
}

/**
 * Options for useContractMutation hook
 */
export interface UseContractMutationOptions<_TParams = any, TData = any> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

/**
 * Result returned by useContractMutation hook
 */
export interface UseContractMutationResult<TParams, TData> {
  mutate: (params: TParams) => Promise<TData>;
  loading: boolean;
  error: Error | null;
  data: TData | undefined;
  reset: () => void;
}

/**
 * Contract cache entry
 */
export interface ContractCacheEntry<TData> {
  data: TData;
  status: ContractStatus;
  timestamp: number;
  params: any;
}

/**
 * Prefetch options
 */
export interface PrefetchOptions<TParams = any> {
  params?: TParams;
}

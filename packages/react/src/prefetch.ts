import type { Contract } from '@reactive-contracts/core';
import type { PrefetchOptions } from './types.js';

// Cache for prefetched data - generic storage
const prefetchCache = new Map<string, Record<string, unknown>>();

/**
 * Generate a cache key for prefetching
 */
function getPrefetchKey<TParams>(contract: Contract, params?: TParams): string {
  const paramsKey = params ? JSON.stringify(params) : '';
  return `${contract.definition.name}:${paramsKey}`;
}

/**
 * Prefetch contract data to populate the cache
 *
 * @example
 * ```tsx
 * // Prefetch on hover
 * <button
 *   onMouseEnter={() => prefetchContract<{ userId: string }>(UserProfileContract, { params: { userId: '123' } })}
 *   onClick={() => navigate('/user/123')}
 * >
 *   View Profile
 * </button>
 * ```
 */
export async function prefetchContract<TParams>(
  contract: Contract,
  options: PrefetchOptions<TParams> = {} as PrefetchOptions<TParams>
): Promise<void> {
  const { params } = options;
  const cacheKey = getPrefetchKey(contract, params);

  // Check if already cached
  if (prefetchCache.has(cacheKey)) {
    return;
  }

  try {
    // In a real implementation, this would fetch from the backend
    // For now, we'll simulate a prefetch
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Store in cache
    const mockData = {
      data: {},
      status: {
        latency: 'normal',
        freshness: 'fresh',
        availability: 'available',
      },
      timestamp: Date.now(),
      params,
    };

    prefetchCache.set(cacheKey, mockData);
  } catch (error) {
    // Silently fail prefetch - it's not critical
    console.warn('Prefetch failed for contract:', contract.definition.name, error);
  }
}

/**
 * Get prefetched data from cache
 * @internal
 */
export function getPrefetchedData<TParams, TData>(
  contract: Contract,
  params?: TParams
): TData | null {
  const cacheKey = getPrefetchKey(contract, params);
  const cached = prefetchCache.get(cacheKey);
  return cached ? (cached as unknown as TData) : null;
}

/**
 * Clear prefetch cache for a specific contract or all contracts
 */
export function clearPrefetchCache<TParams>(contract?: Contract, params?: TParams): void {
  if (contract) {
    const cacheKey = getPrefetchKey(contract, params);
    prefetchCache.delete(cacheKey);
  } else {
    prefetchCache.clear();
  }
}

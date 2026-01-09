import { useState, useEffect, useCallback, useRef } from 'react';
import type { Contract, ContractStatus } from '@reactive-contracts/core';
import type { UseContractOptions, UseContractResult } from './types.js';

// Simple in-memory cache
const contractCache = new Map<string, any>();

/**
 * Generate a cache key for a contract with params
 */
function getCacheKey(contract: Contract, params?: any): string {
  const paramsKey = params ? JSON.stringify(params) : '';
  return `${contract.definition.name}:${paramsKey}`;
}

/**
 * Default contract status
 */
const defaultContractStatus: ContractStatus = {
  latency: 'normal',
  freshness: 'fresh',
  availability: 'available',
};

/**
 * React hook for consuming contracts
 *
 * @example
 * ```tsx
 * const { data, loading, contractStatus } = useContract(UserProfileContract, {
 *   params: { userId: '123' }
 * });
 * ```
 */
export function useContract<TData = any>(
  contract: Contract,
  options: UseContractOptions = {}
): UseContractResult<TData> {
  const { params, enabled = true, refetchInterval, onSuccess, onError } = options;

  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [contractStatus, setContractStatus] = useState<ContractStatus>(defaultContractStatus);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const cacheKey = getCacheKey(contract, params);

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = contractCache.get(cacheKey);
      if (cached) {
        setData(cached.data);
        setContractStatus(cached.status);
        setLoading(false);
        onSuccess?.(cached.data);
        return;
      }

      // In a real implementation, this would call the backend
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Mock data based on contract shape
      const mockData = createMockData(contract);

      const result = {
        data: mockData,
        status: defaultContractStatus,
        timestamp: Date.now(),
        params,
      };

      contractCache.set(cacheKey, result);
      setData(mockData);
      setContractStatus(defaultContractStatus);
      onSuccess?.(mockData);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      onError?.(errorObj);
    } finally {
      setLoading(false);
    }
  }, [contract, params, enabled, onSuccess, onError]);

  const refetch = useCallback(async () => {
    const cacheKey = getCacheKey(contract, params);
    contractCache.delete(cacheKey);
    await fetchData();
  }, [contract, params, fetchData]);

  useEffect(() => {
    fetchData();

    // Set up polling if specified
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refetchInterval, enabled]);

  return {
    data,
    loading,
    error,
    contractStatus,
    refetch,
  };
}

/**
 * Create mock data based on contract shape
 * This is a placeholder - in real implementation, data comes from backend
 */
function createMockData(contract: Contract): any {
  const mockData: any = {};

  for (const [key, type] of Object.entries(contract.definition.shape)) {
    if (typeof type === 'string') {
      switch (type) {
        case 'string':
          mockData[key] = `mock-${key}`;
          break;
        case 'number':
          mockData[key] = 42;
          break;
        case 'boolean':
          mockData[key] = true;
          break;
        case 'Date':
          mockData[key] = new Date();
          break;
        default:
          if (type.startsWith('URL')) {
            mockData[key] = 'https://example.com/mock.jpg';
          } else {
            mockData[key] = null;
          }
      }
    } else if (typeof type === 'object' && type !== null && '_brand' in type) {
      // Handle DerivedField
      mockData[key] = null; // Derived fields are computed
    } else if (typeof type === 'object') {
      // Nested object
      mockData[key] = {};
      for (const [nestedKey, nestedType] of Object.entries(type)) {
        if (typeof nestedType === 'string') {
          switch (nestedType) {
            case 'string':
              mockData[key][nestedKey] = `mock-${nestedKey}`;
              break;
            case 'number':
              mockData[key][nestedKey] = 42;
              break;
            case 'boolean':
              mockData[key][nestedKey] = true;
              break;
            case 'Date':
              mockData[key][nestedKey] = new Date();
              break;
            default:
              if (typeof nestedType === 'string' && nestedType.startsWith('URL')) {
                mockData[key][nestedKey] = 'https://example.com/mock.jpg';
              } else {
                mockData[key][nestedKey] = null;
              }
          }
        }
      }
    }
  }

  return mockData;
}

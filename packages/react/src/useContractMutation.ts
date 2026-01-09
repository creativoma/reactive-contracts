import { useState, useCallback } from 'react';
import type { Contract } from '@reactive-contracts/core';
import type { UseContractMutationOptions, UseContractMutationResult } from './types.js';

/**
 * React hook for contract mutations
 *
 * @example
 * ```tsx
 * const [mutate, { loading, error }] = useContractMutation(CreateUserContract);
 * 
 * const handleSubmit = async () => {
 *   await mutate({ name: 'John', email: 'john@example.com' });
 * };
 * ```
 */
export function useContractMutation<TParams = any, TData = any>(
  contract: Contract,
  options: UseContractMutationOptions<TParams, TData> = {}
): [
  (params: TParams) => Promise<TData>,
  Omit<UseContractMutationResult<TParams, TData>, 'mutate'>
] {
  const { onSuccess, onError, onSettled } = options;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | undefined>(undefined);

  const mutate = useCallback(
    async (params: TParams): Promise<TData> => {
      try {
        setLoading(true);
        setError(null);

        // In a real implementation, this would call the backend
        // For now, we'll simulate a mutation
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Mock response
        const mockResponse = {
          success: true,
          ...params,
        } as TData;

        setData(mockResponse);
        onSuccess?.(mockResponse);

        return mockResponse;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Mutation failed');
        setError(errorObj);
        onError?.(errorObj);
        throw errorObj;
      } finally {
        setLoading(false);
        onSettled?.();
      }
    },
    [contract, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(undefined);
  }, []);

  return [mutate, { loading, error, data, reset }];
}

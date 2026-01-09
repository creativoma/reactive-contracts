import type { Contract } from '@reactive-contracts/core';
import type { UseContractOptions } from './types.js';
import { useContract } from './useContract.js';

/**
 * React hook for consuming contracts with Suspense support
 * 
 * This hook throws a promise while loading, which React Suspense catches
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const data = useContractSuspense(UserProfileContract, {
 *     params: { userId }
 *   });
 *   
 *   return <div>{data.user.name}</div>;
 * }
 * 
 * // Usage with Suspense
 * <Suspense fallback={<Loading />}>
 *   <UserProfile userId="123" />
 * </Suspense>
 * ```
 */
export function useContractSuspense<TData = any>(
  contract: Contract,
  options: UseContractOptions = {}
): TData {
  const { data, loading, error } = useContract<TData>(contract, options);

  if (error) {
    throw error;
  }

  if (loading || data === undefined) {
    // Create a promise that will be resolved when data is available
    // React Suspense will catch this promise
    throw new Promise<void>((resolve) => {
      // This is a simplified implementation
      // In a real implementation, we'd track the promise and resolve it when data arrives
      setTimeout(resolve, 100);
    });
  }

  return data;
}

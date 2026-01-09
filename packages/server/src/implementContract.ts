import type { Contract } from '@reactive-contracts/core';
import type { ContractImplementation, ContractResolver, ResolverContext } from './types.js';

/**
 * Implement a contract resolver on the server side
 *
 * @example
 * ```typescript
 * const UserProfileResolver = implementContract(UserProfileContract, {
 *   async resolve({ userId }, context) {
 *     const user = await db.users.findById(userId);
 *     return {
 *       user: {
 *         id: user.id,
 *         name: user.name,
 *         avatar: user.avatarUrl,
 *       },
 *     };
 *   },
 *   cache: {
 *     ttl: '5m',
 *     tags: (params) => [`user:${params.userId}`],
 *   },
 * });
 * ```
 */
export function implementContract<TParams = any, TData = any>(
  contract: Contract,
  implementation: ContractImplementation<TParams, TData>
): ContractResolver<TParams, TData> {
  // Validate implementation
  if (!implementation.resolve || typeof implementation.resolve !== 'function') {
    throw new Error(`Contract ${contract.definition.name} must have a resolve function`);
  }

  const execute = async (params: TParams, context: ResolverContext = {}): Promise<TData> => {
    try {
      // Validate params if validator provided
      if (implementation.validate) {
        const isValid = await implementation.validate(params);
        if (!isValid) {
          throw new Error('Parameter validation failed');
        }
      }

      // Execute the resolver
      const startTime = Date.now();
      const result = await implementation.resolve(params, context);
      const executionTime = Date.now() - startTime;

      // Check latency constraints
      if (contract.definition.constraints?.latency) {
        const maxLatency = parseLatency(contract.definition.constraints.latency.max);
        if (executionTime > maxLatency) {
          console.warn(
            `Contract ${contract.definition.name} exceeded latency constraint: ${executionTime}ms > ${maxLatency}ms`
          );
        }
      }

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');

      // Call error handler if provided
      implementation.onError?.(err, params, context);

      throw err;
    }
  };

  return {
    contract,
    implementation,
    execute,
  };
}

/**
 * Parse latency string to milliseconds
 */
function parseLatency(latency: string): number {
  const match = latency.match(/^(\d+)(ms|s|m)$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid latency format: ${latency}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    default:
      throw new Error(`Unknown latency unit: ${unit}`);
  }
}

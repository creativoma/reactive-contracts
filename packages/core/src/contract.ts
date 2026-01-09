import type {
  Contract,
  ContractDefinition,
  DerivedField,
  DerivationContext,
  LatencyConstraint,
  ShapeDefinition,
} from './types.js';

/**
 * Creates a contract definition
 *
 * @example
 * ```typescript
 * const UserProfileContract = contract({
 *   name: 'UserProfile',
 *   intent: 'Display user profile with activity summary',
 *   shape: {
 *     user: {
 *       id: 'string',
 *       name: 'string',
 *       avatar: 'URL<optimized:200x200>',
 *     },
 *   },
 * });
 * ```
 */
export function contract<TShape extends ShapeDefinition>(
  definition: ContractDefinition<TShape>
): Contract<TShape> {
  // Validate the contract definition
  if (!definition.name || typeof definition.name !== 'string') {
    throw new Error('Contract must have a valid name');
  }

  if (!definition.intent || typeof definition.intent !== 'string') {
    throw new Error('Contract must have a valid intent');
  }

  if (!definition.shape || typeof definition.shape !== 'object') {
    throw new Error('Contract must have a valid shape definition');
  }

  return {
    _brand: 'Contract' as const,
    definition,
  };
}

/**
 * Creates a derived field that can be computed on client, edge, or origin
 *
 * @example
 * ```typescript
 * const statusField = derive(ctx =>
 *   ctx.lastActive > daysAgo(7) ? 'active' : 'inactive'
 * );
 * ```
 */
export function derive<TContext extends DerivationContext, TReturn>(
  fn: (ctx: TContext) => TReturn,
  options?: {
    dependencies?: string[];
    preferredLayer?: 'client' | 'edge' | 'origin';
  }
): DerivedField<TContext, TReturn> {
  return {
    _brand: 'DerivedField' as const,
    derive: fn,
    dependencies: options?.dependencies,
    preferredLayer: options?.preferredLayer,
  };
}

/**
 * Creates a latency constraint with maximum allowed time
 *
 * @example
 * ```typescript
 * constraints: {
 *   latency: max('100ms', { fallback: 'cachedVersion' })
 * }
 * ```
 */
export function max(
  maxLatency: string,
  options?: {
    fallback?: 'cachedVersion' | 'degraded' | 'error';
  }
): LatencyConstraint {
  return {
    max: maxLatency,
    fallback: options?.fallback,
  };
}

/**
 * Creates a fallback strategy for when constraints cannot be met
 *
 * @example
 * ```typescript
 * latency: max('50ms', { fallback: fallback('cachedVersion') })
 * ```
 */
export function fallback(
  strategy: 'cachedVersion' | 'degraded' | 'error'
): 'cachedVersion' | 'degraded' | 'error' {
  return strategy;
}

/**
 * Helper function to calculate days ago from current date
 *
 * @example
 * ```typescript
 * derive(ctx => ctx.lastActive > daysAgo(7) ? 'active' : 'inactive')
 * ```
 */
export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Type guard to check if a value is a Contract
 */
export function isContract(value: unknown): value is Contract {
  return (
    typeof value === 'object' && value !== null && '_brand' in value && value._brand === 'Contract'
  );
}

/**
 * Type guard to check if a value is a DerivedField
 */
export function isDerivedField(value: unknown): value is DerivedField<any, any> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_brand' in value &&
    value._brand === 'DerivedField'
  );
}

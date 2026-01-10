/**
 * Core types for Reactive Contracts
 */

/**
 * Primitive type definitions supported by contracts
 */
export type PrimitiveType = 'string' | 'number' | 'boolean' | 'Date' | 'null' | 'undefined';

/**
 * URL type with optional optimization parameters
 */
export type URLType = `URL<${string}>` | 'URL';

/**
 * Type definition that can be a primitive, URL, or nested object
 * Uses any for DerivedField to allow specific type definitions in contracts
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeDefinition = PrimitiveType | URLType | ShapeDefinition | DerivedField<any, any>;

/**
 * Shape definition for contract data structure
 */
export interface ShapeDefinition {
  [field: string]: TypeDefinition;
}

/**
 * Base context type for derived field functions
 * Can be extended with specific properties
 */
export type DerivationContext = Record<string, unknown>;

/**
 * Derived field definition
 */
export interface DerivedField<TContext extends DerivationContext, TReturn> {
  _brand: 'DerivedField';
  derive: (ctx: TContext) => TReturn;
  dependencies?: string[];
  preferredLayer?: 'client' | 'edge' | 'origin';
}

/**
 * Latency constraint configuration
 */
export interface LatencyConstraint {
  max: string;
  fallback?: 'cachedVersion' | 'degraded' | 'error';
}

/**
 * Freshness constraint configuration
 */
export interface FreshnessConstraint {
  maxAge: string;
  staleWhileRevalidate?: string;
}

/**
 * Availability constraint configuration
 */
export interface AvailabilityConstraint {
  uptime: string;
  gracefulDegradation?: boolean;
}

/**
 * Contract constraints
 */
export interface ContractConstraints {
  latency?: LatencyConstraint;
  freshness?: FreshnessConstraint;
  availability?: AvailabilityConstraint;
}

/**
 * Polling configuration for reactivity
 */
export interface PollingConfig {
  field: string;
  interval: string;
}

/**
 * Event-driven configuration for reactivity
 */
export interface EventConfig {
  field: string;
  on: string[];
}

/**
 * Reactivity configuration for contract fields
 */
export interface ReactivityConfig {
  realtime?: string[];
  static?: string[];
  polling?: PollingConfig[];
  eventDriven?: EventConfig[];
}

/**
 * Migration function for contract versioning
 */
export type MigrationFn<TFrom = Record<string, unknown>, TTo = Record<string, unknown>> = (
  oldData: TFrom
) => TTo;

/**
 * Versioning configuration
 */
export interface VersioningConfig {
  version: string;
  deprecated?: string[];
  migration?: MigrationFn;
}

/**
 * Contract definition
 */
export interface ContractDefinition<TShape extends ShapeDefinition = ShapeDefinition> {
  name: string;
  intent: string;
  shape: TShape;
  constraints?: ContractConstraints;
  reactivity?: ReactivityConfig;
  versioning?: VersioningConfig;
}

/**
 * Contract object returned by contract() function
 */
export interface Contract<TShape extends ShapeDefinition = ShapeDefinition> {
  _brand: 'Contract';
  definition: ContractDefinition<TShape>;
}

/**
 * Contract status for monitoring
 */
export interface ContractStatus {
  latency: 'normal' | 'degraded' | 'violated';
  freshness: 'fresh' | 'stale' | 'expired';
  availability: 'available' | 'degraded' | 'unavailable';
}

/**
 * Contract execution result
 */
export interface ContractResult<TData> {
  data: TData;
  status: ContractStatus;
  metadata: {
    executionTime: number;
    cacheHit: boolean;
    derivedAt: 'client' | 'edge' | 'origin';
  };
}

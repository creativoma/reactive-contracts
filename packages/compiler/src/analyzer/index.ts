import type { Contract } from '@reactive-contracts/core';
import type { LatencyAnalysisResult } from '../types.js';

/**
 * Analyze latency constraints of a contract
 */
export function analyzeLatency(contract: Contract): LatencyAnalysisResult {
  const { definition } = contract;
  const suggestions: string[] = [];

  // If no latency constraint is specified, provide a suggestion
  if (!definition.constraints?.latency) {
    suggestions.push('Consider adding a latency constraint to ensure performance SLAs');
    return {
      status: 'ok',
      suggestions,
    };
  }

  const { max: maxLatency, fallback } = definition.constraints.latency;

  // Parse latency value
  const latencyMs = parseLatencyToMs(maxLatency);

  if (latencyMs === null) {
    return {
      status: 'error',
      message: `Invalid latency format: ${maxLatency}`,
      suggestions: ['Use format like "100ms", "1s", or "1m"'],
    };
  }

  // Analyze the latency requirement
  const analysis = analyzeLatencyRequirement(latencyMs);

  // Check if fallback strategy is appropriate
  if (!fallback) {
    suggestions.push('Consider specifying a fallback strategy (cachedVersion, degraded, or error)');
  }

  // Provide recommendations based on latency target
  if (latencyMs < 50) {
    suggestions.push(
      'Very aggressive latency target (<50ms). Consider edge caching or CDN for static data.'
    );
  } else if (latencyMs < 100) {
    suggestions.push(
      'Moderate latency target (<100ms). Ensure database queries are optimized and indexed.'
    );
  } else if (latencyMs > 1000) {
    suggestions.push(
      'High latency tolerance (>1s). Consider if this provides good user experience.'
    );
  }

  // Check for derived fields that might impact latency
  if (hasComplexDerivations(definition.shape)) {
    suggestions.push(
      'Contract contains derived fields. Consider computing these at edge or origin for better performance.'
    );
  }

  // Check reactivity modes that might impact latency
  if (definition.reactivity?.realtime && definition.reactivity.realtime.length > 0) {
    suggestions.push(
      'Realtime fields require WebSocket connections. Ensure your infrastructure supports this.'
    );
  }

  return {
    status: analysis.status,
    estimated: analysis.estimated,
    message: analysis.message,
    suggestions,
  };
}

/**
 * Parse latency string to milliseconds
 */
function parseLatencyToMs(latency: string): number | null {
  const match = latency.match(/^(\d+)(ms|s|m)$/);
  if (!match || !match[1] || !match[2]) return null;

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
      return null;
  }
}

/**
 * Analyze latency requirement and provide status
 */
function analyzeLatencyRequirement(latencyMs: number): {
  status: 'ok' | 'warning' | 'error';
  estimated?: string;
  message?: string;
} {
  // Simple heuristic-based analysis for MVP
  // In a real implementation, this would analyze the actual backend capabilities

  if (latencyMs < 10) {
    return {
      status: 'error',
      estimated: 'Typically 50-100ms for database queries',
      message: 'Latency target <10ms is extremely difficult to achieve consistently',
    };
  }

  if (latencyMs < 50) {
    return {
      status: 'warning',
      estimated: 'Requires edge caching or CDN',
      message: 'Latency target <50ms requires careful optimization',
    };
  }

  if (latencyMs <= 200) {
    return {
      status: 'ok',
      estimated: 'Achievable with optimized queries and caching',
      message: 'Latency target is reasonable for most applications',
    };
  }

  if (latencyMs <= 1000) {
    return {
      status: 'ok',
      estimated: 'Easily achievable with standard backend',
      message: 'Latency target is conservative and should be easy to meet',
    };
  }

  return {
    status: 'warning',
    estimated: 'Very high tolerance',
    message: 'Consider if this latency provides acceptable user experience',
  };
}

/**
 * Check if shape contains complex derived fields
 */
function hasComplexDerivations(shape: any): boolean {
  if (!shape || typeof shape !== 'object') {
    return false;
  }

  for (const value of Object.values(shape)) {
    if (typeof value === 'object' && value !== null) {
      if ('_brand' in value && value._brand === 'DerivedField') {
        return true;
      }
      if (hasComplexDerivations(value)) {
        return true;
      }
    }
  }

  return false;
}

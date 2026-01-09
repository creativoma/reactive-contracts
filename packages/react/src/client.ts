import type { Contract, ContractStatus } from '@reactive-contracts/core';
import { parseLatencyToMs } from '@reactive-contracts/core';

/**
 * Configuration for the contract client
 */
export interface ContractClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Response from contract execution
 */
export interface ContractResponse<TData> {
  data: TData;
  status: ContractStatus;
  metadata: {
    executionTime: number;
    cacheHit: boolean;
    derivedAt: 'client' | 'edge' | 'origin';
  };
}

/**
 * Global contract client configuration
 */
let globalConfig: ContractClientConfig = {
  baseUrl: '/api/contracts',
  timeout: 5000,
};

/**
 * Configure the global contract client
 */
export function configureContractClient(config: Partial<ContractClientConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Get the current client configuration
 */
export function getClientConfig(): ContractClientConfig {
  return { ...globalConfig };
}

/**
 * Execute a contract via HTTP
 */
export async function executeContract<TData>(
  contract: Contract,
  params?: any
): Promise<ContractResponse<TData>> {
  const config = getClientConfig();
  const startTime = Date.now();

  try {
    const url = `${config.baseUrl}/${contract.definition.name}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify({
        contract: contract.definition.name,
        params: params || {},
        version: contract.definition.versioning?.version || '1.0.0',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Contract execution failed: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as any;
    const executionTime = Date.now() - startTime;

    // Evaluate latency status
    const latencyStatus = evaluateLatencyStatus(
      contract,
      executionTime,
      result.metadata?.executionTime || executionTime
    );

    return {
      data: result.data,
      status: {
        latency: latencyStatus,
        freshness: result.status?.freshness || 'fresh',
        availability: result.status?.availability || 'available',
      },
      metadata: {
        executionTime: result.metadata?.executionTime || executionTime,
        cacheHit: result.metadata?.cacheHit || false,
        derivedAt: result.metadata?.derivedAt || 'origin',
      },
    };
  } catch (err) {
    const executionTime = Date.now() - startTime;

    // If it's an abort error, it's a timeout
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        data: {} as TData,
        status: {
          latency: 'violated',
          freshness: 'expired',
          availability: 'degraded',
        },
        metadata: {
          executionTime,
          cacheHit: false,
          derivedAt: 'origin',
        },
      };
    }

    throw err;
  }
}

/**
 * Evaluate latency status based on contract constraints
 */
function evaluateLatencyStatus(
  contract: Contract,
  actualLatency: number,
  reportedLatency?: number
): 'normal' | 'degraded' | 'violated' {
  const latencyConstraint = contract.definition.constraints?.latency;
  
  if (!latencyConstraint) {
    return 'normal';
  }

  const maxLatency = parseLatencyToMs(latencyConstraint.max);
  if (maxLatency === null) {
    return 'normal';
  }

  const latency = reportedLatency || actualLatency;

  if (latency <= maxLatency) {
    return 'normal';
  } else if (latency <= maxLatency * 1.5) {
    return 'degraded';
  } else {
    return 'violated';
  }
}

// Removed parseLatencyToMs - now imported from @reactive-contracts/core

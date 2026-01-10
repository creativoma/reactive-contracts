import type { Request, Response, NextFunction } from 'express';
import type { Contract } from '@reactive-contracts/core';
import type { ContractResolver } from './types.js';

/**
 * Create an Express handler for a contract resolver
 */
export function createContractHandler<TParams, TData>(
  resolver: ContractResolver<TParams, TData>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startTime = Date.now();

      // Extract params from request body
      const { params = {}, contract: contractName } = req.body;

      // Validate contract name matches
      if (contractName && contractName !== resolver.contract.definition.name) {
        res.status(400).json({
          error: 'Contract name mismatch',
          expected: resolver.contract.definition.name,
          received: contractName,
        });
        return;
      }

      // Execute the contract
      const reqWithUser = req as unknown as Record<string, unknown>;
      const userValue = reqWithUser.user;
      const result = await resolver.execute(params, {
        user:
          typeof userValue === 'object' && userValue !== null
            ? (userValue as Record<string, unknown>)
            : undefined, // If using auth middleware
        headers: req.headers as Record<string, string>,
        ip: req.ip,
      });

      const executionTime = Date.now() - startTime;

      // Evaluate latency status
      const latencyStatus = evaluateLatencyStatus(resolver.contract, executionTime);

      // Send response
      res.json({
        data: result,
        status: {
          latency: latencyStatus,
          freshness: 'fresh',
          availability: 'available',
        },
        metadata: {
          executionTime,
          cacheHit: false,
          derivedAt: 'origin',
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Create an Express router for multiple contract resolvers
 * Uses Record with generic resolver type for flexibility
 */
export function createContractRouter<
  TResolvers extends Record<string, ContractResolver<unknown, unknown>>,
>(resolvers: TResolvers): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract contract name from URL or body
      const contractName = req.params.contract || req.body.contract;

      if (!contractName) {
        res.status(400).json({
          error: 'Contract name is required',
        });
        return;
      }

      const resolver = resolvers[contractName];

      if (!resolver) {
        res.status(404).json({
          error: 'Contract not found',
          contract: contractName,
          available: Object.keys(resolvers),
        });
        return;
      }

      // Delegate to contract handler
      const handler = createContractHandler(resolver);
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Evaluate latency status based on contract constraints
 */
function evaluateLatencyStatus(
  contract: Contract,
  actualLatency: number
): 'normal' | 'degraded' | 'violated' {
  const latencyConstraint = contract.definition.constraints?.latency;

  if (!latencyConstraint) {
    return 'normal';
  }

  const maxLatency = parseLatencyToMs(latencyConstraint.max);
  if (maxLatency === null) {
    return 'normal';
  }

  if (actualLatency <= maxLatency) {
    return 'normal';
  } else if (actualLatency <= maxLatency * 1.5) {
    return 'degraded';
  } else {
    return 'violated';
  }
}

/**
 * Parse latency string to milliseconds
 */
function parseLatencyToMs(latency: string): number | null {
  const match = latency.match(/^(\d+)(ms|s|m)$/);
  if (!match || !match[1] || !match[2]) {
    return null;
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
      return null;
  }
}

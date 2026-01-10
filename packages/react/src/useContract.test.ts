import { describe, it, expect, beforeEach, vi } from 'vitest';
import { contract } from '@reactive-contracts/core';
import { useContract } from './useContract.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock React hooks for testing
let mockState: any = {};
let mockSetState: any = {};
let mockCallbacks: any = {};

vi.mock('react', () => ({
  useState: (initial: any) => {
    const key = JSON.stringify(initial);
    if (!(key in mockState)) {
      mockState[key] = initial;
    }
    mockSetState[key] = (newValue: any) => {
      mockState[key] = typeof newValue === 'function' ? newValue(mockState[key]) : newValue;
    };
    return [mockState[key], mockSetState[key]];
  },
  useEffect: (fn: any, deps?: any[]) => {
    // Store callback for manual execution
    const key = JSON.stringify(deps || []);
    mockCallbacks[key] = fn;
    // Execute immediately for testing
    const cleanup = fn();
    if (typeof cleanup === 'function') {
      mockCallbacks[`cleanup_${key}`] = cleanup;
    }
  },
  useCallback: (fn: any) => fn,
  useRef: (initial: any) => ({ current: initial }),
}));

describe('useContract', () => {
  const testContract = contract({
    name: 'TestContract',
    intent: 'Test contract for useContract hook',
    shape: {
      id: 'string',
      name: 'string',
      count: 'number',
    },
  });

  beforeEach(() => {
    mockState = {};
    mockSetState = {};
    mockCallbacks = {};
  });

  it('should create contract hook function', () => {
    expect(typeof useContract).toBe('function');
  });

  it('should accept contract and options', () => {
    const result = useContract(testContract, { params: { id: '123' } });
    expect(result).toBeDefined();
    expect(result.refetch).toBeDefined();
  });
});

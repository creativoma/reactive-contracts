import { describe, it, expect, beforeEach, vi } from 'vitest';
import { contract } from '@reactive-contracts/core';
import { useContractMutation } from './useContractMutation.js';

// Mock React hooks for testing
let mockState: any = {};
let mockSetState: any = {};

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
  useCallback: (fn: any) => fn,
}));

describe('useContractMutation', () => {
  const testContract = contract({
    name: 'CreateUserContract',
    intent: 'Create a new user',
    shape: {
      name: 'string',
      email: 'string',
    },
  });

  beforeEach(() => {
    mockState = {};
    mockSetState = {};
  });

  it('should create mutation hook function', () => {
    expect(typeof useContractMutation).toBe('function');
  });

  it('should return mutate function and state', () => {
    const [mutate, state] = useContractMutation(testContract);
    
    expect(typeof mutate).toBe('function');
    expect(state).toBeDefined();
    expect(typeof state.reset).toBe('function');
  });

  it('should execute mutation', async () => {
    const [mutate] = useContractMutation(testContract);

    const result = await mutate({ name: 'John', email: 'john@example.com' });
    expect(result).toBeDefined();
  });
});

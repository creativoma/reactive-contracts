import { describe, it, expect, vi } from 'vitest';
import { contract, max } from '@reactive-contracts/core';
import { implementContract } from './implementContract.js';

describe('implementContract', () => {
  const testContract = contract({
    name: 'TestContract',
    intent: 'Test contract',
    shape: {
      id: 'string',
      name: 'string',
    },
  });

  it('should create a contract resolver', () => {
    const resolver = implementContract(testContract, {
      resolve: async (params: { id: string }) => ({
        id: params.id,
        name: 'Test Name',
      }),
    });

    expect(resolver).toBeDefined();
    expect(resolver.contract).toBe(testContract);
    expect(typeof resolver.execute).toBe('function');
  });

  it('should execute resolver function', async () => {
    const resolver = implementContract(testContract, {
      resolve: async (params: { id: string }) => ({
        id: params.id,
        name: 'Test Name',
      }),
    });

    const result = await resolver.execute({ id: '123' });
    expect(result).toEqual({ id: '123', name: 'Test Name' });
  });

  it('should throw error if resolve function not provided', () => {
    expect(() =>
      implementContract(testContract, {
        resolve: null as any,
      })
    ).toThrow('must have a resolve function');
  });

  it('should validate params if validator provided', async () => {
    const resolver = implementContract(testContract, {
      resolve: async (params: { id: string }) => ({
        id: params.id,
        name: 'Test Name',
      }),
      validate: (params: { id: string }) => params.id.length > 0,
    });

    const result = await resolver.execute({ id: '123' });
    expect(result).toBeDefined();
  });

  it('should throw error if validation fails', async () => {
    const resolver = implementContract(testContract, {
      resolve: async (params: { id: string }) => ({
        id: params.id,
        name: 'Test Name',
      }),
      validate: () => false,
    });

    await expect(resolver.execute({ id: '123' })).rejects.toThrow('Parameter validation failed');
  });

  it('should call onError handler on error', async () => {
    const onError = vi.fn();
    const resolver = implementContract(testContract, {
      resolve: async () => {
        throw new Error('Test error');
      },
      onError,
    });

    await expect(resolver.execute({ id: '123' })).rejects.toThrow('Test error');
    expect(onError).toHaveBeenCalled();
  });

  it('should warn when latency constraint exceeded', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const slowContract = contract({
      name: 'SlowContract',
      intent: 'Slow contract',
      shape: { id: 'string' },
      constraints: {
        latency: max('10ms'),
      },
    });

    const resolver = implementContract(slowContract, {
      resolve: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return { id: '123' };
      },
    });

    await resolver.execute({ id: '123' });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('exceeded latency constraint'));

    warnSpy.mockRestore();
  });
});

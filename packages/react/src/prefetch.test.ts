import { describe, it, expect, beforeEach } from 'vitest';
import { contract } from '@reactive-contracts/core';
import { prefetchContract, clearPrefetchCache, getPrefetchedData } from './prefetch.js';

describe('prefetchContract', () => {
  const testContract = contract({
    name: 'TestContract',
    intent: 'Test contract for prefetch',
    shape: {
      id: 'string',
      name: 'string',
    },
  });

  beforeEach(() => {
    clearPrefetchCache();
  });

  it('should prefetch contract data', async () => {
    await prefetchContract(testContract, { params: { id: '123' } });

    const cachedData = getPrefetchedData(testContract, { id: '123' });
    expect(cachedData).toBeDefined();
  });

  it('should not prefetch if already cached', async () => {
    await prefetchContract(testContract, { params: { id: '123' } });
    const firstData = getPrefetchedData(testContract, { id: '123' });

    await prefetchContract(testContract, { params: { id: '123' } });
    const secondData = getPrefetchedData(testContract, { id: '123' });

    expect(firstData).toBe(secondData);
  });

  it('should prefetch without params', async () => {
    await prefetchContract(testContract);

    const cachedData = getPrefetchedData(testContract);
    expect(cachedData).toBeDefined();
  });
});

describe('clearPrefetchCache', () => {
  const testContract = contract({
    name: 'TestContract',
    intent: 'Test contract',
    shape: { id: 'string' },
  });

  beforeEach(() => {
    clearPrefetchCache();
  });

  it('should clear specific contract cache', async () => {
    await prefetchContract(testContract, { params: { id: '123' } });
    expect(getPrefetchedData(testContract, { id: '123' })).toBeDefined();

    clearPrefetchCache(testContract, { id: '123' });
    expect(getPrefetchedData(testContract, { id: '123' })).toBeNull();
  });

  it('should clear all cache when no contract specified', async () => {
    await prefetchContract(testContract, { params: { id: '123' } });
    expect(getPrefetchedData(testContract, { id: '123' })).toBeDefined();

    clearPrefetchCache();
    expect(getPrefetchedData(testContract, { id: '123' })).toBeNull();
  });
});

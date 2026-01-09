import { describe, it, expect } from 'vitest';
import {
  contract,
  derive,
  max,
  fallback,
  daysAgo,
  isContract,
  isDerivedField,
} from './contract.js';

describe('contract', () => {
  it('should create a valid contract', () => {
    const testContract = contract({
      name: 'TestContract',
      intent: 'Test intent',
      shape: {
        field1: 'string',
        field2: 'number',
      },
    });

    expect(testContract._brand).toBe('Contract');
    expect(testContract.definition.name).toBe('TestContract');
    expect(testContract.definition.intent).toBe('Test intent');
    expect(testContract.definition.shape).toEqual({
      field1: 'string',
      field2: 'number',
    });
  });

  it('should throw error for missing name', () => {
    expect(() =>
      contract({
        name: '',
        intent: 'Test intent',
        shape: { field: 'string' },
      })
    ).toThrow('Contract must have a valid name');
  });

  it('should throw error for missing intent', () => {
    expect(() =>
      contract({
        name: 'Test',
        intent: '',
        shape: { field: 'string' },
      })
    ).toThrow('Contract must have a valid intent');
  });

  it('should throw error for missing shape', () => {
    expect(() =>
      contract({
        name: 'Test',
        intent: 'Test intent',
        shape: null as any,
      })
    ).toThrow('Contract must have a valid shape definition');
  });

  it('should support constraints', () => {
    const testContract = contract({
      name: 'TestContract',
      intent: 'Test intent',
      shape: { field: 'string' },
      constraints: {
        latency: max('100ms', { fallback: 'cachedVersion' }),
      },
    });

    expect(testContract.definition.constraints?.latency).toEqual({
      max: '100ms',
      fallback: 'cachedVersion',
    });
  });

  it('should support reactivity config', () => {
    const testContract = contract({
      name: 'TestContract',
      intent: 'Test intent',
      shape: { field: 'string' },
      reactivity: {
        realtime: ['field1'],
        static: ['field2'],
        polling: [{ field: 'field3', interval: '30s' }],
      },
    });

    expect(testContract.definition.reactivity).toBeDefined();
    expect(testContract.definition.reactivity?.realtime).toEqual(['field1']);
    expect(testContract.definition.reactivity?.static).toEqual(['field2']);
  });
});

describe('derive', () => {
  it('should create a derived field', () => {
    const derivedField = derive((ctx: { value: number }) => ctx.value * 2);

    expect(derivedField._brand).toBe('DerivedField');
    expect(derivedField.derive({ value: 5 })).toBe(10);
  });

  it('should support dependencies', () => {
    const derivedField = derive((ctx: { a: number; b: number }) => ctx.a + ctx.b, {
      dependencies: ['a', 'b'],
    });

    expect(derivedField.dependencies).toEqual(['a', 'b']);
    expect(derivedField.derive({ a: 2, b: 3 })).toBe(5);
  });

  it('should support preferred layer', () => {
    const derivedField = derive((ctx: { value: number }) => ctx.value, {
      preferredLayer: 'edge',
    });

    expect(derivedField.preferredLayer).toBe('edge');
  });
});

describe('max', () => {
  it('should create latency constraint', () => {
    const constraint = max('100ms');

    expect(constraint).toEqual({
      max: '100ms',
      fallback: undefined,
    });
  });

  it('should support fallback option', () => {
    const constraint = max('50ms', { fallback: 'cachedVersion' });

    expect(constraint).toEqual({
      max: '50ms',
      fallback: 'cachedVersion',
    });
  });
});

describe('fallback', () => {
  it('should return fallback strategy', () => {
    expect(fallback('cachedVersion')).toBe('cachedVersion');
    expect(fallback('degraded')).toBe('degraded');
    expect(fallback('error')).toBe('error');
  });
});

describe('daysAgo', () => {
  it('should calculate days ago from current date', () => {
    const sevenDaysAgo = daysAgo(7);
    const now = new Date();
    const expectedDate = new Date(now);
    expectedDate.setDate(now.getDate() - 7);

    // Compare dates (ignoring milliseconds)
    expect(sevenDaysAgo.toDateString()).toBe(expectedDate.toDateString());
  });
});

describe('isContract', () => {
  it('should return true for contract objects', () => {
    const testContract = contract({
      name: 'Test',
      intent: 'Test intent',
      shape: { field: 'string' },
    });

    expect(isContract(testContract)).toBe(true);
  });

  it('should return false for non-contract objects', () => {
    expect(isContract({})).toBe(false);
    expect(isContract(null)).toBe(false);
    expect(isContract('string')).toBe(false);
    expect(isContract({ _brand: 'NotContract' })).toBe(false);
  });
});

describe('isDerivedField', () => {
  it('should return true for derived field objects', () => {
    const field = derive((ctx: { value: number }) => ctx.value);

    expect(isDerivedField(field)).toBe(true);
  });

  it('should return false for non-derived field objects', () => {
    expect(isDerivedField({})).toBe(false);
    expect(isDerivedField(null)).toBe(false);
    expect(isDerivedField('string')).toBe(false);
    expect(isDerivedField({ _brand: 'NotDerivedField' })).toBe(false);
  });
});

import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

/**
 * Sample Contract
 *
 * This is an example contract to help you get started.
 * You can modify or delete this file.
 */
export const SampleContract = contract({
  name: 'Sample',
  intent: 'Demonstrate basic contract structure',

  shape: {
    data: {
      id: 'string',
      name: 'string',
      createdAt: 'Date',
    },
    metadata: {
      count: 'number',
      status: derive(
        (ctx: { data: { createdAt: Date } }) =>
          ctx.data.createdAt > daysAgo(30) ? 'recent' : 'old',
        {
          dependencies: ['data.createdAt'],
          preferredLayer: 'client',
        }
      ),
    },
  },

  constraints: {
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    static: ['data.id', 'data.name', 'data.createdAt'],
    polling: [{ field: 'metadata.count', interval: '30s' }],
  },
});

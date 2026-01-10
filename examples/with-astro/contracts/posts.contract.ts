import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

/**
 * Posts List Contract
 *
 * Define los datos necesarios para mostrar una lista de posts.
 */
export const PostsContract = contract({
  name: 'Posts',
  intent: 'Display a list of posts with author info and engagement metrics',

  shape: {
    posts: {
      total: 'number',
      hasMore: 'boolean',
    },
    metadata: {
      fetchedAt: 'Date',
      // Campo derivado: indica si los datos son frescos
      freshness: derive(
        (ctx: { fetchedAt: Date }) => (ctx.fetchedAt > daysAgo(0.01) ? 'fresh' : 'stale'), // ~15 min
        {
          dependencies: ['metadata.fetchedAt'],
          preferredLayer: 'client',
        }
      ),
    },
  },

  constraints: {
    latency: max('200ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    polling: [{ field: 'posts.total', interval: '60s' }],
  },
});

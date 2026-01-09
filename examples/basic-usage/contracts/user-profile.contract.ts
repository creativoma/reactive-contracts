import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

/**
 * User Profile Contract
 *
 * This contract defines the shape and requirements for displaying a user profile
 * with activity information.
 */
export const UserProfileContract = contract({
  name: 'UserProfile',
  intent: 'Display user profile with activity summary',

  shape: {
    user: {
      id: 'string',
      name: 'string',
      avatar: 'URL<optimized:200x200>' as const,
      joinedAt: 'Date',
    },
    activity: {
      postsCount: 'number',
      lastActive: 'Date',
      // This field is computed automatically based on lastActive
      status: derive(
        (ctx: { lastActive: Date }) => (ctx.lastActive > daysAgo(7) ? 'active' : 'inactive'),
        {
          dependencies: ['activity.lastActive'],
          preferredLayer: 'client', // Can be computed on client side
        }
      ),
    },
  },

  constraints: {
    // Maximum latency of 100ms with fallback to cached version
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    // These fields update in real-time via WebSocket
    realtime: ['activity.status'],

    // These fields are static and cached
    static: ['user.name', 'user.avatar', 'user.joinedAt'],

    // This field polls every 30 seconds
    polling: [{ field: 'activity.postsCount', interval: '30s' }],
  },
});

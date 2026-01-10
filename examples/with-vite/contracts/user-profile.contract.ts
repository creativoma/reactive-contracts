import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

/**
 * User Profile Contract
 *
 * Define exactamente lo que el frontend necesita para mostrar un perfil de usuario.
 * El contrato especifica la forma de los datos, restricciones de latencia y reactividad.
 */
export const UserProfileContract = contract({
  name: 'UserProfile',
  intent: 'Display user profile with activity summary and status',

  shape: {
    user: {
      id: 'string',
      name: 'string',
      email: 'string',
      avatar: 'URL<optimized:200x200>' as const,
      joinedAt: 'Date',
      bio: 'string',
    },
    stats: {
      postsCount: 'number',
      followersCount: 'number',
      followingCount: 'number',
    },
    activity: {
      lastActive: 'Date',
      // Campo derivado: se calcula automáticamente basado en lastActive
      status: derive(
        (ctx: { lastActive: Date }) =>
          ctx.lastActive > daysAgo(1) ? 'online' : ctx.lastActive > daysAgo(7) ? 'away' : 'offline',
        {
          dependencies: ['activity.lastActive'],
          preferredLayer: 'client',
        }
      ),
    },
  },

  constraints: {
    // Máxima latencia de 100ms, con fallback a versión cacheada
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    // Campos que se actualizan en tiempo real
    realtime: ['activity.status'],
    // Campos estáticos que se cachean
    static: ['user.name', 'user.avatar', 'user.bio', 'user.joinedAt'],
    // Campos que hacen polling cada 30s
    polling: [
      { field: 'stats.postsCount', interval: '30s' },
      { field: 'stats.followersCount', interval: '30s' },
    ],
  },
});

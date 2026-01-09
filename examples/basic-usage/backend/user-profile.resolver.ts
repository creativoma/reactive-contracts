import { implementContract } from '@reactive-contracts/server';
import { UserProfileContract } from '../contracts/user-profile.contract';

// Mock database (in a real app, this would be your actual database)
const db = {
  users: {
    async findById(id: string) {
      // Simulate database query
      return {
        id,
        name: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01'),
      };
    },
  },
  activity: {
    async getForUser(userId: string) {
      // Simulate database query
      return {
        posts: 42,
        lastSeen: new Date(),
      };
    },
  },
};

/**
 * User Profile Resolver
 *
 * Implements the backend logic for the UserProfileContract
 */
export const UserProfileResolver = implementContract(UserProfileContract, {
  async resolve({ userId }, context) {
    // Fetch user data
    const user = await db.users.findById(userId);

    // Fetch activity data
    const activity = await db.activity.getForUser(userId);

    // Return data matching the contract shape
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl, // System will handle optimization to 200x200
        joinedAt: user.createdAt,
      },
      activity: {
        postsCount: activity.posts,
        lastActive: activity.lastSeen,
        // Note: 'status' is a derived field, so we don't provide it here
        // It will be computed automatically based on lastActive
      },
    };
  },

  // Validation function (optional)
  validate: (params) => {
    return typeof params.userId === 'string' && params.userId.length > 0;
  },

  // Caching strategy (optional)
  cache: {
    ttl: '5m', // Cache for 5 minutes
    staleWhileRevalidate: '1h', // Serve stale data while revalidating for up to 1 hour
    tags: (params) => [`user:${params.userId}`], // Cache tags for invalidation
  },

  // Error handler (optional)
  onError: (error, params, context) => {
    console.error('UserProfile resolver error:', {
      error: error.message,
      userId: params.userId,
      user: context.user,
    });
  },
});

// Example: Using the resolver in an API endpoint
export async function handleUserProfileRequest(userId: string) {
  try {
    const result = await UserProfileResolver.execute(
      { userId },
      {
        // Context can include request info, authenticated user, etc.
        user: { id: 'current-user-id' },
      }
    );

    return {
      status: 200,
      body: result,
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Failed to fetch user profile' },
    };
  }
}

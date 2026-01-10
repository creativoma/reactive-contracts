/**
 * Simple Express server demonstrating Reactive Contracts
 *
 * Run with: pnpm run server (uses tsx)
 * Note: Uses tsx to load TypeScript files directly
 */

import express from 'express';
import cors from 'cors';
import { implementContract, createContractRouter } from '@reactive-contracts/server';
import { UserProfileContract } from './contracts/user-profile.contract.ts';

/** @type {import('express').Express} */
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const mockDb = {
  users: {
    '123': {
      id: '123',
      name: 'Alice Johnson',
      avatarUrl: 'https://i.pravatar.cc/200?img=1',
      createdAt: new Date('2024-01-15'),
    },
    '456': {
      id: '456',
      name: 'Bob Smith',
      avatarUrl: 'https://i.pravatar.cc/200?img=2',
      createdAt: new Date('2024-03-20'),
    },
  },
  activity: {
    '123': {
      posts: 42,
      lastSeen: new Date(),
    },
    '456': {
      posts: 15,
      lastSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  },
};

// Implement the UserProfile contract
const UserProfileResolver = implementContract(UserProfileContract, {
  async resolve({ userId }, context) {
    console.log(`Resolving UserProfile for userId: ${userId}`);

    // Simulate database query latency
    await new Promise(resolve => setTimeout(resolve, 50));

    const user = mockDb.users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const activity = mockDb.activity[userId] || {
      posts: 0,
      lastSeen: new Date(),
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl, // System will optimize to 200x200
        joinedAt: user.createdAt,
      },
      activity: {
        postsCount: activity.posts,
        lastActive: activity.lastSeen,
        // Note: 'status' is a derived field - don't provide it
        // It will be computed based on lastActive
      },
    };
  },

  // Validation
  validate: (params) => {
    return typeof params.userId === 'string' && params.userId.length > 0;
  },

  // Cache configuration
  cache: {
    ttl: '5m',
    staleWhileRevalidate: '1h',
    tags: (params) => [`user:${params.userId}`],
  },

  // Error handling
  onError: (error, params, context) => {
    console.error('UserProfile resolver error:', {
      error: error.message,
      userId: params.userId,
      user: context.user,
    });
  },
});

// Create contract router
const contractRouter = createContractRouter({
  UserProfile: UserProfileResolver,
});

// Routes
app.post('/api/contracts/:contract', contractRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List available contracts
app.get('/api/contracts', (req, res) => {
  res.json({
    contracts: ['UserProfile'],
    endpoint: '/api/contracts/:contract',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Reactive Contracts Example Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running at: http://localhost:${PORT}
API endpoint: http://localhost:${PORT}/api/contracts/:contract
Health check: http://localhost:${PORT}/health

Available contracts:
- UserProfile

Example request:
POST http://localhost:${PORT}/api/contracts/UserProfile
{
  "contract": "UserProfile",
  "params": { "userId": "123" }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;

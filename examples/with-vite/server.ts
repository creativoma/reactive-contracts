/**
 * Mock Server for Reactive Contracts
 *
 * Este servidor simula un backend que implementa los contratos.
 * En producción, esto sería tu API real.
 *
 * Run with: pnpm run server
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const mockUsers: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    joinedAt: Date;
  }
> = {
  '1': {
    id: '1',
    name: 'María García',
    email: 'maria@example.com',
    avatar: 'https://i.pravatar.cc/200?img=1',
    bio: 'Full-stack developer passionate about TypeScript and React. Building the future of frontend development.',
    joinedAt: new Date('2024-03-15'),
  },
  '2': {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@example.com',
    avatar: 'https://i.pravatar.cc/200?img=3',
    bio: 'Product designer with a love for clean interfaces and great user experiences.',
    joinedAt: new Date('2024-06-20'),
  },
  '3': {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    avatar: 'https://i.pravatar.cc/200?img=5',
    bio: 'Tech lead and open source contributor. Always learning something new.',
    joinedAt: new Date('2023-11-10'),
  },
};

const mockStats: Record<
  string,
  {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  }
> = {
  '1': { postsCount: 42, followersCount: 1234, followingCount: 567 },
  '2': { postsCount: 28, followersCount: 890, followingCount: 234 },
  '3': { postsCount: 156, followersCount: 5678, followingCount: 123 },
};

const mockActivity: Record<string, { lastActive: Date }> = {
  '1': { lastActive: new Date() }, // online
  '2': { lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // away (3 days ago)
  '3': { lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // offline (10 days ago)
};

const mockPosts = [
  {
    id: '1',
    title: 'Getting Started with Reactive Contracts',
    content: 'Learn how to build type-safe APIs with bidirectional contracts...',
    authorId: '1',
    authorName: 'María García',
    authorAvatar: 'https://i.pravatar.cc/200?img=1',
    createdAt: new Date('2026-01-09'),
    likes: 45,
    comments: 12,
  },
  {
    id: '2',
    title: 'The Future of Frontend Development',
    content: 'Why frontend-first contracts are changing how we build apps...',
    authorId: '3',
    authorName: 'Ana Martínez',
    authorAvatar: 'https://i.pravatar.cc/200?img=5',
    createdAt: new Date('2026-01-08'),
    likes: 128,
    comments: 34,
  },
  {
    id: '3',
    title: 'Design Systems that Scale',
    content: 'Best practices for building maintainable component libraries...',
    authorId: '2',
    authorName: 'Carlos López',
    authorAvatar: 'https://i.pravatar.cc/200?img=3',
    createdAt: new Date('2026-01-07'),
    likes: 67,
    comments: 8,
  },
];

// Simulate network latency
const simulateLatency = async (ms: number = 100) => {
  const delay = Math.random() * ms + 50;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return delay;
};

// Contract endpoints
app.post('/api/contracts/:contract', async (req, res) => {
  const { contract } = req.params;
  const { params } = req.body;
  const startTime = Date.now();

  console.log(`📝 Contract Request: ${contract}`, params);

  try {
    let data: unknown;

    switch (contract) {
      case 'UserProfile': {
        await simulateLatency(100);
        const userId = params?.userId || '1';
        const user = mockUsers[userId];

        if (!user) {
          res.status(404).json({ error: `User not found: ${userId}` });
          return;
        }

        const stats = mockStats[userId];
        const activity = mockActivity[userId];

        data = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            joinedAt: user.joinedAt,
          },
          stats: {
            postsCount: stats.postsCount,
            followersCount: stats.followersCount,
            followingCount: stats.followingCount,
          },
          activity: {
            lastActive: activity.lastActive,
          },
        };
        break;
      }

      case 'Posts': {
        await simulateLatency(150);
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const items = mockPosts.slice(start, start + limit);

        data = {
          posts: {
            items: items.map((post) => ({
              id: post.id,
              title: post.title,
              content: post.content,
              author: {
                id: post.authorId,
                name: post.authorName,
                avatar: post.authorAvatar,
              },
              createdAt: post.createdAt,
              engagement: {
                likes: post.likes,
                comments: post.comments,
              },
            })),
            total: mockPosts.length,
            hasMore: start + limit < mockPosts.length,
          },
          metadata: {
            fetchedAt: new Date(),
          },
        };
        break;
      }

      default:
        res.status(404).json({ error: `Unknown contract: ${contract}` });
        return;
    }

    const executionTime = Date.now() - startTime;

    const response = {
      data,
      status: {
        latency: executionTime < 100 ? 'normal' : 'degraded',
        freshness: 'fresh',
        availability: 'available',
      },
      metadata: {
        executionTime,
        cacheHit: false,
        derivedAt: 'origin',
      },
    };

    console.log(`✅ Contract Response: ${contract} (${executionTime}ms)`);
    res.json(response);
  } catch (error) {
    console.error(`❌ Contract Error: ${contract}`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List available contracts
app.get('/api/contracts', (_req, res) => {
  res.json({
    contracts: ['UserProfile', 'Posts'],
    endpoint: '/api/contracts/:contract',
    method: 'POST',
    body: '{ "params": { ... } }',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Reactive Contracts Mock Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running at: http://localhost:${PORT}
API endpoint: http://localhost:${PORT}/api/contracts/:contract
Health check: http://localhost:${PORT}/health

Available contracts:
- UserProfile (params: { userId: string })
- Posts (params: { page?: number, limit?: number })

Example request:
curl -X POST http://localhost:${PORT}/api/contracts/UserProfile \\
  -H "Content-Type: application/json" \\
  -d '{"params": {"userId": "1"}}'
  `);
});

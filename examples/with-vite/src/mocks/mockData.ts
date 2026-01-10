/**
 * Mock data for testing reactive-contracts
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedAt: Date;
}

export interface MockUserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface MockUserActivity {
  lastActive: Date;
}

export interface MockPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
  likes: number;
  comments: number;
}

// Mock users database
export const mockUsers: Record<string, MockUser> = {
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

// Mock stats
export const mockStats: Record<string, MockUserStats> = {
  '1': { postsCount: 42, followersCount: 1234, followingCount: 567 },
  '2': { postsCount: 28, followersCount: 890, followingCount: 234 },
  '3': { postsCount: 156, followersCount: 5678, followingCount: 123 },
};

// Mock activity (dynamically updated)
export const mockActivity: Record<string, MockUserActivity> = {
  '1': { lastActive: new Date() }, // online
  '2': { lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // away (3 days ago)
  '3': { lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // offline (10 days ago)
};

// Mock posts
export const mockPosts: MockPost[] = [
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

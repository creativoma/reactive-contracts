'use client';

import { useContract } from '@reactive-contracts/react';
import { PostsContract } from '../contracts/posts.contract';
import Image from 'next/image';

interface PostsListProps {
  page?: number;
  limit?: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: Date;
  engagement: {
    likes: number;
    comments: number;
  };
}

// Extended shape that includes items from the server response
interface PostsData {
  posts: {
    items: Post[];
    total: number;
    hasMore: boolean;
  };
  metadata: {
    fetchedAt: Date;
  };
}

export function PostsList({ page = 1, limit = 10 }: PostsListProps) {
  const { data, loading, error, contractStatus, refetch } = useContract<
    { page: number; limit: number },
    PostsData
  >(PostsContract, { params: { page, limit } });

  if (loading) {
    return <PostsListSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
        <h3 className="text-red-500 mb-2 font-semibold">Error loading posts</h3>
        <p className="text-red-400 text-sm">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const posts = data.posts.items as Post[];

  return (
    <div className="flex flex-col gap-4">
      {/* Contract status indicator */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Posts</h2>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-sm">{data.posts.total} posts</span>
          {contractStatus?.latency === 'degraded' && (
            <span className="text-yellow-500 text-sm">⚠️ Slow</span>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load more */}
      {data.posts.hasMore && (
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:border-violet-500 hover:bg-zinc-800 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 hover:border-violet-500 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{post.author.name}</span>
          <span className="text-xs text-zinc-500">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
      <p className="text-zinc-400 text-sm mb-4">{post.content}</p>
      <div className="flex gap-6 text-sm text-zinc-500">
        <span>❤️ {post.engagement.likes}</span>
        <span>💬 {post.engagement.comments}</span>
      </div>
    </article>
  );
}

function PostsListSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-zinc-800 rounded w-32" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="h-4 bg-zinc-800 rounded w-24" />
            </div>
            <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-zinc-800 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

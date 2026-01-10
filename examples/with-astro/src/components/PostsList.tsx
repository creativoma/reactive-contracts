import { useContract } from '@reactive-contracts/react';
import { PostsContract } from '../../contracts/posts.contract';

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
      <div className="error-card">
        <h3>Error loading posts</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const posts = data.posts.items as Post[];

  return (
    <div className="posts-list">
      {/* Contract status indicator */}
      <div className="posts-header">
        <h2>Recent Posts</h2>
        <div className="posts-meta">
          <span className="total-posts">{data.posts.total} posts</span>
          {contractStatus?.latency === 'degraded' && (
            <span className="latency-warning">⚠️ Slow</span>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load more */}
      {data.posts.hasMore && (
        <button className="load-more" onClick={() => refetch()}>
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
    <article className="post-card">
      <div className="post-author">
        <img src={post.author.avatar} alt={post.author.name} className="post-author-avatar" />
        <div className="post-author-info">
          <span className="post-author-name">{post.author.name}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>
      <div className="post-engagement">
        <span className="likes">❤️ {post.engagement.likes}</span>
        <span className="comments">💬 {post.engagement.comments}</span>
      </div>
    </article>
  );
}

function PostsListSkeleton() {
  return (
    <div className="posts-list skeleton">
      <div className="posts-header">
        <div className="skeleton-text skeleton-title" />
      </div>
      <div className="posts-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="post-card skeleton">
            <div className="post-author">
              <div className="skeleton-avatar-small" />
              <div className="skeleton-text skeleton-author" />
            </div>
            <div className="skeleton-text skeleton-post-title" />
            <div className="skeleton-text skeleton-post-content" />
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

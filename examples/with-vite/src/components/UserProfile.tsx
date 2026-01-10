import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../../contracts/user-profile.contract';
import type { UserProfileShape } from '../../generated/frontend/UserProfile';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data, loading, error, contractStatus, refetch } = useContract<
    { userId: string },
    UserProfileShape
  >(UserProfileContract, { params: { userId } });

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="error-card">
        <h3>Error loading profile</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Calcular el status basado en la actividad (campo derivado)
  const getStatusFromActivity = (lastActive: Date) => {
    const now = new Date();
    const diffDays = (now.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) return 'online';
    if (diffDays < 7) return 'away';
    return 'offline';
  };

  const status = getStatusFromActivity(data.activity.lastActive);

  return (
    <div className="user-profile">
      {/* Status del contrato */}
      {contractStatus?.latency === 'degraded' && (
        <div className="contract-warning">⚠️ Using cached data (high latency detected)</div>
      )}

      {/* Header del perfil */}
      <div className="profile-header">
        <div className="avatar-container">
          <img src={data.user.avatar} alt={data.user.name} className="avatar" />
          <span className={`status-indicator ${status}`} title={status} />
        </div>
        <div className="profile-info">
          <h2>{data.user.name}</h2>
          <p className="email">{data.user.email}</p>
          <p className="bio">{data.user.bio}</p>
          <p className="joined">
            Joined{' '}
            {new Date(data.user.joinedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{data.stats.postsCount}</span>
          <span className="stat-label">Posts</span>
        </div>
        <div className="stat">
          <span className="stat-value">{formatNumber(data.stats.followersCount)}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-value">{data.stats.followingCount}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      {/* Activity status */}
      <div className="activity-status">
        <span className={`status-badge ${status}`}>
          {status === 'online' && '🟢 Online now'}
          {status === 'away' && '🟡 Away'}
          {status === 'offline' && '⚫ Offline'}
        </span>
        <span className="last-seen">
          Last active: {formatRelativeTime(data.activity.lastActive)}
        </span>
      </div>
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="user-profile skeleton">
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar skeleton-avatar" />
        </div>
        <div className="profile-info">
          <div className="skeleton-text skeleton-title" />
          <div className="skeleton-text skeleton-email" />
          <div className="skeleton-text skeleton-bio" />
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat">
          <div className="skeleton-text skeleton-stat" />
        </div>
        <div className="stat">
          <div className="skeleton-text skeleton-stat" />
        </div>
        <div className="stat">
          <div className="skeleton-text skeleton-stat" />
        </div>
      </div>
    </div>
  );
}

// Helpers
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

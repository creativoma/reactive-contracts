'use client';

import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';
import type { UserProfileShape } from '../generated/frontend/UserProfile';

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
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
        <h3 className="text-red-500 mb-2 font-semibold">Error loading profile</h3>
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

  // Calcular el status basado en la actividad (campo derivado)
  const getStatusFromActivity = (lastActive: Date) => {
    const now = new Date();
    const diffDays = (now.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) return 'online';
    if (diffDays < 7) return 'away';
    return 'offline';
  };

  const status = getStatusFromActivity(data.activity.lastActive);

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500',
  };

  const statusBadgeColors = {
    online: 'bg-green-500/10 text-green-500',
    away: 'bg-yellow-500/10 text-yellow-500',
    offline: 'bg-gray-500/10 text-gray-400',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status del contrato */}
      {contractStatus?.latency === 'degraded' && (
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg px-4 py-3 text-sm text-yellow-500">
          ⚠️ Using cached data (high latency detected)
        </div>
      )}

      {/* Header del perfil */}
      <div className="flex gap-6 items-start">
        <div className="relative flex-shrink-0">
          <img
            src={data.user.avatar}
            alt={data.user.name}
            className="w-28 h-28 rounded-full object-cover border-3 border-zinc-700"
          />
          <span
            className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-3 border-zinc-900 ${statusColors[status]}`}
            title={status}
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{data.user.name}</h2>
          <p className="text-zinc-500 mb-2">{data.user.email}</p>
          <p className="text-zinc-300 mb-2 leading-relaxed">{data.user.bio}</p>
          <p className="text-sm text-zinc-500">
            Joined{' '}
            {new Date(data.user.joinedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 py-4 border-y border-zinc-800">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-violet-500">{data.stats.postsCount}</span>
          <span className="text-sm text-zinc-500">Posts</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-violet-500">
            {formatNumber(data.stats.followersCount)}
          </span>
          <span className="text-sm text-zinc-500">Followers</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-violet-500">{data.stats.followingCount}</span>
          <span className="text-sm text-zinc-500">Following</span>
        </div>
      </div>

      {/* Activity status */}
      <div className="flex items-center gap-4">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadgeColors[status]}`}>
          {status === 'online' && '🟢 Online now'}
          {status === 'away' && '🟡 Away'}
          {status === 'offline' && '⚫ Offline'}
        </span>
        <span className="text-sm text-zinc-500">
          Last active: {formatRelativeTime(data.activity.lastActive)}
        </span>
      </div>
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex gap-6 items-start">
        <div className="w-28 h-28 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-3">
          <div className="h-7 bg-zinc-800 rounded w-48" />
          <div className="h-4 bg-zinc-800 rounded w-36" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-8 py-4 border-y border-zinc-800">
        <div className="h-12 bg-zinc-800 rounded w-16" />
        <div className="h-12 bg-zinc-800 rounded w-16" />
        <div className="h-12 bg-zinc-800 rounded w-16" />
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

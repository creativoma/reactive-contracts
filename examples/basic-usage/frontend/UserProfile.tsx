import React from 'react';
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';

interface UserProfileProps {
  userId: string;
}

/**
 * Type for UserProfile data based on contract shape
 */
interface UserProfileData {
  user: {
    id: string;
    name: string;
    avatar: string;
    joinedAt: Date;
  };
  activity: {
    postsCount: number;
    lastActive: Date;
    status: 'active' | 'inactive';
  };
}

/**
 * User Profile Component
 *
 * Demonstrates using a contract in a React component
 */
export function UserProfile({ userId }: UserProfileProps) {
  const { data, loading, error, contractStatus, refetch } = useContract<
    { userId: string },
    UserProfileData
  >(UserProfileContract, {
    params: { userId },
  });

  // Show loading skeleton
  if (loading) {
    return (
      <div className="user-profile-skeleton">
        <div className="avatar-skeleton" />
        <div className="name-skeleton" />
        <div className="info-skeleton" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="user-profile-error">
        <p>Failed to load user profile</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  // Show degraded state when using cached data
  if (contractStatus.latency === 'degraded' && data) {
    return (
      <div className="user-profile user-profile-degraded">
        <div className="degraded-notice">⚠️ Using cached data due to slow response</div>
        <UserProfileContent data={data} />
      </div>
    );
  }

  // No data available yet
  if (!data) {
    return null;
  }

  // Normal state
  return (
    <div className="user-profile">
      <UserProfileContent data={data} />

      {/* Show contract status for debugging */}
      <div className="contract-status">
        <span>Latency: {contractStatus.latency}</span>
        <span>Freshness: {contractStatus.freshness}</span>
        <span>Availability: {contractStatus.availability}</span>
      </div>
    </div>
  );
}

function UserProfileContent({ data }: { data: UserProfileData }) {
  return (
    <>
      <img
        src={data.user.avatar}
        alt={data.user.name}
        className="user-avatar"
        // Avatar is already optimized to 200x200 by the contract
      />
      <h1>{data.user.name}</h1>
      <div className="user-info">
        <p>Joined: {new Date(data.user.joinedAt).toLocaleDateString()}</p>
        <p>Posts: {data.activity.postsCount}</p>
        <p>
          Status:
          <span className={`status-badge status-${data.activity.status}`}>
            {data.activity.status}
          </span>
        </p>
        <p>Last active: {new Date(data.activity.lastActive).toLocaleDateString()}</p>
      </div>
    </>
  );
}

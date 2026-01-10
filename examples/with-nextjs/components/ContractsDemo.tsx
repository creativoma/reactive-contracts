'use client';

import { useState } from 'react';
import { UserProfile } from './UserProfile';
import { PostsList } from './PostsList';
import { setupMockContractClient } from '../lib/mockContractClient';

// Configurar el mock client al iniciar (antes del render)
setupMockContractClient();

export function ContractsDemo() {
  const [selectedUserId, setSelectedUserId] = useState('1');

  const users = [
    { id: '1', name: 'María García', status: 'online' },
    { id: '2', name: 'Carlos López', status: 'away' },
    { id: '3', name: 'Ana Martínez', status: 'offline' },
  ];

  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500',
  };

  return (
    <div className="flex flex-col gap-8">
      {/* User selector */}
      <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Select a user profile:</h3>
        <div className="flex gap-4 flex-wrap">
          {users.map((user) => (
            <button
              key={user.id}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all ${
                selectedUserId === user.id
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-violet-500'
              }`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <span className={`w-2 h-2 rounded-full ${statusColors[user.status]}`} />
              {user.name}
            </button>
          ))}
        </div>
      </section>

      {/* User Profile - usando el contrato */}
      <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          📋 UserProfile Contract
        </h3>
        <div className="bg-zinc-950 px-4 py-3 rounded-lg mb-6 font-mono text-sm text-violet-400 overflow-x-auto">
          <code>useContract(UserProfileContract, {'{ params: { userId } }'})</code>
        </div>
        <UserProfile userId={selectedUserId} />
      </section>

      {/* Posts List - usando el contrato */}
      <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">📰 Posts Contract</h3>
        <div className="bg-zinc-950 px-4 py-3 rounded-lg mb-6 font-mono text-sm text-violet-400 overflow-x-auto">
          <code>useContract(PostsContract, {'{ params: { page: 1, limit: 10 } }'})</code>
        </div>
        <PostsList page={1} limit={10} />
      </section>

      {/* Contract Features */}
      <section className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          ✨ Contract Features Demonstrated
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>
              <strong>Type-safe contracts:</strong> Shape defined in contract, types auto-generated
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>
              <strong>Derived fields:</strong>{' '}
              <code className="bg-zinc-950 px-2 py-0.5 rounded text-violet-400 text-sm">
                activity.status
              </code>{' '}
              computed from{' '}
              <code className="bg-zinc-950 px-2 py-0.5 rounded text-violet-400 text-sm">
                lastActive
              </code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>
              <strong>Latency constraints:</strong> Max 100ms with fallback to cached version
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>
              <strong>Reactivity modes:</strong> Static, polling, and realtime fields
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>
              <strong>Contract status:</strong> Latency, freshness, and availability tracking
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

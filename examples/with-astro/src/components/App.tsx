import { useState } from 'react';
import { UserProfile } from './UserProfile';
import { PostsList } from './PostsList';
import { setupMockContractClient } from '../mocks/mockContractClient';

// Configurar el mock client al iniciar (antes del render)
setupMockContractClient();

export function App() {
  const [selectedUserId, setSelectedUserId] = useState('1');

  const users = [
    { id: '1', name: 'María García', status: 'online' },
    { id: '2', name: 'Carlos López', status: 'away' },
    { id: '3', name: 'Ana Martínez', status: 'offline' },
  ];

  return (
    <div className="app">
      <main className="app-main">
        {/* User selector */}
        <section className="user-selector">
          <h3>Select a user profile:</h3>
          <div className="user-buttons">
            {users.map((user) => (
              <button
                key={user.id}
                className={`user-button ${selectedUserId === user.id ? 'active' : ''}`}
                onClick={() => setSelectedUserId(user.id)}
              >
                <span className={`mini-status ${user.status}`} />
                {user.name}
              </button>
            ))}
          </div>
        </section>

        {/* User Profile - usando el contrato */}
        <section className="section">
          <h3>📋 UserProfile Contract</h3>
          <div className="contract-info">
            <code>useContract(UserProfileContract, {'{ params: { userId } }'})</code>
          </div>
          <UserProfile userId={selectedUserId} />
        </section>

        {/* Posts List - usando el contrato */}
        <section className="section">
          <h3>📰 Posts Contract</h3>
          <div className="contract-info">
            <code>useContract(PostsContract, {'{ params: { page: 1, limit: 10 } }'})</code>
          </div>
          <PostsList page={1} limit={10} />
        </section>

        {/* Contract Features */}
        <section className="section features">
          <h3>✨ Contract Features Demonstrated</h3>
          <ul>
            <li>
              <strong>Type-safe contracts:</strong> Shape defined in contract, types auto-generated
            </li>
            <li>
              <strong>Derived fields:</strong> <code>activity.status</code> computed from{' '}
              <code>lastActive</code>
            </li>
            <li>
              <strong>Latency constraints:</strong> Max 100ms with fallback to cached version
            </li>
            <li>
              <strong>Reactivity modes:</strong> Static, polling, and realtime fields
            </li>
            <li>
              <strong>Contract status:</strong> Latency, freshness, and availability tracking
            </li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Open the browser console to see contract requests and responses.
          <br />
          Check <code>contracts/*.contract.ts</code> for contract definitions.
        </p>
      </footer>
    </div>
  );
}

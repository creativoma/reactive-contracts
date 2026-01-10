# Reactive Contracts - Vite Example

This example demonstrates how to use **Reactive Contracts** with [Vite](https://vite.dev/) and React.

## 🚀 Features

- **Vite + React**: Fast development with HMR
- **Type-safe contracts**: Define exactly what data your frontend needs
- **Derived fields**: Automatic computed values (like user status from `lastActive`)
- **Latency constraints**: Max 100ms with fallback to cached data
- **Reactivity modes**: Static, polling, and realtime fields

## 📁 Project Structure

```
with-vite/
├── contracts/
│   ├── user-profile.contract.ts   # UserProfile contract definition
│   ├── posts.contract.ts          # Posts contract definition
│   └── sample.contract.ts         # Sample contract
├── generated/                      # Auto-generated types (run compile)
│   ├── frontend/
│   ├── backend/
│   └── runtime/
├── src/
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Styles
│   ├── components/
│   │   ├── UserProfile.tsx        # User profile component
│   │   └── PostsList.tsx          # Posts list component
│   └── mocks/
│       └── mockContractClient.ts  # Contract client configuration
├── server.ts                      # Mock Express server
├── rcontracts.config.ts           # Compiler configuration
└── package.json
```

## 🛠️ Getting Started

### 1. Install dependencies

From the root of the monorepo:

```bash
pnpm install
```

Or from this directory:

```bash
cd examples/with-vite
pnpm install
```

### 2. Compile contracts

Generate TypeScript types from your contracts:

```bash
pnpm compile
```

### 3. Start development

Run both the mock server and Vite dev server:

```bash
pnpm dev:all
```

Or run them separately:

```bash
# Terminal 1: Start mock API server
pnpm server

# Terminal 2: Start Vite dev server
pnpm dev
```

### 4. Open in browser

Visit [http://localhost:5173](http://localhost:5173) to see the demo.

## 📝 How It Works

### Contract Definition

Contracts define the shape of data your frontend needs:

```typescript
import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

export const UserProfileContract = contract({
  name: 'UserProfile',
  intent: 'Display user profile with activity summary',

  shape: {
    user: { id: 'string', name: 'string', avatar: 'URL' },
    stats: { postsCount: 'number', followersCount: 'number' },
    activity: {
      lastActive: 'Date',
      status: derive(/* computed from lastActive */),
    },
  },

  constraints: {
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },
});
```

### Using Contracts in Components

```tsx
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';

function UserProfile({ userId }) {
  const { data, loading, error, contractStatus } = useContract(
    UserProfileContract,
    { params: { userId } }
  );

  // Render based on state...
}
```

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm server` | Start mock API server |
| `pnpm dev:all` | Start both servers concurrently |
| `pnpm compile` | Generate types from contracts |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |

## 📚 Learn More

- [Reactive Contracts Documentation](../../README.md)
- [Other Examples](../../README.md#examples)
  - [basic-usage](../basic-usage) - Basic Express setup
  - [with-nextjs](../with-nextjs) - Next.js example
  - [with-astro](../with-astro) - Astro example
- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)

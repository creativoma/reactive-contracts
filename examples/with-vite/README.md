# Reactive Contracts - Vite Example

This example demonstrates how to use **Reactive Contracts** with [Vite](https://vite.dev/) and React, including the **Vite plugin** for automatic contract compilation.

## 🚀 Features

- **Vite + React**: Fast development with HMR
- **🔄 Auto-compile with Vite Plugin**: Contracts compile automatically on change
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
├── generated/                      # Auto-generated types (compiled automatically!)
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
├── vite.config.ts                 # Vite config with reactiveContracts plugin
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

### 2. Start development

> **Note:** With the Vite plugin, contracts are compiled automatically! No need to run `pnpm compile` manually.

Run both the mock server and Vite dev server:

```bash
pnpm dev:all
```

You'll see the plugin compiling contracts:
```
[reactive-contracts] Compiling contracts...
[reactive-contracts] Found 3 contract file(s)
[reactive-contracts] ✓ Generated code for UserProfile
[reactive-contracts] ✓ Generated code for Posts
[reactive-contracts] ✓ Successfully compiled 3 contract(s)
```

Or run them separately:

```bash
# Terminal 1: Start mock API server
pnpm server

# Terminal 2: Start Vite dev server
pnpm dev
```

### 3. Open in browser

Visit [http://localhost:5173](http://localhost:5173) to see the demo.

### 4. Edit a contract

Try editing `contracts/posts.contract.ts` - the plugin will automatically recompile and HMR will update the browser!

```
[reactive-contracts] Contract changed: posts.contract.ts
[reactive-contracts] ✓ Recompiled PostsContract
[vite] (client) hmr update /src/components/PostsList.tsx
```

## ⚡ Vite Plugin

This example uses `@reactive-contracts/vite-plugin` for automatic contract compilation:

```typescript
// vite.config.ts
import { reactiveContracts } from '@reactive-contracts/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    reactiveContracts({
      logLevel: 'normal', // 'verbose' | 'normal' | 'silent'
    }),
  ],
});
```

**Features:**
- 🔄 Auto-compiles contracts on build start
- ⚡ HMR support - recompiles when contracts change
- 📝 Helpful warnings and suggestions
- ⚙️ Uses your `rcontracts.config.ts` automatically

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
| `pnpm dev` | Start Vite dev server (auto-compiles contracts) |
| `pnpm server` | Start mock API server |
| `pnpm dev:all` | Start both servers concurrently |
| `pnpm compile` | Manual compile (not needed with plugin) |
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

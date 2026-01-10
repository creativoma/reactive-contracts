# Reactive Contracts - Astro Example

This example demonstrates how to use **Reactive Contracts** with [Astro](https://astro.build/) using React islands for client-side interactivity.

## 🚀 Features

- **Astro + React Islands**: Server-rendered pages with hydrated React components
- **Type-safe contracts**: Define exactly what data your frontend needs
- **Derived fields**: Automatic computed values (like user status from `lastActive`)
- **Latency constraints**: Max 100ms with fallback to cached data
- **Reactivity modes**: Static, polling, and realtime fields

## 📁 Project Structure

```
with-astro/
├── contracts/
│   ├── user-profile.contract.ts   # UserProfile contract definition
│   ├── posts.contract.ts          # Posts contract definition
│   └── sample.contract.ts         # Sample contract
├── generated/                      # Auto-generated types (run compile)
│   ├── frontend/
│   ├── backend/
│   └── runtime/
├── src/
│   ├── components/
│   │   ├── App.tsx               # Main React app component
│   │   ├── UserProfile.tsx       # User profile component
│   │   └── PostsList.tsx         # Posts list component
│   ├── mocks/
│   │   └── mockContractClient.ts # Contract client configuration
│   ├── pages/
│   │   └── index.astro           # Main page with React island
│   └── styles/
│       └── global.css            # Global styles
├── server.ts                      # Mock Express server
├── rcontracts.config.ts          # Compiler configuration
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
cd examples/with-astro
pnpm install
```

### 2. Compile contracts

Generate TypeScript types from your contracts:

```bash
pnpm compile
```

### 3. Start development

Run both the mock server and Astro dev server:

```bash
pnpm dev:all
```

Or run them separately:

```bash
# Terminal 1: Start mock API server
pnpm server

# Terminal 2: Start Astro dev server
pnpm dev
```

### 4. Open in browser

Visit [http://localhost:4321](http://localhost:4321) to see the demo.

## 📝 How It Works

### Astro + React Islands

Astro renders the page on the server, but React components are hydrated on the client using the `client:load` directive:

```astro
---
import { App } from '../components/App';
---

<App client:load />
```

This means:
- Initial HTML is server-rendered for fast load times
- React components hydrate on the client for interactivity
- Contract data is fetched client-side after hydration

### Contract Usage

Components use the `useContract` hook to fetch data:

```tsx
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../../contracts/user-profile.contract';

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
| `pnpm dev` | Start Astro dev server |
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
  - [with-vite](../with-vite) - Vite example
- [Astro Documentation](https://docs.astro.build/)
- [@astrojs/react Integration](https://docs.astro.build/en/guides/integrations-guide/react/)

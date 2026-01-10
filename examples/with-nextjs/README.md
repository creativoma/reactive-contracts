# Reactive Contracts - Next.js Example

This example demonstrates how to use **Reactive Contracts** with [Next.js](https://nextjs.org/) App Router using Client Components.

## 🚀 Features

- **Next.js App Router**: Modern React Server Components architecture
- **Client Components**: Interactive components with `"use client"` directive
- **Tailwind CSS**: Beautiful, responsive styling out of the box
- **Type-safe contracts**: Define exactly what data your frontend needs
- **Derived fields**: Automatic computed values (like user status from `lastActive`)
- **Latency constraints**: Max 100ms with fallback to cached data

## 📁 Project Structure

```
with-nextjs/
├── contracts/
│   ├── user-profile.contract.ts   # UserProfile contract definition
│   ├── posts.contract.ts          # Posts contract definition
│   └── sample.contract.ts         # Sample contract
├── generated/                      # Auto-generated types (run compile)
│   ├── frontend/
│   ├── backend/
│   └── runtime/
├── components/
│   ├── ContractsDemo.tsx          # Main demo component (client)
│   ├── UserProfile.tsx            # User profile component (client)
│   └── PostsList.tsx              # Posts list component (client)
├── lib/
│   └── mockContractClient.ts      # Contract client configuration
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
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
cd examples/with-nextjs
pnpm install
```

### 2. Compile contracts

Generate TypeScript types from your contracts:

```bash
pnpm compile
```

### 3. Start development

Run both the mock server and Next.js dev server:

```bash
pnpm dev:all
```

Or run them separately:

```bash
# Terminal 1: Start mock API server
pnpm server

# Terminal 2: Start Next.js dev server
pnpm dev
```

### 4. Open in browser

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

## 📝 How It Works

### Client Components

Since `useContract` is a React hook, components that use it must be Client Components:

```tsx
'use client';

import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';

export function UserProfile({ userId }) {
  const { data, loading, error, contractStatus } = useContract(
    UserProfileContract,
    { params: { userId } }
  );

  // Render based on state...
}
```

### Server vs Client Components

- **Server Components**: Default in App Router, great for static content
- **Client Components**: Required for hooks, interactivity, and browser APIs

In this example:
- `app/page.tsx` - Server Component (renders the layout)
- `components/*.tsx` - Client Components (use `useContract` hook)

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm server` | Start mock API server |
| `pnpm dev:all` | Start both servers concurrently |
| `pnpm compile` | Generate types from contracts |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |

## 🎨 Styling

This example uses Tailwind CSS for styling. The design follows a dark theme with:
- Zinc color palette for backgrounds
- Violet accents for interactive elements
- Responsive layout with max-width container

## 📚 Learn More

- [Reactive Contracts Documentation](../../README.md)
- [Other Examples](../../README.md#examples)
  - [basic-usage](../basic-usage) - Basic Express setup
  - [with-vite](../with-vite) - Vite example
  - [with-astro](../with-astro) - Astro example
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

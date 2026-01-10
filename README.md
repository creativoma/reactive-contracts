![Reactive Contracts](public/cover.webp)

<p align="center">
  <strong>Bidirectional API contracts that put frontend in control</strong>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#core-concepts">Concepts</a> •
  <a href="#api-reference">API</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.2--beta-blue" alt="Version" />
  <img src="https://img.shields.io/badge/status-beta-orange" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/TypeScript-5.4+-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build" />
  <img src="https://img.shields.io/badge/tests-34%20passing-brightgreen" alt="Tests" />
</p>

---

## The Problem

Today's frontend is a second-class citizen. We consume whatever the backend decides to expose, deal with overfetching and underfetching, and pray that API changes don't break production.

**Reactive Contracts inverts this relationship.** The frontend declares exactly what it needs, how it needs it, and the compiler ensures both sides honor the agreement—at build time, not runtime.

```typescript
// ❌ Traditional approach: Backend dictates, frontend adapts
const user = await fetch('/api/users/123'); // What fields? What latency? Who knows.

// ✅ Reactive Contracts: Frontend declares, system negotiates
contract UserCard {
  intent: "render user card with social proof"
  shape: {
    user: { name: string, avatar: URL<optimized:80x80> }
    socialProof: derive(followers.count > 1000 ? "verified" : "standard")
  }
  latency: max(50ms) | fallback(cachedVersion)
}
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Bidirectional Contracts** | Frontend declares needs, backend provides capabilities. Compiler validates compatibility. |
| **Build-Time Validation** | API mismatches fail compilation, not production. |
| **Latency Contracts** | Declare acceptable latency with automatic fallback strategies. |
| **Derived Fields** | Compute values at the optimal layer (client, edge, or origin). |
| **Selective Reactivity** | Specify which fields need real-time updates vs. static fetching. |
| **Zero Runtime Overhead** | Contracts compile away—no reflection, no runtime negotiation. |

---

## Installation

```bash
# npm
npm install @reactive-contracts/core @reactive-contracts/compiler

# yarn
yarn add @reactive-contracts/core @reactive-contracts/compiler

# pnpm
pnpm add @reactive-contracts/core @reactive-contracts/compiler
```

### Compiler Setup

```bash
# Add to your build pipeline
npx rcontracts init

# This creates:
# - contracts/           → Your contract definitions
# - rcontracts.config.ts → Compiler configuration
# - generated/           → Auto-generated types and resolvers
```

---

## Quick Start

### 1. Define a Contract

```typescript
// contracts/user-profile.contract.ts
import { contract, derive, max, fallback } from '@reactive-contracts/core';

export const UserProfileContract = contract({
  name: 'UserProfile',
  intent: 'Display user profile with activity summary',
  
  shape: {
    user: {
      id: 'string',
      name: 'string',
      avatar: 'URL<optimized:200x200>',
      joinedAt: 'Date',
    },
    activity: {
      postsCount: 'number',
      lastActive: 'Date',
      status: derive(ctx => 
        ctx.lastActive > daysAgo(7) ? 'active' : 'inactive'
      ),
    },
  },

  constraints: {
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    realtime: ['activity.status'],
    static: ['user.name', 'user.avatar', 'user.joinedAt'],
    polling: [{ field: 'activity.postsCount', interval: '30s' }],
  },
});
```

### 2. Compile Contracts

```bash
npx rcontracts compile

# Output:
# ✓ Validated UserProfile contract
# ✓ Generated frontend types → generated/frontend/UserProfile.ts
# ✓ Generated backend resolvers → generated/backend/UserProfile.resolver.ts
# ✓ Generated runtime negotiator → generated/runtime/UserProfile.negotiator.ts
```

### 3. Use in Frontend (React)

```tsx
// components/UserProfile.tsx
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';

export function UserProfile({ userId }: { userId: string }) {
  const { data, loading, contractStatus } = useContract(UserProfileContract, {
    params: { userId },
  });

  // contractStatus tells you if latency SLA is being met
  if (contractStatus.latency === 'degraded') {
    return <UserProfileSkeleton hint="Using cached data" />;
  }

  return (
    <div>
      <Avatar src={data.user.avatar} /> {/* Already optimized to 200x200 */}
      <h1>{data.user.name}</h1>
      <StatusBadge status={data.activity.status} /> {/* Derived automatically */}
    </div>
  );
}
```

### 4. Implement Backend Resolver

```typescript
// The compiler generates a typed resolver interface
// You just implement the data fetching logic

import { implementContract } from '@reactive-contracts/server';
import { UserProfileContract } from '../contracts/user-profile.contract';

export const UserProfileResolver = implementContract(UserProfileContract, {
  async resolve({ userId }, context) {
    const user = await db.users.findById(userId);
    const activity = await db.activity.getForUser(userId);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl, // System handles optimization
        joinedAt: user.createdAt,
      },
      activity: {
        postsCount: activity.posts,
        lastActive: activity.lastSeen,
        // status is derived—don't provide it
      },
    };
  },

  // Optional: Custom caching strategy
  cache: {
    ttl: '5m',
    staleWhileRevalidate: '1h',
    tags: (params) => [`user:${params.userId}`],
  },
});
```

---

## Core Concepts

### Contracts as Source of Truth

A contract is a **bidirectional agreement** between frontend and backend:

```
┌─────────────┐     Contract      ┌─────────────┐
│   Frontend  │ ◄──────────────►  │   Backend   │
│  (Consumer) │   Shape, Latency  │  (Provider) │
│             │   Reactivity      │             │
└─────────────┘                   └─────────────┘
        │                               │
        ▼                               ▼
   Types, Hooks                  Resolvers, Cache
   Loading States                Query Optimization
```

### Build-Time Validation

The compiler analyzes both sides and fails if the contract cannot be satisfied:

```bash
# Example: Backend can't meet latency requirement
$ npx rcontracts compile

✗ Contract violation in UserProfile:
  
  Frontend requires: latency ≤ 100ms
  Backend provides:  latency ~350ms (estimated)
  
  Suggestions:
  1. Add caching layer (estimated latency: 45ms)
  2. Relax latency requirement to 400ms
  3. Implement edge resolver for hot path

  Run `npx rcontracts diagnose UserProfile` for details.
```

### Derived Fields

Computations that can run on any layer:

```typescript
shape: {
  // This derivation can execute on:
  // - Client (if all dependencies are available)
  // - Edge (for performance)
  // - Origin (if requires DB access)
  
  discount: derive(ctx => {
    if (ctx.user.tier === 'premium') return 0.2;
    if (ctx.cart.total > 100) return 0.1;
    return 0;
  }, {
    preferredLayer: 'edge',      // Hint to compiler
    dependencies: ['user.tier', 'cart.total'],
  }),
}
```

### Reactivity Modes

Control how data stays fresh:

```typescript
reactivity: {
  // WebSocket / Server-Sent Events
  realtime: ['notifications.unread'],
  
  // Fetched once, cached
  static: ['user.name'],
  
  // Periodic refresh
  polling: [
    { field: 'activity.online', interval: '10s' },
  ],
  
  // Refetch on specific events
  eventDriven: [
    { field: 'cart.items', on: ['cart:updated', 'item:removed'] },
  ],
}
```

---

## API Reference

### Contract Definition

```typescript
contract({
  name: string;
  intent: string;  // Human-readable purpose
  
  shape: {
    [field: string]: Type | DerivedField;
  };
  
  constraints?: {
    latency?: LatencyConstraint;
    freshness?: FreshnessConstraint;
    availability?: AvailabilityConstraint;
  };
  
  reactivity?: {
    realtime?: string[];
    static?: string[];
    polling?: PollingConfig[];
    eventDriven?: EventConfig[];
  };
  
  versioning?: {
    version: string;
    deprecated?: string[];
    migration?: MigrationFn;
  };
});
```

### React Hooks

```typescript
// Basic usage
const { data, loading, error, contractStatus } = useContract(Contract, options);

// With suspense
const data = useContractSuspense(Contract, options);

// Mutation contracts
const [mutate, { loading }] = useContractMutation(MutationContract);

// Prefetching
prefetchContract(Contract, { params });
```

### CLI Commands

```bash
rcontracts init              # Initialize project
rcontracts compile           # Compile all contracts
rcontracts validate          # Validate without generating
rcontracts diagnose <name>   # Deep analysis of single contract
rcontracts diff              # Show changes since last compile
rcontracts migrate           # Run contract migrations
```

---

## Configuration

```typescript
// rcontracts.config.ts
import { defineConfig } from '@reactive-contracts/compiler';

export default defineConfig({
  contracts: './contracts/**/*.contract.ts',
  output: {
    frontend: './generated/frontend',
    backend: './generated/backend',
    runtime: './generated/runtime',
  },
  
  validation: {
    strictLatency: true,        // Fail on latency violations
    requireIntent: true,        // Require intent documentation
    maxComplexity: 10,          // Limit derivation complexity
  },
  
  optimization: {
    bundleSplitting: true,      // Split by contract
    treeShaking: true,          // Remove unused fields
    precompute: ['edge'],       // Precompute derivations at edge
  },
  
  integrations: {
    prisma: './prisma/schema.prisma',
    graphql: './schema.graphql',
  },
});
```

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Build Time                              │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Contract   │───▶│   Compiler   │───▶│  Generated   │      │
│  │ Definitions  │    │  & Validator │    │    Code      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                        Runtime                                 │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │◄──▶│  Negotiator  │◄──▶│   Backend    │      │
│  │    Client    │    │   (Edge)     │    │   Resolver   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │              │
│         ▼                   ▼                   ▼              │
│    Types, Hooks      SLA Monitoring      Query Execution       │
│    Loading States    Fallback Logic      Caching Layer         │
└────────────────────────────────────────────────────────────────┘
```

---

## Roadmap

| Phase | Status | Features |
|-------|--------|----------|
| **Alpha** | 🟢 Current | Core contracts, React integration, basic validation |
| **Beta** | 🟡 Q2 2026 | Edge runtime, latency monitoring, Vue/Svelte support |
| **1.0** | ⚪ Q4 2026 | Production-ready, enterprise features, IDE plugins |
| **Future** | ⚪ 2027+ | Multi-service contracts, AI-assisted optimization |

### Upcoming Features

- [ ] Visual contract editor
- [ ] Real-time SLA dashboard
- [ ] Automatic resolver generation from Prisma
- [ ] Contract versioning and migration tools
- [ ] Performance profiler integration

---

## Why Reactive Contracts?

### vs. GraphQL

GraphQL exposes a schema that frontend queries. Reactive Contracts inverts this: **frontend declares requirements**, backend proves it can satisfy them.

### vs. tRPC

tRPC shares types but doesn't validate constraints (latency, freshness) or support declarative reactivity.

### vs. REST + OpenAPI

OpenAPI documents what exists. Reactive Contracts enforce what's required—and fail builds when requirements can't be met.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Development setup
git clone https://github.com/reactive-contracts/reactive-contracts
cd reactive-contracts
pnpm install
pnpm test
```

---

## License

MIT © 2026 Reactive Contracts Contributors

---

<p align="center">
  <strong>Stop consuming APIs. Start negotiating contracts.</strong>
</p>

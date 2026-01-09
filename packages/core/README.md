# @reactive-contracts/core

Core types and functions for Reactive Contracts - a TypeScript framework for bidirectional API contracts.

## Installation

```bash
npm install @reactive-contracts/core
# or
yarn add @reactive-contracts/core
# or
pnpm add @reactive-contracts/core
```

## Usage

### Defining a Contract

```typescript
import { contract, derive, max, daysAgo } from '@reactive-contracts/core';

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
      status: derive(
        (ctx) => ctx.lastActive > daysAgo(7) ? 'active' : 'inactive',
        { dependencies: ['activity.lastActive'] }
      ),
    },
  },

  constraints: {
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    realtime: ['activity.status'],
    static: ['user.name', 'user.avatar'],
    polling: [{ field: 'activity.postsCount', interval: '30s' }],
  },
});
```

### Derived Fields

```typescript
import { derive } from '@reactive-contracts/core';

const discountField = derive(
  (ctx) => {
    if (ctx.user.tier === 'premium') return 0.2;
    if (ctx.cart.total > 100) return 0.1;
    return 0;
  },
  {
    preferredLayer: 'edge',
    dependencies: ['user.tier', 'cart.total'],
  }
);
```

## API

### `contract(definition)`

Creates a contract definition.

**Parameters:**
- `definition`: Contract configuration object
  - `name`: Contract name (string)
  - `intent`: Human-readable purpose (string)
  - `shape`: Data structure definition (object)
  - `constraints?`: Latency, freshness, availability constraints
  - `reactivity?`: Real-time update configuration
  - `versioning?`: Version and migration info

**Returns:** Typed contract object

### `derive(fn, options?)`

Creates a derived field that can be computed on client, edge, or origin.

**Parameters:**
- `fn`: Derivation function
- `options?`: Configuration
  - `dependencies?`: Field dependencies (string[])
  - `preferredLayer?`: 'client' | 'edge' | 'origin'

**Returns:** DerivedField object

### `max(latency, options?)`

Creates a latency constraint.

**Parameters:**
- `latency`: Maximum latency (e.g., '100ms', '2s', '1m')
- `options?`: Configuration
  - `fallback?`: 'cachedVersion' | 'degraded' | 'error'

**Returns:** LatencyConstraint object

### `fallback(strategy)`

Returns a fallback strategy identifier.

**Parameters:**
- `strategy`: 'cachedVersion' | 'degraded' | 'error'

**Returns:** Strategy string

### `daysAgo(days)`

Helper to calculate a date N days ago.

**Parameters:**
- `days`: Number of days

**Returns:** Date object

## TypeScript Support

This package is written in TypeScript and provides full type definitions. All contracts are fully typed, providing excellent IDE autocomplete and type safety.

## License

MIT

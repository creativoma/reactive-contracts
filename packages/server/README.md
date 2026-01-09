# @reactive-contracts/server

Server-side implementation utilities for Reactive Contracts.

## Installation

```bash
npm install @reactive-contracts/server @reactive-contracts/core
# or
yarn add @reactive-contracts/server @reactive-contracts/core
# or
pnpm add @reactive-contracts/server @reactive-contracts/core
```

## Usage

### Implementing a Contract

```typescript
import { implementContract } from '@reactive-contracts/server';
import { UserProfileContract } from './contracts/user-profile.contract';

export const UserProfileResolver = implementContract(UserProfileContract, {
  async resolve({ userId }, context) {
    const user = await db.users.findById(userId);
    const activity = await db.activity.getForUser(userId);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl,
        joinedAt: user.createdAt,
      },
      activity: {
        postsCount: activity.posts,
        lastActive: activity.lastSeen,
      },
    };
  },

  cache: {
    ttl: '5m',
    staleWhileRevalidate: '1h',
    tags: (params) => [`user:${params.userId}`],
  },
});
```

### With Validation

```typescript
export const CreateUserResolver = implementContract(CreateUserContract, {
  async resolve(params, context) {
    const user = await db.users.create(params);
    return user;
  },

  validate: (params) => {
    return params.email.includes('@') && params.name.length > 0;
  },

  onError: (error, params, context) => {
    console.error('Failed to create user:', error);
  },
});
```

### Using in an API Endpoint

```typescript
import { UserProfileResolver } from './resolvers/user-profile.resolver';

// Express example
app.get('/api/users/:userId', async (req, res) => {
  try {
    const result = await UserProfileResolver.execute(
      { userId: req.params.userId },
      { user: req.user }
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## API

### `implementContract(contract, implementation)`

Creates a contract resolver for server-side implementation.

**Parameters:**
- `contract`: Contract definition
- `implementation`: Implementation config
  - `resolve`: Resolver function `(params, context) => data | Promise<data>`
  - `validate?`: Validation function `(params) => boolean | Promise<boolean>`
  - `cache?`: Caching configuration
    - `ttl?`: Time to live (e.g., '5m', '1h')
    - `staleWhileRevalidate?`: Stale cache duration
    - `tags?`: Cache tag generator function
  - `onError?`: Error handler function

**Returns:** ContractResolver object with:
- `contract`: The original contract
- `implementation`: The implementation config
- `execute`: Function to execute the resolver

### Resolver Context

The context object passed to resolvers can include:
- `request?`: HTTP request object
- `headers?`: Request headers
- `user?`: Authenticated user
- Any custom properties you add

### Cache Configuration

- `ttl`: How long to cache the result (e.g., '5m' for 5 minutes)
- `staleWhileRevalidate`: How long to serve stale data while revalidating
- `tags`: Function that returns cache tags for invalidation

### Latency Monitoring

The server automatically monitors latency and logs warnings when constraints are exceeded:

```typescript
// If contract has: latency: max('100ms')
// And execution takes 350ms, a warning will be logged
```

## TypeScript Support

Full TypeScript support with type inference:
- Resolver functions are typed based on contract shape
- Context is fully typed
- Parameters are validated at compile time

## License

MIT

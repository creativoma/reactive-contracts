# @reactive-contracts/react

React hooks and utilities for Reactive Contracts.

## Installation

```bash
npm install @reactive-contracts/react @reactive-contracts/core
# or
yarn add @reactive-contracts/react @reactive-contracts/core
# or
pnpm add @reactive-contracts/react @reactive-contracts/core
```

## Peer Dependencies

- `react`: ^18.0.0 || ^19.0.0

## Usage

### useContract Hook

```typescript
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from './contracts/user-profile.contract';

function UserProfile({ userId }) {
  const { data, loading, error, contractStatus, refetch } = useContract(
    UserProfileContract,
    { params: { userId } }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <img src={data.user.avatar} alt={data.user.name} />
      {contractStatus.latency === 'degraded' && (
        <div>⚠️ Using cached data</div>
      )}
    </div>
  );
}
```

### useContractMutation Hook

```typescript
import { useContractMutation } from '@reactive-contracts/react';
import { CreateUserContract } from './contracts/create-user.contract';

function CreateUserForm() {
  const [mutate, { loading, error }] = useContractMutation(CreateUserContract);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutate({ name: 'John Doe', email: 'john@example.com' });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>Create User</button>
    </form>
  );
}
```

### useContractSuspense Hook

```typescript
import { Suspense } from 'react';
import { useContractSuspense } from '@reactive-contracts/react';
import { UserProfileContract } from './contracts/user-profile.contract';

function UserProfile({ userId }) {
  const data = useContractSuspense(UserProfileContract, { params: { userId } });

  return <div>{data.user.name}</div>;
}

// Usage with Suspense
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

### Prefetching

```typescript
import { prefetchContract } from '@reactive-contracts/react';
import { UserProfileContract } from './contracts/user-profile.contract';

function UserLink({ userId }) {
  return (
    <a
      href={`/user/${userId}`}
      onMouseEnter={() => prefetchContract(UserProfileContract, { params: { userId } })}
    >
      View Profile
    </a>
  );
}
```

## API

### `useContract(contract, options?)`

Hook for consuming contracts in React components.

**Parameters:**
- `contract`: Contract definition
- `options?`: Configuration
  - `params?`: Parameters for the contract
  - `enabled?`: Whether to fetch (default: true)
  - `refetchInterval?`: Auto-refetch interval in ms
  - `onSuccess?`: Success callback
  - `onError?`: Error callback

**Returns:** Object with:
- `data`: Contract data (or undefined)
- `loading`: Loading state
- `error`: Error object (or null)
- `contractStatus`: Status object (latency, freshness, availability)
- `refetch`: Function to manually refetch

### `useContractMutation(contract, options?)`

Hook for contract mutations.

**Parameters:**
- `contract`: Contract definition
- `options?`: Configuration
  - `onSuccess?`: Success callback
  - `onError?`: Error callback
  - `onSettled?`: Settled callback

**Returns:** Array `[mutate, state]` where:
- `mutate`: Function to trigger mutation
- `state`: Object with loading, error, data, reset

### `useContractSuspense(contract, options?)`

Hook with React Suspense support.

**Parameters:**
- `contract`: Contract definition
- `options?`: Same as useContract

**Returns:** Contract data (throws promise while loading)

### `prefetchContract(contract, options?)`

Prefetch contract data for caching.

**Parameters:**
- `contract`: Contract definition
- `options?`: Configuration
  - `params?`: Parameters for the contract

**Returns:** Promise<void>

## License

MIT

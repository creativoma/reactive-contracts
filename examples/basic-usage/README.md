# Basic Usage Example

This example demonstrates the core features of Reactive Contracts.

## Structure

- `contracts/` - Contract definitions shared between frontend and backend
- `frontend/` - React frontend example
- `backend/` - Server-side resolver example

## Contract Definition

See `contracts/user-profile.contract.ts` for a complete example of:
- Shape definition
- Derived fields
- Latency constraints
- Reactivity configuration

## Frontend Usage

The frontend example shows how to:
- Use the `useContract` hook to fetch data
- Handle loading and error states
- Monitor contract status (latency, freshness, availability)

## Backend Implementation

The backend example demonstrates:
- Implementing a contract resolver
- Handling parameters
- Caching configuration
- Latency monitoring

## Running the Example

This is a reference implementation showing the API. In a real application:

1. Install dependencies:
```bash
pnpm install
```

2. The frontend would use the contract:
```tsx
import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from './contracts/user-profile.contract';

function UserProfile({ userId }) {
  const { data, loading, contractStatus } = useContract(UserProfileContract, {
    params: { userId }
  });
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{data.user.name}</div>;
}
```

3. The backend would implement the contract:
```typescript
import { implementContract } from '@reactive-contracts/server';
import { UserProfileContract } from './contracts/user-profile.contract';

const resolver = implementContract(UserProfileContract, {
  async resolve({ userId }, context) {
    const user = await db.users.findById(userId);
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl,
      }
    };
  }
});
```

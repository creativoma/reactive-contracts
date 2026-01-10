# Basic Usage Example

This example demonstrates the core features of Reactive Contracts with a **working end-to-end implementation**.

## Structure

- `contracts/` - Contract definitions shared between frontend and backend
- `frontend/` - React frontend example
- `backend/` - Server-side resolver example
- `server.js` - **Working Express server** that implements the contracts
- `generated/` - Auto-generated types and resolvers (created by compiler)

## Quick Start

### 1. Compile the Contracts

```bash
pnpm run compile
```

This generates:
- Frontend types in `generated/frontend/`
- Backend resolver templates in `generated/backend/`
- Runtime negotiators in `generated/runtime/`

### 2. Start the Server

```bash
pnpm install
pnpm run server
```

The server will start on http://localhost:3001

### 3. Test the API

```bash
curl -X POST http://localhost:3001/api/contracts/UserProfile \
  -H "Content-Type: application/json" \
  -d '{"contract": "UserProfile", "params": {"userId": "123"}}'
```

Expected response:
```json
{
  "data": {
    "user": {
      "id": "123",
      "name": "Alice Johnson",
      "avatar": "https://i.pravatar.cc/200?img=1",
      "joinedAt": "2024-01-15T00:00:00.000Z"
    },
    "activity": {
      "postsCount": 42,
      "lastActive": "2026-01-09T..."
    }
  },
  "status": {
    "latency": "normal",
    "freshness": "fresh",
    "availability": "available"
  },
  "metadata": {
    "executionTime": 52,
    "cacheHit": false,
    "derivedAt": "origin"
  }
}
```

## Features Demonstrated

### Contract Definition

See `contracts/user-profile.contract.ts` for:
- ✅ Shape definition with nested objects
- ✅ Derived fields (status computed from lastActive)
- ✅ Latency constraints (max 100ms)
- ✅ Reactivity configuration (realtime, static, polling)

### Frontend Usage

The frontend example (`frontend/UserProfile.tsx`) shows:
- ✅ Using `useContract` hook to fetch data
- ✅ Handling loading and error states
- ✅ Monitoring contract status (latency, freshness, availability)
- ✅ Displaying data with TypeScript type safety

### Backend Implementation

The backend example (`backend/user-profile.resolver.ts` and `server.js`) demonstrates:
- ✅ Implementing a contract resolver
- ✅ Parameter validation
- ✅ Caching configuration
- ✅ Error handling
- ✅ Express middleware integration

### Build-Time Validation

```bash
pnpm run validate
```

This checks:
- Contract structure validity
- Constraint feasibility  
- Latency requirements
- Field naming conventions

## Available Endpoints

- `POST /api/contracts/UserProfile` - Get user profile data
- `GET /health` - Health check
- `GET /api/contracts` - List available contracts

## Mock Data

The server includes mock data for two users:
- User ID `123` - Alice Johnson (active user)
- User ID `456` - Bob Smith (inactive user, last seen 10 days ago)

## Architecture

```
┌─────────────────┐
│   Contract      │  contracts/user-profile.contract.ts
│   Definition    │  
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │Compiler│  npx rcontracts compile
    └───┬────┘
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│  Frontend     │  │  Backend      │  │  Runtime     │
│  Types        │  │  Resolvers    │  │  Negotiators │
└───────┬───────┘  └───────┬───────┘  └──────┬───────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  
│  React        │  │  Express      │  
│  Component    │──│  Server       │  
└───────────────┘  └───────────────┘  
                   HTTP POST with params
```

## Next Steps

1. **Modify the contract** - Edit `contracts/user-profile.contract.ts`
2. **Recompile** - Run `pnpm run compile`
3. **Update the resolver** - Edit `server.js` to return the new shape
4. **Test** - Restart server and test with curl

## Learn More

- [Main README](../../README.md) - Full documentation
- [IMPLEMENTATION_ROADMAP](../../IMPLEMENTATION_ROADMAP.md) - Development roadmap
- [CLAUDE.md](../../CLAUDE.md) - Development guidelines

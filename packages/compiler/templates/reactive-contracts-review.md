---
title: Reactive Contracts Code Review
description: Review Reactive Contracts code for best practices and anti-patterns
---

# Reactive Contracts Code Review

When invoked with `/reactive-contracts-review <file>`, analyze the file for Reactive Contracts best practices, anti-patterns, and convention violations.

## Validation Rules

### Contract Structure
- [ ] Contract name is **PascalCase** (e.g., `UserProfile`, not `userProfile` or `user_profile`)
- [ ] Intent is descriptive (at least 10 characters recommended)
- [ ] Shape definition is non-empty
- [ ] All field names are **camelCase** (e.g., `firstName`, not `first_name`)
- [ ] Contract has valid `_brand: 'Contract'` property

### Type System
- [ ] Only valid primitive types: `'string'`, `'number'`, `'boolean'`, `'Date'`, `'null'`, `'undefined'`
- [ ] URL types use correct syntax: `'URL'` or `'URL<options>'`
- [ ] Derived fields have proper structure with `_brand: 'DerivedField'`
- [ ] Nested objects are properly typed (no `any` types)
- [ ] Type definitions are either strings, objects, or DerivedField instances

### Constraints Validation
- [ ] **Latency format:** Must match `\d+(ms|s|m)` (e.g., `"100ms"`, `"1s"`, `"5m"`)
  - Common mistake: `"100 ms"` with space ❌
  - Common mistake: `"0.1s"` with decimal ❌
- [ ] **Freshness format:** Must match `\d+(ms|s|m|h|d)` (e.g., `"5m"`, `"1h"`, `"1d"`)
- [ ] **Availability format:** Must match `\d+(\.\d+)?%` (e.g., `"99.9%"`)
- [ ] **Fallback strategy:** Must be one of: `'cachedVersion'`, `'degraded'`, `'error'`
- [ ] Latency constraint includes fallback strategy (recommended)

### Reactivity Configuration
- [ ] All referenced fields exist in shape definition
- [ ] Realtime fields are an array of strings
- [ ] Static fields are an array of strings
- [ ] Polling configs have both `field` and `interval` properties
- [ ] Polling intervals use valid format `\d+(ms|s|m)`
- [ ] Event-driven configs have non-empty `on` arrays
- [ ] No duplicate field references across reactivity modes

### Derived Fields
- [ ] Have a `derive` function
- [ ] Dependencies are explicitly listed as string array
- [ ] PreferredLayer is one of: `'client'`, `'edge'`, `'origin'` (if specified)
- [ ] **CRITICAL:** Never provided in resolver implementations
- [ ] Dependencies reference valid fields in shape

### Resolver Implementation
- [ ] Has a `resolve` function (required)
- [ ] Returns all non-derived shape fields
- [ ] **NEVER** returns derived fields
- [ ] Includes error handling (`validate` or `onError`)
- [ ] Has cache strategy defined (`ttl`, `staleWhileRevalidate`, `tags`)
- [ ] Parameter validation is implemented
- [ ] Context usage is properly typed

### Versioning (if used)
- [ ] Version follows semver format `\d+\.\d+\.\d+` (e.g., `"1.0.0"`)
- [ ] Deprecated fields are listed as array
- [ ] Migration function is provided if needed

---

## Common Anti-Patterns

### 🔴 Critical Issues (Will Break at Build Time)

#### ❌ **Providing Derived Fields in Resolver**
```typescript
// BAD - Compiler will reject this
const UserContract = contract({
  name: 'UserProfile',
  intent: 'Get user profile data',
  shape: {
    name: 'string',
    lastActive: 'Date',
    status: derive((ctx) =>
      ctx.lastActive > daysAgo(7) ? 'active' : 'inactive',
      { dependencies: ['lastActive'] }
    )
  }
});

implementContract(UserContract, {
  resolve: async () => ({
    name: "John Doe",
    lastActive: new Date(),
    status: "active" // ❌ ERROR! status is derived, don't provide it
  })
});
```

✅ **Correct - Only Base Fields**
```typescript
implementContract(UserContract, {
  resolve: async () => ({
    name: "John Doe",
    lastActive: new Date()
    // ✅ status will be computed automatically
  })
});
```

#### ❌ **Missing Required Resolver Function**
```typescript
// BAD - Runtime error
implementContract(UserContract, {
  // ❌ Missing resolve function
  cache: { ttl: '5m' }
});
```

✅ **Correct**
```typescript
implementContract(UserContract, {
  resolve: async (params, context) => {
    return { /* data */ };
  },
  cache: { ttl: '5m' }
});
```

#### ❌ **Invalid Latency Format**
```typescript
// BAD - Parser only accepts specific format
constraints: {
  latency: max('100 ms', { fallback: 'error' }) // ❌ Space not allowed
  // Also wrong: '0.1s', '100MS', '100milliseconds'
}
```

✅ **Correct**
```typescript
constraints: {
  latency: max('100ms', { fallback: 'error' }) // ✅ No space, lowercase unit
}
```

---

### ⚠️ Naming Convention Violations

#### ❌ **Non-PascalCase Contract Names**
```typescript
// BAD - Generates compiler warnings
contract({
  name: 'userProfile',      // ❌ camelCase
  name: 'user_profile',     // ❌ snake_case
  name: 'user-profile',     // ❌ kebab-case
})
```

✅ **Correct**
```typescript
contract({
  name: 'UserProfile',      // ✅ PascalCase
  name: 'BlogPostDetails',  // ✅ PascalCase
})
```

#### ❌ **Non-camelCase Field Names**
```typescript
// BAD - Generates warnings
shape: {
  first_name: 'string',     // ❌ snake_case
  'last-name': 'string',    // ❌ kebab-case
  PostCount: 'number',      // ❌ PascalCase
}
```

✅ **Correct**
```typescript
shape: {
  firstName: 'string',      // ✅ camelCase
  lastName: 'string',       // ✅ camelCase
  postCount: 'number',      // ✅ camelCase
}
```

---

### ⚠️ Performance & Architecture Issues

#### ❌ **Aggressive Latency Without Edge Caching**
```typescript
constraints: {
  latency: max('50ms', { fallback: 'error' })
  // ⚠️ <50ms is very aggressive - do you have edge caching?
}
```

✅ **Consider This**
```typescript
constraints: {
  latency: max('100ms', { fallback: 'cachedVersion' })
  // ✅ More realistic, with fallback strategy
}
```

**Latency Guidelines:**
- `<50ms`: Requires edge caching or CDN for static data
- `<100ms`: Ensure DB queries are optimized and indexed
- `>1000ms`: Consider if this provides good UX

#### ❌ **Complex Derivations Without Layer Hints**
```typescript
// BAD - Compiler can't optimize placement
status: derive((ctx) => {
  // Complex logic here...
  return computeExpensiveStatus(ctx);
})
```

✅ **Better**
```typescript
status: derive(
  (ctx) => computeExpensiveStatus(ctx),
  {
    dependencies: ['lastActive', 'subscriptionTier'],
    preferredLayer: 'edge' // ✅ Hint for optimization
  }
)
```

#### ❌ **Realtime Fields Without Infrastructure**
```typescript
reactivity: {
  realtime: ['notifications', 'messages']
  // ⚠️ Do you have WebSocket/SSE infrastructure?
}
```

✅ **Ensure Infrastructure**
```typescript
// Make sure you have WebSocket server setup
// Or use polling as alternative:
reactivity: {
  polling: [
    { field: 'notifications', interval: '30s' }
  ]
}
```

---

### 🔵 Type Safety Issues

#### ❌ **Missing Type Annotations in Derive**
```typescript
// BAD - No IDE support, type inference broken
status: derive((ctx) => {
  return ctx.lastActive > daysAgo(7) ? 'active' : 'inactive';
})
```

✅ **Better**
```typescript
status: derive(
  (ctx: { lastActive: Date }) => {
    return ctx.lastActive > daysAgo(7) ? 'active' : 'inactive';
  },
  { dependencies: ['lastActive'] }
)
```

#### ❌ **Using `any` in Contract Shape**
```typescript
// BAD - Defeats type safety
shape: {
  metadata: 'any' as any  // ❌ No no no
}
```

✅ **Correct**
```typescript
shape: {
  metadata: {             // ✅ Explicitly type nested objects
    createdAt: 'Date',
    updatedBy: 'string'
  }
}
```

#### ❌ **No Cache Invalidation Strategy**
```typescript
// BAD - Stale data will be served
implementContract(UserContract, {
  resolve: async () => ({ /* data */ }),
  cache: { ttl: '1h' }
  // ⚠️ No way to invalidate when user updates profile
});
```

✅ **Better**
```typescript
implementContract(UserContract, {
  resolve: async (params) => ({ /* data */ }),
  cache: {
    ttl: '1h',
    tags: (params) => [`user:${params.id}`] // ✅ Invalidate by tag
  }
});
```

---

## Output Format

For each issue found, provide output in this format for easy navigation:

```
<file>:<line>:<column> - [ERROR|WARNING] <description>
  Suggestion: <specific fix>
  Reference: <explanation or docs link>
```

### Examples

```
contracts/user.ts:15:3 - ERROR Derived field 'status' provided in resolver
  Suggestion: Remove 'status' from resolver return value. It will be computed automatically.
  Reference: Derived fields are computed from dependencies, not provided by backend.

contracts/user.ts:8:10 - WARNING Contract name 'userProfile' should be PascalCase
  Suggestion: Rename to 'UserProfile'
  Reference: Contract names must be PascalCase for consistency.

contracts/blog.ts:23:5 - WARNING Latency <50ms is very aggressive
  Suggestion: Consider edge caching or increase to 100ms with fallback strategy
  Reference: Sub-50ms latency typically requires CDN/edge infrastructure.
```

---

## Analysis Approach

When reviewing a file:

1. **Parse the file** to identify:
   - Contract definitions (calls to `contract()`)
   - Resolver implementations (calls to `implementContract()`)
   - Hook usage (calls to `useContract`, `useContractSuspense`, `useContractMutation`)

2. **Check each validation rule systematically:**
   - Start with ERRORS (breaking issues)
   - Then WARNINGS (style/convention issues)
   - Group related issues together

3. **Provide context:**
   - Show the problematic code snippet
   - Explain WHY it's an issue
   - Provide a SPECIFIC fix, not generic advice

4. **Prioritize by severity:**
   - 🔴 **ERROR**: Will break at build time or runtime
   - ⚠️ **WARNING**: Violates conventions or best practices
   - 💡 **INFO**: Suggestions for improvement

5. **Include positive feedback:**
   - If code follows all rules, say so!
   - Highlight well-implemented patterns
   - Encourage good practices

---

## Edge Cases & Special Situations

### Generated Code
If the file is in `.reactive-contracts/generated/`, skip review:
```
Skipping review: This is generated code. Review the source contracts instead.
```

### No Contracts Found
```
No contracts or resolvers found in this file.

If you're trying to use Reactive Contracts:
- Import contract from '@reactive-contracts/core'
- Define a contract with contract({ name, intent, shape })
- Implement with implementContract(YourContract, { resolve })
```

### Monorepo Detection
Respect workspace boundaries:
- Don't complain about missing types if imported from another package
- Validate contracts where they're defined, not where they're used

### Framework-Specific Patterns
Recognize framework integrations:
- **React**: `useContract`, `useContractSuspense`, `useContractMutation`
- **Express**: `createContractHandler`, `createContractRouter`
- **Next.js**: Server Components, Route Handlers

---

## Performance Analysis

When reviewing constraints, provide context:

### Latency Constraints
```
<50ms   → "Very aggressive - requires edge caching or CDN"
<100ms  → "Moderate - ensure DB queries are optimized"
<500ms  → "Standard - typical API response time"
>1000ms → "Slow - consider UX impact, show loading states"
```

### Cache Strategy
```
No cache           → "Consider adding cache for better performance"
ttl without tags   → "Add cache tags for selective invalidation"
Very long ttl      → "Ensure stale data is acceptable for this use case"
```

### Reactivity Modes
```
realtime           → "Verify WebSocket/SSE infrastructure exists"
polling <10s       → "Frequent polling - consider realtime instead"
static             → "Good for immutable data"
```

---

## Summary Template

After analysis, provide a summary:

```
✅ Checked: <N> contracts, <M> resolvers
🔴 Errors: <X> (must fix)
⚠️ Warnings: <Y> (should fix)
💡 Suggestions: <Z> (nice to have)

Overall: [GOOD | NEEDS WORK | CRITICAL ISSUES]

Top Priority Fixes:
1. <Most important issue>
2. <Second most important>
3. <Third most important>
```

---

## Additional Resources

- **Validator Source**: `packages/compiler/src/validator/index.ts`
- **Core Types**: `packages/core/src/types.ts`
- **Examples**: `examples/basic-usage/src/contracts/`
- **Documentation**: Check project README for detailed API reference

---

**Remember:** The goal is to help developers write better contracts, not just find problems. Be helpful, specific, and constructive in your feedback.

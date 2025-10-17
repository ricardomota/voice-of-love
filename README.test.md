# Testing Documentation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup
│   └── utils.tsx         # Test utilities and helpers
├── services/
│   └── __tests__/
│       └── creditService.test.ts
├── pages/
│   └── __tests__/
│       ├── Admin.test.tsx
│       └── Index.test.tsx
└── utils/
    └── __tests__/
        └── cspHeaders.test.ts
```

## What's Tested

### Critical Tests (P0)
✅ **Credit Service** - Prevents 406 errors with `.maybeSingle()`
✅ **Admin Routing** - Ensures admin-only access to `/admin`
✅ **Index Navigation** - Prevents auto-navigation conflicts
✅ **CSP Configuration** - Validates security headers

## Writing New Tests

### Service Tests
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('MyService', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Component Tests
```typescript
import { render, screen } from '@/test/utils';

it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

## Coverage Goals

- Overall: 80%+
- Critical paths: 100%
- Services: 90%+
- Components: 70%+

## Troubleshooting

### Tests failing locally but passing in CI
- Clear node_modules and reinstall
- Check Node version matches CI (v20)

### Mock issues
- Check mock paths in test files
- Ensure mocks are cleared between tests with `vi.clearAllMocks()`

### Timeout errors
- Increase timeout in test: `it('test', async () => {...}, 10000)`
- Check for unresolved promises

## Next Steps

1. Add integration tests for authentication flows
2. Add E2E tests for critical user journeys
3. Add visual regression tests
4. Increase coverage to 80%+

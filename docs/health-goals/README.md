
# Health Goals System Documentation

## Overview

The Health Goals System is a comprehensive module for managing user health objectives within the platform. It provides a unified interface for creating, tracking, and managing various health-related goals with real-time progress monitoring.

## Architecture

```
Health Goals System
├── Types & Schemas (src/types/healthGoals.ts)
├── Data Layer (src/utils/healthGoals.ts)
├── Business Logic (src/hooks/useOptimizedHealthGoals.ts)
├── UI Components
│   ├── Goal Management (OptimizedHealthGoalsManager.tsx)
│   ├── Goal Cards (GoalCard.tsx)
│   ├── Goal Forms (GoalForm.tsx)
│   └── Progress Tracking (DynamicHealthScore.tsx)
└── Database Integration (Supabase)
```

## Quick Start

```typescript
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import { OptimizedHealthGoalsManager } from '@/components/health-tracking/OptimizedHealthGoalsManager';

// Basic usage
function MyComponent() {
  const { goals, createGoal, updateGoal } = useOptimizedHealthGoals();
  
  return <OptimizedHealthGoalsManager />;
}
```

## Core Concepts

### Goal Types
- **Steps**: Daily step tracking
- **Exercise**: Exercise minutes tracking
- **Sleep**: Sleep hours monitoring
- **Water**: Water intake tracking
- **Weight**: Weight management goals
- **Stress**: Stress level management
- **Custom**: User-defined goals

### Data Flow
1. User creates goal via GoalForm
2. Data validated with Zod schemas
3. Transformed by HealthGoalMapper
4. Stored in Supabase with RLS policies
5. Real-time updates via optimized hooks
6. Progress displayed in GoalCard components

## Files Overview

- `src/types/healthGoals.ts` - Type definitions and Zod schemas
- `src/utils/healthGoals.ts` - Data transformation utilities
- `src/hooks/useOptimizedHealthGoals.ts` - Main business logic hook
- `src/components/health-goals/` - UI components directory

## Getting Started

1. Review the [API Reference](./api-reference.md)
2. Check [Component Documentation](./components.md)
3. See [Integration Guide](./integration-guide.md) for implementation examples
4. Follow [Best Practices](./best-practices.md) for optimal usage

## Support

For questions or issues, refer to the troubleshooting guide or contact the development team.

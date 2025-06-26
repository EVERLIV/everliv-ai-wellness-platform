# Health Goals Integration Guide

## Getting Started

This guide covers how to integrate the Health Goals system into your application.

## Prerequisites

- React 18+
- TypeScript
- Supabase client configured
- shadcn/ui components
- React Hook Form
- Zod validation

## Installation Steps

### 1. Database Setup

Ensure the `user_health_goals` table exists in your Supabase database:

```sql
CREATE TABLE user_health_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  target_weight NUMERIC,
  target_steps INTEGER DEFAULT 10000,
  target_exercise_minutes INTEGER DEFAULT 30,
  target_sleep_hours NUMERIC DEFAULT 8.0,
  target_water_intake NUMERIC DEFAULT 8.0,
  target_stress_level INTEGER DEFAULT 3,
  goal_type TEXT NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2. Import Required Files

```typescript
// Types and schemas
import { HealthGoal, CreateHealthGoalInput } from '@/types/healthGoals';

// Utilities
import { HealthGoalMapper, calculateProgress } from '@/utils/healthGoals';

// Hooks
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';

// Components
import OptimizedHealthGoalsManager from '@/components/health-tracking/OptimizedHealthGoalsManager';
import GoalCard from '@/components/health-goals/GoalCard';
import GoalForm from '@/components/health-goals/GoalForm';
```

### 3. Basic Implementation

```typescript
import React from 'react';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import OptimizedHealthGoalsManager from '@/components/health-tracking/OptimizedHealthGoalsManager';

function HealthDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Health Goals</h1>
      <OptimizedHealthGoalsManager />
    </div>
  );
}

export default HealthDashboard;
```

## Advanced Integration

### Custom Goal Display

```typescript
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import GoalCard from '@/components/health-goals/GoalCard';

function CustomGoalsList() {
  const { goals, updateGoal, deleteGoal } = useOptimizedHealthGoals();
  
  const activeGoals = goals.filter(goal => goal.is_active);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activeGoals.map(goal => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={(goal) => {
            // Custom edit logic
            console.log('Editing goal:', goal);
          }}
          onDelete={deleteGoal}
        />
      ))}
    </div>
  );
}
```

### Goal Creation Form

```typescript
import { useState } from 'react';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import GoalForm from '@/components/health-goals/GoalForm';

function CreateGoalPage() {
  const { createGoal } = useOptimizedHealthGoals();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (goalData) => {
    setIsCreating(true);
    const success = await createGoal(goalData);
    setIsCreating(false);
    
    if (success) {
      // Handle success (e.g., redirect, show toast)
      console.log('Goal created successfully');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Goal</h1>
      <GoalForm
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
        isLoading={isCreating}
      />
    </div>
  );
}
```

### Progress Tracking Integration

```typescript
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import { calculateProgress } from '@/utils/healthGoals';

function ProgressTracker() {
  const { goals, updateProgress } = useOptimizedHealthGoals();
  
  const handleProgressUpdate = async (goalId: string, newValue: number) => {
    const success = await updateProgress(goalId, newValue);
    if (success) {
      console.log('Progress updated');
    }
  };

  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id} className="mb-4">
          <h3>{goal.title}</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Current value"
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) {
                  handleProgressUpdate(goal.id!, value);
                }
              }}
            />
            <span>{goal.unit}</span>
          </div>
          <div className="mt-2">
            Progress: {goal.progress_percentage}%
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

### Hook Error States

```typescript
const { goals, error, isLoading } = useOptimizedHealthGoals();

if (error) {
  return (
    <div className="text-red-600 p-4 border border-red-200 rounded">
      Error loading goals: {error}
    </div>
  );
}

if (isLoading) {
  return <div>Loading goals...</div>;
}
```

### Form Validation

```typescript
import { CreateHealthGoalSchema } from '@/types/healthGoals';

const validateGoalData = (data) => {
  try {
    const validatedData = CreateHealthGoalSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { success: false, error: error.errors };
  }
};
```

## Performance Optimization

### Memoization

```typescript
import { useMemo } from 'react';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';

function OptimizedGoalsList() {
  const { goals } = useOptimizedHealthGoals();
  
  const sortedGoals = useMemo(() => {
    return goals.sort((a, b) => {
      // Sort by priority, then by progress
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return b.progress_percentage - a.progress_percentage;
    });
  }, [goals]);

  return (
    <div>
      {sortedGoals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
```

## Testing Integration

### Mock Hook for Testing

```typescript
// __mocks__/useOptimizedHealthGoals.ts
export const useOptimizedHealthGoals = () => ({
  goals: [
    {
      id: '1',
      title: 'Test Goal',
      goal_type: 'steps',
      target_value: 10000,
      current_value: 5000,
      progress_percentage: 50,
      // ... other fields
    }
  ],
  createGoal: jest.fn().mockResolvedValue(true),
  updateGoal: jest.fn().mockResolvedValue(true),
  deleteGoal: jest.fn().mockResolvedValue(true),
  isLoading: false,
  error: null,
});
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { useOptimizedHealthGoals } from '@/hooks/useOptimizedHealthGoals';
import OptimizedHealthGoalsManager from '@/components/health-tracking/OptimizedHealthGoalsManager';

jest.mock('@/hooks/useOptimizedHealthGoals');

test('renders goals manager', () => {
  const mockHook = useOptimizedHealthGoals as jest.MockedFunction<typeof useOptimizedHealthGoals>;
  mockHook.mockReturnValue({
    goals: [],
    isLoading: false,
    // ... other mock values
  });

  render(<OptimizedHealthGoalsManager />);
  expect(screen.getByText('Цели здоровья')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Goals not loading**: Check Supabase RLS policies and user authentication
2. **Form validation errors**: Ensure all required fields are provided
3. **Progress not updating**: Verify target_value is set and not zero
4. **TypeScript errors**: Check that all imports match the exact file paths

### Debug Mode

```typescript
const { goals, error } = useOptimizedHealthGoals();

// Enable debug logging
console.log('Goals loaded:', goals);
console.log('Hook error:', error);
```

## Migration Guide

If migrating from the old health goals system:

1. Update imports to use new file paths
2. Replace old hook usage with `useOptimizedHealthGoals`
3. Update component props to match new interfaces
4. Run data migration scripts if database schema changed

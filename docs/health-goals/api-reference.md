
# Health Goals API Reference

## Types

### HealthGoal
Main interface for health goal objects.

```typescript
interface HealthGoal {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  goal_type: 'steps' | 'exercise' | 'weight' | 'sleep' | 'water' | 'stress' | 'custom';
  category: 'fitness' | 'nutrition' | 'sleep' | 'mental' | 'longevity';
  priority: 'low' | 'medium' | 'high';
  target_value?: number;
  current_value: number;
  unit?: string;
  start_date: string;
  target_date?: string;
  is_active: boolean;
  is_custom: boolean;
  progress_percentage: number;
  created_at?: string;
  updated_at?: string;
}
```

### CreateHealthGoalInput
Input type for creating new goals.

```typescript
type CreateHealthGoalInput = Omit<HealthGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
```

### UpdateHealthGoalInput
Input type for updating existing goals.

```typescript
type UpdateHealthGoalInput = Partial<Omit<HealthGoal, 'id' | 'user_id'>>;
```

## Hooks

### useOptimizedHealthGoals()

Primary hook for health goals management.

**Returns:**
```typescript
{
  goals: HealthGoal[];
  activeGoal: HealthGoal | null;
  isLoading: boolean;
  error: string | null;
  createGoal: (goalData: CreateHealthGoalInput) => Promise<boolean>;
  updateGoal: (goalId: string, updates: UpdateHealthGoalInput) => Promise<boolean>;
  deleteGoal: (goalId: string) => Promise<boolean>;
  updateProgress: (goalId: string, currentValue: number) => Promise<boolean>;
  deactivateGoal: (goalId: string) => Promise<boolean>;
  loadGoals: () => Promise<void>;
}
```

**Example Usage:**
```typescript
const { goals, createGoal, isLoading } = useOptimizedHealthGoals();

// Create a new goal
const handleCreateGoal = async () => {
  const success = await createGoal({
    title: "Walk 10,000 Steps",
    goal_type: "steps",
    category: "fitness",
    priority: "medium",
    target_value: 10000,
    unit: "steps",
    start_date: "2024-01-01",
    is_active: true,
    is_custom: false,
    progress_percentage: 0
  });
};
```

## Utilities

### HealthGoalMapper

Utility class for data transformation between database and application formats.

**Methods:**

#### `fromDatabase(dbGoal: DatabaseHealthGoal): HealthGoal`
Transforms database record to application format.

#### `toDatabase(goal: HealthGoal, userId: string): DatabaseHealthGoal`
Transforms application format to database record.

**Example:**
```typescript
import { HealthGoalMapper } from '@/utils/healthGoals';

// Transform from database
const appGoal = HealthGoalMapper.fromDatabase(dbRecord);

// Transform to database
const dbRecord = HealthGoalMapper.toDatabase(appGoal, userId);
```

### Helper Functions

#### `calculateProgress(current: number, target: number): number`
Calculates progress percentage.

#### `formatGoalValue(value: number, unit: string): string`
Formats goal values for display.

## Validation Schemas

### HealthGoalSchema
Complete validation schema for health goals.

### CreateHealthGoalSchema
Validation schema for goal creation.

### UpdateHealthGoalSchema
Validation schema for goal updates.

**Example:**
```typescript
import { CreateHealthGoalSchema } from '@/types/healthGoals';

// Validate goal data
const validatedData = CreateHealthGoalSchema.parse(goalData);
```

## Error Handling

All API functions return boolean success indicators and handle errors internally with toast notifications. Errors are also available through the `error` state in the hook.

```typescript
const { error } = useOptimizedHealthGoals();

if (error) {
  console.error('Health Goals Error:', error);
}
```

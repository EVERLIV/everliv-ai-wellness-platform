
# Health Goals Best Practices

## Code Organization

### File Structure
Follow the established pattern for health goals files:

```
src/
├── types/healthGoals.ts          # Type definitions
├── utils/healthGoals.ts          # Utility functions
├── hooks/useOptimizedHealthGoals.ts  # Business logic
└── components/
    ├── health-tracking/
    │   ├── OptimizedHealthGoalsManager.tsx
    │   └── DynamicHealthScore.tsx
    └── health-goals/
        ├── GoalCard.tsx
        ├── GoalForm.tsx
        └── index.ts              # Re-exports
```

### Component Composition
Keep components small and focused:

```typescript
// ✅ Good - Single responsibility
function GoalCard({ goal, onEdit, onDelete }) {
  return (
    // Goal display logic only
  );
}

// ❌ Avoid - Multiple responsibilities
function GoalCardWithForm({ goal, onEdit, onDelete, showForm }) {
  return (
    // Both display and form logic
  );
}
```

## Data Handling

### Type Safety
Always use TypeScript types and Zod validation:

```typescript
// ✅ Good - Type-safe with validation
const createGoal = async (goalData: CreateHealthGoalInput) => {
  const validatedData = CreateHealthGoalSchema.parse(goalData);
  // Process validated data
};

// ❌ Avoid - Untyped data
const createGoal = async (goalData: any) => {
  // No validation or type safety
};
```

### Error Handling
Provide meaningful error messages:

```typescript
// ✅ Good - Specific error handling
try {
  await createGoal(goalData);
  toast.success('Цель создана успешно');
} catch (error) {
  console.error('Goal creation error:', error);
  toast.error('Не удалось создать цель. Попробуйте еще раз.');
}

// ❌ Avoid - Generic error handling
try {
  await createGoal(goalData);
} catch (error) {
  toast.error('Ошибка');
}
```

## Performance

### Hook Optimization
Use memoization for expensive calculations:

```typescript
// ✅ Good - Memoized active goal
const activeGoal = useMemo(() => 
  goals.find(goal => goal.is_active) || null, 
  [goals]
);

// ❌ Avoid - Calculated on every render
const activeGoal = goals.find(goal => goal.is_active) || null;
```

### Component Re-renders
Use React.memo for stable components:

```typescript
// ✅ Good - Memoized component
const GoalCard = memo(({ goal, onEdit, onDelete }) => {
  // Component implementation
});

// Add displayName for debugging
GoalCard.displayName = 'GoalCard';
```

## User Experience

### Loading States
Always provide feedback during async operations:

```typescript
// ✅ Good - Loading state management
const [isCreating, setIsCreating] = useState(false);

const handleSubmit = async (goalData) => {
  setIsCreating(true);
  try {
    await createGoal(goalData);
  } finally {
    setIsCreating(false);
  }
};

return (
  <Button disabled={isCreating}>
    {isCreating ? 'Создание...' : 'Создать цель'}
  </Button>
);
```

### Form Validation
Provide real-time validation feedback:

```typescript
// ✅ Good - Immediate validation feedback
<FormField
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Название цели</FormLabel>
      <FormControl>
        <Input 
          {...field} 
          className={fieldState.error ? 'border-red-500' : ''}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Accessibility

### Semantic HTML
Use appropriate HTML elements:

```typescript
// ✅ Good - Semantic structure
<article className="goal-card">
  <header>
    <h3>{goal.title}</h3>
  </header>
  <section>
    <progress value={goal.progress_percentage} max={100} />
  </section>
  <footer>
    <button onClick={onEdit}>Редактировать</button>
  </footer>
</article>

// ❌ Avoid - Generic divs
<div className="goal-card">
  <div>{goal.title}</div>
  <div>Progress: {goal.progress_percentage}%</div>
  <div onClick={onEdit}>Edit</div>
</div>
```

### ARIA Labels
Provide descriptive labels:

```typescript
// ✅ Good - Descriptive ARIA labels
<button 
  onClick={() => onDelete(goal.id)}
  aria-label={`Удалить цель "${goal.title}"`}
>
  <Trash2 className="h-4 w-4" />
</button>

// ❌ Avoid - No context
<button onClick={() => onDelete(goal.id)}>
  <Trash2 className="h-4 w-4" />
</button>
```

## Security

### Input Sanitization
Always validate and sanitize user inputs:

```typescript
// ✅ Good - Validated input
const createGoal = async (goalData: CreateHealthGoalInput) => {
  // Zod validation automatically sanitizes
  const validatedData = CreateHealthGoalSchema.parse(goalData);
  
  // Additional business logic validation
  if (validatedData.target_value && validatedData.target_value < 0) {
    throw new Error('Target value must be positive');
  }
  
  return await supabase
    .from('user_health_goals')
    .insert(HealthGoalMapper.toDatabase(validatedData, userId));
};
```

### Database Queries
Use parameterized queries and RLS:

```typescript
// ✅ Good - RLS-protected query
const { data, error } = await supabase
  .from('user_health_goals')
  .select('*')
  .eq('user_id', user.id)  // RLS ensures this is enforced
  .order('created_at', { ascending: false });

// ❌ Avoid - Raw SQL or unprotected queries
```

## Testing

### Unit Tests
Test individual functions and components:

```typescript
// ✅ Good - Focused unit test
describe('calculateProgress', () => {
  it('calculates percentage correctly', () => {
    expect(calculateProgress(50, 100)).toBe(50);
    expect(calculateProgress(100, 100)).toBe(100);
    expect(calculateProgress(0, 100)).toBe(0);
  });
  
  it('handles edge cases', () => {
    expect(calculateProgress(10, 0)).toBe(0);
    expect(calculateProgress(150, 100)).toBe(100);
  });
});
```

### Integration Tests
Test component interactions:

```typescript
// ✅ Good - Integration test
describe('GoalForm', () => {
  it('submits valid goal data', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(true);
    render(<GoalForm onSubmit={mockSubmit} onCancel={jest.fn()} />);
    
    await user.type(screen.getByLabelText('Название цели'), 'Test Goal');
    await user.selectOptions(screen.getByLabelText('Категория'), 'fitness');
    await user.click(screen.getByRole('button', { name: /создать цель/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Goal',
        category: 'fitness'
      })
    );
  });
});
```

## Documentation

### JSDoc Comments
Document public APIs:

```typescript
/**
 * Hook for managing health goals with optimized performance
 * @returns {UseHealthGoalsReturn} Object containing goals data and actions
 * @example
 * ```typescript
 * const { goals, createGoal, isLoading } = useOptimizedHealthGoals();
 * 
 * const handleCreate = async () => {
 *   await createGoal({
 *     title: "Walk 10k steps",
 *     goal_type: "steps",
 *     // ... other fields
 *   });
 * };
 * ```
 */
export const useOptimizedHealthGoals = (): UseHealthGoalsReturn => {
  // Implementation
};
```

### Component Props
Document component interfaces:

```typescript
/**
 * Props for the GoalCard component
 */
interface GoalCardProps {
  /** The health goal to display */
  goal: HealthGoal;
  /** Callback when user wants to edit the goal */
  onEdit: (goal: HealthGoal) => void;
  /** Callback when user wants to delete the goal */
  onDelete: (goalId: string) => void;
  /** Whether to show edit/delete actions @default true */
  showActions?: boolean;
}
```

## Maintenance

### Regular Updates
- Review and update dependencies
- Run security audits
- Update documentation
- Refactor long functions/components
- Add new test cases

### Code Reviews
Check for:
- Type safety
- Error handling
- Performance optimizations
- Accessibility compliance
- Security best practices
- Test coverage

### Monitoring
Track:
- Component render frequency
- Hook performance metrics
- User interaction patterns
- Error rates and types
- Database query performance

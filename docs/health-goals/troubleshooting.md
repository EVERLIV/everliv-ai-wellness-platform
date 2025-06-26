# Health Goals Troubleshooting Guide

## Common Issues and Solutions

### Database Issues

#### Goals Not Loading
**Problem**: `useOptimizedHealthGoals` returns empty array despite having goals

**Solutions**:
1. Check user authentication:
```typescript
import { useSmartAuth } from '@/hooks/useSmartAuth';

const { user } = useSmartAuth();
console.log('Current user:', user); // Should not be null
```

2. Verify RLS policies in Supabase:
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_health_goals';

-- List current policies
SELECT * FROM pg_policies WHERE tablename = 'user_health_goals';
```

3. Check Supabase client configuration:
```typescript
import { supabase } from '@/integrations/supabase/client';

// Test connection
const { data, error } = await supabase.from('user_health_goals').select('count');
console.log('Connection test:', { data, error });
```

#### Database Connection Errors
**Problem**: Supabase operations fail with connection errors

**Solutions**:
1. Verify environment variables:
```typescript
console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', process.env.VITE_SUPABASE_ANON_KEY);
```

2. Check network connectivity
3. Verify Supabase project status

### TypeScript Errors

#### Type Mismatch Errors
**Problem**: TypeScript errors about incompatible types

**Solutions**:
1. Ensure all imports are correct:
```typescript
// ✅ Correct imports
import { HealthGoal, CreateHealthGoalInput } from '@/types/healthGoals';
import { HealthGoalMapper } from '@/utils/healthGoals';
```

2. Check Zod schema versions:
```typescript
// Verify schema compatibility
import { CreateHealthGoalSchema } from '@/types/healthGoals';
const result = CreateHealthGoalSchema.safeParse(data);
if (!result.success) {
  console.log('Validation errors:', result.error.errors);
}
```

#### Database Type Mismatch
**Problem**: DatabaseHealthGoal type doesn't match actual database schema

**Solutions**:
1. Regenerate Supabase types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

2. Update DatabaseHealthGoal interface to match:
```typescript
// Check actual database schema
interface DatabaseHealthGoal {
  id: string;
  user_id: string;
  // ... ensure all fields match database
}
```

### Component Issues

#### Form Validation Errors
**Problem**: GoalForm shows validation errors incorrectly

**Solutions**:
1. Check form default values:
```typescript
const form = useForm<CreateHealthGoalInput>({
  resolver: zodResolver(CreateHealthGoalSchema),
  defaultValues: {
    title: '',
    goal_type: 'steps', // Must match enum
    category: 'fitness', // Must match enum
    // ... all required fields
  }
});
```

2. Verify Zod schema matches form fields:
```typescript
// Test schema validation
const testData = {
  title: 'Test Goal',
  goal_type: 'steps',
  category: 'fitness',
  // ... other fields
};

const result = CreateHealthGoalSchema.safeParse(testData);
console.log('Validation result:', result);
```

#### Component Not Rendering
**Problem**: Components render blank or show errors

**Solutions**:
1. Check hook dependencies:
```typescript
const { goals, isLoading, error } = useOptimizedHealthGoals();

console.log('Hook state:', { goals, isLoading, error });

if (error) {
  return <div>Error: {error}</div>;
}

if (isLoading) {
  return <div>Loading...</div>;
}
```

2. Verify component props:
```typescript
// Check prop types
interface ComponentProps {
  // Ensure all required props are provided
}
```

### Performance Issues

#### Slow Goal Loading
**Problem**: Goals take long time to load

**Solutions**:
1. Check database query performance:
```typescript
// Add timing to hook
const loadGoals = useCallback(async () => {
  const startTime = performance.now();
  
  try {
    const { data, error } = await supabase
      .from('user_health_goals')
      .select('*')
      .eq('user_id', user.id);
      
    const endTime = performance.now();
    console.log(`Query took ${endTime - startTime} milliseconds`);
    
  } catch (error) {
    console.error('Load goals error:', error);
  }
}, [user]);
```

2. Add database indexes:
```sql
-- Add index for user_id if not exists
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_id 
ON user_health_goals(user_id);

-- Add index for active goals
CREATE INDEX IF NOT EXISTS idx_user_health_goals_active 
ON user_health_goals(user_id, is_active) 
WHERE is_active = true;
```

#### Excessive Re-renders
**Problem**: Components re-render too frequently

**Solutions**:
1. Add React DevTools Profiler
2. Memoize expensive calculations:
```typescript
const activeGoal = useMemo(() => 
  goals.find(goal => goal.is_active) || null, 
  [goals]
);
```

3. Use React.memo for stable components:
```typescript
const GoalCard = memo(({ goal, onEdit, onDelete }) => {
  // Component implementation
});
```

### Form Issues

#### Submit Failures
**Problem**: Goal creation/update fails silently

**Solutions**:
1. Add comprehensive error logging:
```typescript
const createGoal = async (goalData: CreateHealthGoalInput) => {
  try {
    console.log('Creating goal with data:', goalData);
    
    const validatedData = CreateHealthGoalSchema.parse(goalData);
    console.log('Validated data:', validatedData);
    
    const dbData = HealthGoalMapper.toDatabase(validatedData, user.id);
    console.log('Database data:', dbData);
    
    const { data, error } = await supabase
      .from('user_health_goals')
      .insert(dbData);
      
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('Goal created successfully:', data);
    return true;
  } catch (error) {
    console.error('Create goal error:', error);
    return false;
  }
};
```

2. Check network requests in browser DevTools
3. Verify all required fields are provided

#### Validation Messages Not Showing
**Problem**: Form validation errors don't display

**Solutions**:
1. Check FormMessage components:
```typescript
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Title</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage /> {/* This must be present */}
    </FormItem>
  )}
/>
```

2. Verify form state:
```typescript
const formState = form.formState;
console.log('Form errors:', formState.errors);
console.log('Form is valid:', formState.isValid);
```

## Debugging Tools

### Enable Debug Mode
Add to your component:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Health Goals Debug Info:', {
    goals,
    activeGoal,
    isLoading,
    error
  });
}
```

### React DevTools
1. Install React Developer Tools browser extension
2. Use Profiler to identify performance issues
3. Check component props and state

### Browser DevTools
1. **Network tab**: Check Supabase API calls
2. **Console tab**: Look for error messages
3. **Application tab**: Check local storage and session data

### Supabase Dashboard
1. **SQL Editor**: Test queries directly
2. **Auth**: Verify user authentication
3. **Table Editor**: Check data structure
4. **Logs**: Review server-side errors

## Error Codes Reference

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Goals not loading` | Authentication or RLS issue | Check user auth and policies |
| `Type error in mapper` | Schema mismatch | Update types/schemas |
| `Form validation failed` | Invalid form data | Check Zod schema |
| `Database connection error` | Supabase config issue | Verify environment variables |
| `Component not rendering` | Missing props or data | Check component dependencies |

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 401 | Unauthorized | User not authenticated |
| 403 | Forbidden | RLS policy blocking access |
| 422 | Validation Error | Invalid data format |
| 500 | Server Error | Database or server issue |

## Getting Help

### Debug Checklist
Before asking for help, check:
- [ ] User is authenticated
- [ ] Database connection works
- [ ] All required environment variables set
- [ ] Component props are correct
- [ ] Console shows no errors
- [ ] Network requests succeed

### Information to Include
When reporting issues:
1. **Error message**: Full error text and stack trace
2. **Steps to reproduce**: What actions trigger the issue
3. **Environment**: Browser, Node version, package versions
4. **Code**: Relevant component/hook code
5. **Network logs**: Failed API requests
6. **Console logs**: Any error or debug messages

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form Guide](https://react-hook-form.com/get-started)
- [Zod Validation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

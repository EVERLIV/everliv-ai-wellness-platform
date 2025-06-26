
# Health Goals Components Documentation

## Component Overview

The Health Goals system includes several React components designed for modularity and reusability.

## OptimizedHealthGoalsManager

**File:** `src/components/health-tracking/OptimizedHealthGoalsManager.tsx`

Main container component for managing health goals.

### Props
None - uses `useOptimizedHealthGoals` hook internally.

### Features
- Goal creation and editing
- Goal list display
- Empty state handling
- Loading states
- Form toggle management

### Usage
```typescript
import OptimizedHealthGoalsManager from '@/components/health-tracking/OptimizedHealthGoalsManager';

function HealthPage() {
  return (
    <div>
      <OptimizedHealthGoalsManager />
    </div>
  );
}
```

### State Management
- `isFormOpen: boolean` - Controls form visibility
- `editingGoal: HealthGoal | null` - Current goal being edited

## GoalCard

**File:** `src/components/health-goals/GoalCard.tsx`

Displays individual goal information with actions.

### Props
```typescript
interface GoalCardProps {
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onDelete: (goalId: string) => void;
  showActions?: boolean; // default: true
}
```

### Features
- Goal information display
- Progress visualization
- Category icons
- Priority badges
- Edit/delete actions
- Responsive design

### Usage
```typescript
<GoalCard
  goal={goal}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showActions={true}
/>
```

### Visual Elements
- Category emoji icons
- Priority color coding
- Progress bars
- Action buttons
- Responsive layout

## GoalForm

**File:** `src/components/health-goals/GoalForm.tsx`

Form component for creating and editing goals.

### Props
```typescript
interface GoalFormProps {
  onSubmit: (data: CreateHealthGoalInput) => Promise<boolean>;
  onCancel: () => void;
  initialData?: HealthGoal | null;
  isLoading?: boolean;
}
```

### Features
- React Hook Form integration
- Zod validation
- Responsive grid layout
- Real-time validation
- Loading states
- Cancel functionality

### Form Fields
- **Title**: Goal name (required)
- **Category**: Goal category selection
- **Target Value**: Numeric target
- **Unit**: Measurement unit
- **Priority**: Low/Medium/High
- **Target Date**: Optional deadline
- **Description**: Optional details

### Usage
```typescript
<GoalForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  initialData={editingGoal}
  isLoading={isSubmitting}
/>
```

### Validation
Uses `CreateHealthGoalSchema` for comprehensive validation with error messages.

## DynamicHealthScore

**File:** `src/components/health-tracking/DynamicHealthScore.tsx`

Displays health score and goal progress integration.

### Features
- Dynamic health score calculation
- Goal progress visualization
- Real-time updates
- Score color coding
- Refresh functionality

### Integration
Works with `useOptimizedHealthGoals` to show goal-related progress within the health score context.

## Styling Guidelines

### Design System
- Uses Tailwind CSS classes
- Follows shadcn/ui component patterns
- Responsive breakpoints (sm, md, lg)
- Consistent spacing and typography

### Color Scheme
- **Priority High**: Red (`destructive`)
- **Priority Medium**: Default gray
- **Priority Low**: Secondary gray
- **Success**: Green
- **Warning**: Yellow/Orange

### Icons
- Lucide React icons
- Category-specific emojis
- Consistent sizing (h-4 w-4, h-5 w-5)

## Accessibility

### Features Implemented
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Best Practices
- Semantic HTML structure
- Descriptive button labels
- Form validation messages
- Loading state announcements

## Performance Optimizations

### React.memo Usage
GoalCard component uses React.memo for performance optimization:

```typescript
const GoalCard: React.FC<GoalCardProps> = memo(({ goal, onEdit, onDelete }) => {
  // Component implementation
});
```

### Memoized Calculations
- Goal progress calculations
- Active goal filtering
- Category icon mapping

## Testing Considerations

### Unit Testing
- Component rendering
- Props handling
- Event callbacks
- Validation logic

### Integration Testing
- Form submission flows
- Goal CRUD operations
- Error handling
- Loading states

### E2E Testing
- Complete goal creation workflow
- Goal editing and deletion
- Progress tracking updates
- Responsive behavior

# Project Architecture Documentation

## Overview
This document outlines the clean architecture principles and best practices implemented in the BNU Sustainability Dashboard project.

## Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart-specific components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── management/     # Management-specific components
│   └── ui/             # Base UI components (Button, Card, Input, etc.)
├── constants/          # Application-wide constants
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
├── pages/              # Page components organized by feature/role
│   ├── admin/
│   ├── auth/
│   ├── coordinator/
│   ├── hr/
│   ├── management/
│   └── marketing/
├── routes/             # Routing configuration
├── utils/              # Utility functions
└── data/               # Data files (dummy data, mock data)
```

## Architecture Principles

### 1. Component Organization
- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Components are designed to be reusable across the application
- **Composition**: Complex components are built from simpler ones

### 2. Separation of Concerns
- **Presentational Components**: Handle UI rendering only (in `components/`)
- **Container Components**: Handle data fetching and state management (in `pages/`)
- **Business Logic**: Extracted to custom hooks and utility functions

### 3. File Naming Conventions
- **Components**: PascalCase (e.g., `ManagementDashboard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useYearlyDataAggregation.js`)
- **Utils**: camelCase (e.g., `dataTransformers.js`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for file names

## Key Components

### Management Dashboard
The management dashboard has been refactored to follow clean architecture:

**Main Component**: `pages/management/ManagementDashboard.jsx`
- Handles state management
- Orchestrates child components
- Minimal logic, maximum composition

**Sub-components**:
- `DataViewHeader`: Header with view selectors
- `DetailedMetricsGrid`: Metrics display
- `WasteSegregationSection`: Waste analysis with pie chart
- `YearlyChartsSection`: Trend charts for yearly view

### Custom Hooks

#### `useYearlyDataAggregation`
Aggregates monthly data into yearly data with proper calculations.

**Usage**:
```javascript
const yearlyData = useYearlyDataAggregation(monthlyAdminData, selectedYear);
```

#### `useAvailableYears`
Extracts and sorts available years from data.

**Usage**:
```javascript
const availableYears = useAvailableYears(monthlyAdminData);
```

### Utility Functions

#### Data Transformers (`utils/dataTransformers.js`)
- `transformMonthlyDataForChart`: Converts monthly data to chart format
- `transformWasteDataForPieChart`: Formats waste data for pie charts

### Constants

#### Chart Colors (`constants/chartColors.js`)
Centralized color palette for consistent styling:
- `CHART_COLORS`: Base color definitions
- `CHART_COLOR_PALETTE`: Array for multi-series charts
- `COMPONENT_COLORS`: Component-specific color mappings

## Best Practices

### 1. Code Organization
- **Group related code**: Keep related components, hooks, and utils together
- **Index files**: Consider adding index files for cleaner imports (future enhancement)
- **Barrel exports**: Export related items from a single entry point

### 2. Component Design
- **Props Interface**: Keep props minimal and well-typed
- **Default Props**: Provide sensible defaults where appropriate
- **Prop Validation**: Use PropTypes or TypeScript (future enhancement)

### 3. State Management
- **Local State**: Use `useState` for component-specific state
- **Shared State**: Use Context API for app-wide state
- **Derived State**: Use `useMemo` for expensive computations

### 4. Performance Optimization
- **Memoization**: Use `useMemo` for expensive calculations
- **Callback Memoization**: Use `useCallback` for functions passed as props
- **Code Splitting**: Consider lazy loading for large components (future enhancement)

### 5. Naming Conventions
- **Components**: Descriptive, noun-based names (e.g., `WasteSegregationCard`)
- **Hooks**: Verb-based with `use` prefix (e.g., `useYearlyDataAggregation`)
- **Functions**: Verb-based, descriptive (e.g., `transformMonthlyDataForChart`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `VIEW_TYPES.MONTHLY`)

## Data Flow

```
Data Source (data.js)
    ↓
Context Provider (DataContext)
    ↓
Custom Hooks (useYearlyDataAggregation, etc.)
    ↓
Data Transformers (transformMonthlyDataForChart)
    ↓
Components (ManagementDashboard, Charts, etc.)
```

## Adding New Features

### To Add a New Metric:
1. Add metric configuration to `METRIC_CONFIG` in `DetailedMetricsGrid.jsx`
2. Update data structure if needed
3. Add corresponding chart component if visual representation is needed

### To Add a New Chart:
1. Create reusable chart component in `components/charts/`
2. Use color constants from `constants/chartColors.js`
3. Use data transformers from `utils/dataTransformers.js`
4. Compose in page component

### To Add a New Role/Page:
1. Create page component in `pages/[role]/`
2. Add route in `routes/AppRoutes.jsx`
3. Add navigation link in `components/layout/Sidebar.jsx`
4. Update protected routes if needed

## Code Quality Standards

### Linting
- ESLint configured for React best practices
- Follow existing code style
- Fix linting errors before committing

### Comments
- **JSDoc**: Use for function documentation
- **Inline Comments**: Explain "why", not "what"
- **Component Comments**: Brief description of purpose

### Error Handling
- Use Error Boundaries for component-level errors
- Provide user-friendly error messages
- Log errors appropriately

## Future Enhancements

1. **TypeScript Migration**: Add type safety throughout the application
2. **Testing**: Add unit tests for hooks and utils, integration tests for components
3. **Storybook**: Document components with Storybook
4. **Performance**: Implement code splitting and lazy loading
5. **Accessibility**: Ensure WCAG compliance
6. **Internationalization**: Add i18n support if needed

## Cleanup Completed

- ✅ Removed unused sustainability pages (Analytics, CellDashboard, DepartmentComparison, Reports)
- ✅ Extracted reusable components from ManagementDashboard
- ✅ Created custom hooks for data aggregation
- ✅ Centralized constants (chart colors)
- ✅ Created utility functions for data transformation
- ✅ Improved component organization and naming

## Developer Guidelines

### Before Making Changes:
1. Review this architecture document
2. Check existing similar implementations
3. Follow established patterns
4. Consider reusability

### When Refactoring:
1. Maintain backward compatibility where possible
2. Update documentation
3. Test thoroughly
4. Keep changes focused and incremental

### Code Review Checklist:
- [ ] Follows naming conventions
- [ ] Uses existing patterns and components
- [ ] No unnecessary code duplication
- [ ] Proper error handling
- [ ] Performance considerations (memoization where needed)
- [ ] Documentation added/updated
- [ ] Linting passes


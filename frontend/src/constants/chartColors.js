/**
 * Chart color constants
 * Centralized color palette for consistent chart styling across the application
 */
export const CHART_COLORS = {
  primary: '#10b981', // Emerald
  secondary: '#3b82f6', // Blue
  accent: '#f59e0b', // Amber/Orange
  danger: '#ef4444', // Red
  purple: '#8b5cf6',
  pink: '#ec4899',
};

/**
 * Array of colors for pie charts and multi-series charts
 */
export const CHART_COLOR_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.danger,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
];

/**
 * Component-specific color mappings
 */
export const COMPONENT_COLORS = {
  paper: CHART_COLORS.primary,
  electricity: CHART_COLORS.secondary,
  water: '#0ea5e9', // Cyan
  waste: {
    organic: CHART_COLORS.primary,
    recyclables: CHART_COLORS.secondary,
    others: CHART_COLORS.accent,
  },
  generator: CHART_COLORS.accent,
  travel: CHART_COLORS.danger,
};


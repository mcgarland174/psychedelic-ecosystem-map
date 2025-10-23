/**
 * Design System Tokens
 * Based on Psychedelic Safety Hub Brand Style Guide
 */

export const COLORS = {
  // Primary Brand Colors
  primary: {
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      500: '#a855f7',
      600: '#9333ea', // Primary brand color
      800: '#6b21a8',
    },
    indigo: {
      600: '#4f46e5', // Secondary brand color
    },
  },

  // Semantic Colors
  semantic: {
    critical: {
      background: '#fee2e2',
      backgroundLight: '#fef2f2',
      text: '#b91c1c',
      border: '#fecaca',
      primary: '#ef4444',
      dark: '#dc2626',
    },
    warning: {
      background: '#ffedd5',
      backgroundLight: '#fff7ed',
      text: '#c2410c',
      primary: '#f97316',
      dark: '#ea580c',
    },
    safe: {
      background: '#f0fdf4',
      backgroundMedium: '#dcfce7',
      text: '#14532d',
      textMedium: '#15803d',
      border: '#bbf7d0',
      primary: '#22c55e',
      dark: '#16a34a',
    },
    informational: {
      background: '#eff6ff',
      backgroundMedium: '#dbeafe',
      text: '#1e3a8a',
      border: '#bfdbfe',
      primary: '#3b82f6',
      dark: '#2563eb',
    },
    neutral: {
      background: '#f9fafb',
      backgroundMedium: '#f3f4f6',
      text: '#4b5563',
      textDark: '#374151',
    },
  },

  // Gradients (from brand guide)
  gradients: {
    heroPrimary: 'from-purple-600 via-indigo-600 to-blue-600',
    toolCardHeader: 'from-purple-500 to-indigo-600',
    pageBackground: 'from-gray-50 via-purple-50 to-blue-50',
    safetySummary: 'from-green-50 to-blue-50',
  },
};

// Ecosystem Role Colors - Vibrant, distinct palette
export const ECOSYSTEM_COLORS: Record<string, string> = {
  'Funder': '#3B82F6',
  'Media': '#06B6D4',
  'Government & Policy': '#14B8A6',
  'Academic & Research': '#10B981',
  'Training & Credentialing': '#EAB308',
  'Clinical Services': '#F59E0B',
  'Community & Peer Support': '#EF4444',
  'Spiritual / Religious': '#EC4899',
  'Advocacy': '#A855F7',
  'Technology & Data Systems': '#6B7280',
  'Industry & Supply Chain': '#0EA5E9',
  'Cultural & Indigenous': '#06B6D4',
};

// Priority Area Colors - Psychedelic-inspired gradients
export const PRIORITY_COLORS: Record<string, { from: string; to: string }> = {
  'Data & Infrastructure': { from: '#10B981', to: '#34D399' },
  'Field Development & Funding': { from: '#F59E0B', to: '#FBBF24' },
  'Indigenous Relations & Cultural Equity': { from: '#A855F7', to: '#C084FC' },
  'Organizational & Industry Ethics': { from: '#EAB308', to: '#FDE047' },
  'Policy & Advocacy': { from: '#EF4444', to: '#F87171' },
  'Practitioner Standards & Workforce': { from: '#3B82F6', to: '#60A5FA' },
  'Public Education & Communications': { from: '#EC4899', to: '#F472B6' },
  'Public Safety & Emergency Response': { from: '#06B6D4', to: '#22D3EE' },
};

// Component Styles (from brand guide)
export const COMPONENTS = {
  card: {
    standard: 'bg-white rounded-lg shadow-lg p-6 border border-gray-100',
    interactive: 'hover:shadow-2xl transition-all duration-300 hover:border-purple-200',
    withGradientTop: 'bg-white rounded-b-lg shadow-lg p-8',
  },
  button: {
    primary: 'px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all',
    secondary: 'px-8 py-4 bg-purple-800/50 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-purple-800/70 transition-all',
    gradient: 'px-6 py-3 bg-gradient-to-r text-white rounded-xl font-semibold hover:shadow-lg transition-all',
  },
  badge: {
    critical: 'px-3 py-1.5 rounded-full font-medium text-xs bg-red-100 text-red-700',
    warning: 'px-3 py-1.5 rounded-full font-medium text-xs bg-orange-100 text-orange-700',
    safe: 'px-3 py-1.5 rounded-full font-medium text-xs bg-green-100 text-green-700',
    info: 'px-2.5 py-1 rounded-md font-medium text-xs bg-blue-100 text-blue-700',
  },
};

// Animations & Effects
export const EFFECTS = {
  shadows: {
    glow: '0 0 20px rgba(147, 51, 234, 0.3)',
    glowHover: '0 0 40px rgba(147, 51, 234, 0.5)',
    cardHover: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    all: 'transition-all duration-300 ease-in-out',
    transform: 'transition-transform duration-500 ease-out',
    colors: 'transition-colors duration-200',
  },
};

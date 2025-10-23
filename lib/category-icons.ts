// Category icon mapping for Problem Categories
// Maps category names or IDs to emoji icons

export const categoryIcons: Record<string, string> = {
  // Based on common psychedelic ecosystem problem categories
  'Data Infrastructure': '📊',
  'Research Funding': '💰',
  'Regulatory Barriers': '⚖️',
  'Safety & Quality': '🛡️',
  'Access & Equity': '🌍',
  'Education & Training': '📚',
  'Policy & Governance': '🏛️',
  'Community Support': '🤝',
  'Clinical Practice': '⚕️',
  'Traditional Knowledge': '🌿',
  'Technology': '💻',
  'Legal & Compliance': '⚖️',
  'Public Health': '🏥',
  'Workforce Development': '👥',
  'Information Systems': '📡',
  'Quality Assurance': '✓',
  'Ethics & Accountability': '⚖️',
  'Financing': '💵',
};

// Default icon if category not found
export const defaultCategoryIcon = '📋';

// Helper function to get icon for a category
export function getCategoryIcon(categoryName: string | undefined): string {
  if (!categoryName) return defaultCategoryIcon;
  return categoryIcons[categoryName] || defaultCategoryIcon;
}

// Helper function to add icons to problem categories
export function enrichCategoriesWithIcons<T extends { problemCategoryName?: string; icon?: string }>(
  categories: T[]
): Array<T & { icon: string }> {
  return categories.map(category => ({
    ...category,
    icon: getCategoryIcon(category.problemCategoryName)
  }));
}

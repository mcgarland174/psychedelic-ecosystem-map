/**
 * Brand Color Palette
 * Centralized color definitions for the psychedelic ecosystem map
 */

// PRIMARY COLORS
export const PRIMARY = {
  deepBrown: '#2B180A',
  teal: '#317E6D',
  red: '#DE0A32',
  gold: '#CC8D37',
} as const;

// TEAL SPECTRUM
export const TEAL = {
  darkTeal: '#133931',
  deepGreen: '#194C41',
  forestTeal: '#1F5F51',
  tealBlue: '#2E6D6E',
  teal: '#317E6D',
  mediumTeal: '#3E7B6E',
  lightTeal: '#9DCDC3',
} as const;

// ORANGE & GOLD SPECTRUM
export const ORANGE_GOLD = {
  darkBrown: '#894F00',
  bronze: '#B66A00',
  gold: '#CC8D37',
  brightOrange: '#E48400',
  amber: '#E99D33',
  lightGold: '#EFB566',
  paleGold: '#F4CE99',
} as const;

// NEUTRALS & CREAMS
export const NEUTRALS = {
  black: '#000000',
  almostBlack: '#130B05',
  darkGray: '#2B231E',
  mediumGray: '#736C66',
  lightGray: '#A19D9B',
  beige: '#E6C8A1',
  cream: '#EFE5DE',
  lightCream: '#F2E9DE',
  peachCream: '#F7DAB2',
  ivory: '#F7F0E8',
  paleCream: '#FAE6CC',
  softCream: '#FCF3E5',
  almostWhite: '#FDF6EE',
  white: '#FFFFFF',
} as const;

// ACCENT COLORS
export const ACCENTS = {
  pink: '#E58D9B',
  skyBlue: '#48A5CC',
} as const;

// TRANSPARENT
export const TRANSPARENT = {
  white10: '#FFFFFF1A',
  brown10: '#2B180A1A',
} as const;

// LIGHT MODE BACKGROUNDS
export const LIGHT_BACKGROUNDS = {
  primary: '#FBF3E7', // Main background
  secondary: '#FFFFFF', // White sections
  tertiary: '#F7F0E8', // Ivory - slightly darker
  card: '#FFFFFF', // Card backgrounds
  hover: '#FAE6CC', // Pale cream - hover states
  border: '#E6C8A1', // Beige - borders
} as const;

// LIGHT MODE TEXT COLORS (WCAG AA compliant on light backgrounds)
export const LIGHT_TEXT = {
  primary: '#2B180A', // Deep brown - for headings and primary text (14:1 contrast)
  secondary: '#4A4643', // Dark gray - for body text (7.2:1 contrast)
  tertiary: '#6B6764', // Medium gray - for subtle text (4.8:1 contrast)
} as const;

// GRADIENTS
export const GRADIENTS = {
  whiteToCream: 'linear-gradient(0deg, #FFFFFF 0%, #EED9C0 100%)',
  deepBrownToTeal: `linear-gradient(135deg, ${PRIMARY.deepBrown} 0%, ${PRIMARY.teal} 100%)`,
  tealToGold: `linear-gradient(135deg, ${PRIMARY.teal} 0%, ${PRIMARY.gold} 100%)`,
  darkToLight: `linear-gradient(135deg, ${NEUTRALS.darkGray} 0%, ${NEUTRALS.lightCream} 100%)`,
  lightCreamToWhite: `linear-gradient(135deg, ${LIGHT_BACKGROUNDS.tertiary} 0%, ${LIGHT_BACKGROUNDS.secondary} 100%)`,
} as const;

// THEORY OF CHANGE SECTION COLORS
export const THEORY_OF_CHANGE = {
  worldviews: {
    primary: TEAL.teal,
    gradient: `linear-gradient(135deg, ${TEAL.darkTeal} 0%, ${TEAL.teal} 100%)`,
    variations: [
      TEAL.darkTeal,
      TEAL.deepGreen,
      TEAL.forestTeal,
      TEAL.tealBlue,
      TEAL.teal,
      TEAL.mediumTeal,
      TEAL.lightTeal,
    ],
  },
  outcomes: {
    primary: TEAL.teal,
    gradient: `linear-gradient(135deg, ${TEAL.teal} 0%, ${TEAL.lightTeal} 100%)`,
    border: TEAL.mediumTeal,
  },
  problems: {
    primary: ORANGE_GOLD.brightOrange,
    gradient: `linear-gradient(135deg, ${ORANGE_GOLD.darkBrown} 0%, ${ORANGE_GOLD.amber} 100%)`,
    border: ORANGE_GOLD.amber,
  },
  projects: {
    primary: PRIMARY.gold,
    gradient: `linear-gradient(135deg, ${PRIMARY.gold} 0%, ${ORANGE_GOLD.lightGold} 100%)`,
    border: ORANGE_GOLD.gold,
  },
} as const;

// PROBLEM CATEGORY COLORS (for connection lines and badges)
export const PROBLEM_CATEGORIES = {
  'Research & Evidence': ACCENTS.skyBlue,
  'Policy & Regulation': PRIMARY.deepBrown,
  'Clinical & Therapeutic': TEAL.forestTeal,
  'Access & Equity': PRIMARY.red,
  'Safety & Harm Reduction': ORANGE_GOLD.darkBrown,
  'Education & Training': ORANGE_GOLD.amber,
  'Integration & Support': TEAL.mediumTeal,
  'Infrastructure': ORANGE_GOLD.bronze,
  'Cultural & Social': ACCENTS.pink,
  'Data Infrastructure': ACCENTS.skyBlue, // Alternate naming
  'Indigenous Relations & Cultural Equity': ACCENTS.pink, // Alternate naming
  'Policy & Advocacy': PRIMARY.deepBrown, // Alternate naming
  'Practitioner Standards & Workforce Development': ORANGE_GOLD.amber, // Alternate naming
  'Public Safety & Emergency Response': ORANGE_GOLD.darkBrown, // Alternate naming
  'Public Education & Communications': TEAL.mediumTeal, // Alternate naming
  'Organizational & Industry Ethics': ORANGE_GOLD.bronze, // Alternate naming
  'Field Development & Funding': PRIMARY.gold, // Alternate naming
} as const;

// BADGE STYLES (returns full Tailwind classes for JIT)
export function getCategoryBadgeClasses(categoryName: string): string {
  const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-medium border';

  const categoryStyles: Record<string, string> = {
    'Research & Evidence': `${baseClasses} bg-sky-100 text-sky-800 border-sky-300`,
    'Data Infrastructure': `${baseClasses} bg-sky-100 text-sky-800 border-sky-300`,

    'Policy & Regulation': `${baseClasses} bg-amber-100 text-amber-900 border-amber-300`,
    'Policy & Advocacy': `${baseClasses} bg-amber-100 text-amber-900 border-amber-300`,

    'Clinical & Therapeutic': `${baseClasses} bg-emerald-100 text-emerald-800 border-emerald-300`,

    'Access & Equity': `${baseClasses} bg-red-100 text-red-800 border-red-300`,

    'Safety & Harm Reduction': `${baseClasses} bg-orange-100 text-orange-900 border-orange-300`,
    'Public Safety & Emergency Response': `${baseClasses} bg-orange-100 text-orange-900 border-orange-300`,

    'Education & Training': `${baseClasses} bg-yellow-100 text-yellow-900 border-yellow-300`,
    'Practitioner Standards & Workforce Development': `${baseClasses} bg-yellow-100 text-yellow-900 border-yellow-300`,

    'Integration & Support': `${baseClasses} bg-teal-100 text-teal-800 border-teal-300`,
    'Public Education & Communications': `${baseClasses} bg-teal-100 text-teal-800 border-teal-300`,

    'Infrastructure': `${baseClasses} bg-stone-100 text-stone-800 border-stone-300`,
    'Organizational & Industry Ethics': `${baseClasses} bg-stone-100 text-stone-800 border-stone-300`,

    'Cultural & Social': `${baseClasses} bg-pink-100 text-pink-800 border-pink-300`,
    'Indigenous Relations & Cultural Equity': `${baseClasses} bg-pink-100 text-pink-800 border-pink-300`,

    'Field Development & Funding': `${baseClasses} bg-amber-100 text-amber-900 border-amber-300`,
  };

  return categoryStyles[categoryName] || `${baseClasses} bg-slate-100 text-slate-700 border-slate-300`;
}

// Get category color for SVG lines
export function getCategoryColor(categoryName: string): string {
  return (PROBLEM_CATEGORIES as any)[categoryName] || NEUTRALS.mediumGray;
}

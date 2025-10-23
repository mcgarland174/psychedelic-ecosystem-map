/**
 * Data Transformation Layer
 *
 * Converts Airtable data structure to the format expected by the React app.
 * The app uses simple string IDs (e.g., 'med-integration') while Airtable
 * uses record IDs (e.g., 'recKNNuwAxbnTj6dH'). This layer bridges that gap.
 */

import {
  getWorldviews as fetchWorldviews,
  getOutcomesWithRelevance as fetchOutcomes,
  getProblems as fetchProblems,
  getProblemCategories as fetchProblemCategories,
  getProjects as fetchProjects,
  getOrganizations as fetchOrganizations,
  Worldview as AirtableWorldview,
  Outcome as AirtableOutcome,
  Problem as AirtableProblem,
  ProblemCategory as AirtableProblemCategory,
  Project as AirtableProject,
  Organization as AirtableOrganization
} from './airtable';
import { getCategoryIcon } from './category-icons';

// App-expected types
export interface AppWorldview {
  id: string; // Simple slug ID
  name: string;
  shortName: string;
  color: string;
  cluster: string;
  clusterDefinition: string;
  tagline: string;
  description: string;
  vision: string;
  approach: string;
  strengths: string;
  tensions: string;
  naturalAllies: string;
  exampleOrgs: string[];
}

export interface AppOutcome {
  id: string; // Simple slug ID
  outcomeId: string; // Display ID like "O1", "O2"
  name: string;
  shortDescription: string;
  description: string;
  worldviewRelevance: Record<string, string>; // Maps worldview slug IDs to relevance
  successIndicators: string;
  relatedWorldviews?: string;
}

export interface AppProblemCategory {
  id: string; // Simple slug ID
  name: string;
  problemCategoryName: string; // Alias for compatibility
  icon: string;
}

export interface AppProblem {
  id: string; // Simple slug ID
  problemId: string; // Display ID like "P1", "P2"
  name: string;
  description: string;
  category: string; // Category slug ID
  affectedOutcomes: string[]; // Outcome slug IDs
}

export interface AppProject {
  id: string; // Simple slug ID
  name: string;
  organizations: string[];
  description: string;
  addressedProblems: string[]; // Problem slug IDs
  status: string;
  lastUpdated: string;
  typeOfProject?: string[];
  expectedImpact?: string;
  geographicLocation?: string[];
  website?: string;
  activelyFundraising?: string;
  amountSeeking?: number;
}

// Helper to create slug IDs from names
function createSlugId(name: string | undefined): string {
  if (!name) return 'unnamed-' + Math.random().toString(36).substr(2, 9);
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper to parse array from string or return empty array
function parseArrayField(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // Try to parse as JSON array or split by newline
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/**
 * Transform worldviews from Airtable to app format
 */
export function transformWorldviews(
  airtableWorldviews: AirtableWorldview[]
): { worldviews: AppWorldview[]; idMap: Map<string, string> } {
  const idMap = new Map<string, string>(); // Airtable ID -> slug ID

  const worldviews = airtableWorldviews.map(wv => {
    const slugId = createSlugId(wv.shortName || wv.name);
    idMap.set(wv.id, slugId);

    // Parse example organizations from string to array
    const exampleOrgs = wv.exampleOrganizations
      ? parseArrayField(wv.exampleOrganizations)
      : [];

    // Use cluster name and definition from lookup fields in Worldviews table
    const clusterName = wv.clusterName || 'Other';
    const clusterDefinition = wv.clusterDefinition || '';

    return {
      id: slugId,
      name: wv.name,
      shortName: wv.shortName,
      color: wv.color || '#9CA3AF',
      cluster: clusterName,
      clusterDefinition: clusterDefinition,
      tagline: wv.tagline || '',
      description: wv.description || '',
      vision: wv.vision || '',
      approach: wv.approach || '',
      strengths: wv.strengths || '',
      tensions: wv.tensions || '',
      naturalAllies: wv.naturalAllies || '',
      exampleOrgs
    };
  });

  return { worldviews, idMap };
}

/**
 * Transform outcomes from Airtable to app format
 */
export function transformOutcomes(
  airtableOutcomes: AirtableOutcome[],
  worldviewIdMap: Map<string, string>
): { outcomes: AppOutcome[]; idMap: Map<string, string> } {
  const idMap = new Map<string, string>(); // Airtable ID -> slug ID

  const outcomes = airtableOutcomes.map(outcome => {
    const slugId = createSlugId(outcome.name);
    idMap.set(outcome.id, slugId);

    // Transform worldview relevance from Airtable record IDs to slug IDs
    const worldviewRelevance: Record<string, string> = {};
    if (outcome.worldviewRelevance) {
      Object.entries(outcome.worldviewRelevance).forEach(([airtableWvId, relevance]) => {
        const slugWvId = worldviewIdMap.get(airtableWvId);
        if (slugWvId) {
          worldviewRelevance[slugWvId] = relevance;
        }
      });
    }

    return {
      id: slugId,
      outcomeId: outcome.outcomeId,
      name: outcome.name,
      shortDescription: outcome.shortDescription || '',
      description: outcome.description || '',
      worldviewRelevance,
      successIndicators: outcome.successIndicators || '',
      relatedWorldviews: outcome.relatedWorldviews
    };
  });

  return { outcomes, idMap };
}

/**
 * Transform problem categories from Airtable to app format
 */
export function transformProblemCategories(
  airtableCategories: AirtableProblemCategory[]
): { categories: AppProblemCategory[]; idMap: Map<string, string> } {
  const idMap = new Map<string, string>(); // Airtable ID -> slug ID

  const categories = airtableCategories.map(cat => {
    const slugId = createSlugId(cat.problemCategoryName);
    idMap.set(cat.id, slugId);

    return {
      id: slugId,
      name: cat.problemCategoryName,
      problemCategoryName: cat.problemCategoryName,
      icon: getCategoryIcon(cat.problemCategoryName)
    };
  });

  return { categories, idMap };
}

/**
 * Transform problems from Airtable to app format
 */
export function transformProblems(
  airtableProblems: AirtableProblem[],
  categoryIdMap: Map<string, string>,
  outcomeIdMap: Map<string, string>
): { problems: AppProblem[]; idMap: Map<string, string> } {
  const idMap = new Map<string, string>(); // Airtable ID -> slug ID

  const problems = airtableProblems.map((problem) => {
    const slugId = createSlugId(problem.name);
    idMap.set(problem.id, slugId);

    // Transform category ID
    const categoryAirtableId = Array.isArray(problem.problemCategory) && problem.problemCategory.length > 0
      ? problem.problemCategory[0]
      : undefined;
    const category = categoryAirtableId ? categoryIdMap.get(categoryAirtableId) || 'other' : 'other';

    // Transform affected outcomes IDs
    const affectedOutcomes = (problem.affectedOutcomes || [])
      .map(airtableId => outcomeIdMap.get(airtableId))
      .filter((id): id is string => id !== undefined);

    return {
      id: slugId,
      problemId: problem.problemId,
      name: problem.name,
      description: problem.description || '',
      category,
      affectedOutcomes
    };
  });

  return { problems, idMap };
}

/**
 * Transform projects from Airtable to app format
 */
export function transformProjects(
  airtableProjects: AirtableProject[],
  problemIdMap: Map<string, string>,
  orgIdToNameMap: Map<string, string>
): AppProject[] {
  return airtableProjects.map(project => {
    const slugId = createSlugId(project.name);

    // Transform organization IDs to names
    const organizations = Array.isArray(project.associatedOrganizations)
      ? project.associatedOrganizations
          .map(orgId => orgIdToNameMap.get(orgId))
          .filter((name): name is string => name !== undefined)
      : [];

    // Transform addressed problems IDs
    const addressedProblems = (project.addressedProblems || [])
      .map(airtableId => problemIdMap.get(airtableId))
      .filter((id): id is string => id !== undefined);

    // Use project start date or current date for lastUpdated
    const lastUpdated = project.projectStartDate || new Date().toISOString().slice(0, 7);

    return {
      id: slugId,
      name: project.name,
      organizations,
      description: project.description || '',
      addressedProblems,
      status: project.status || 'Active',
      lastUpdated,
      typeOfProject: project.typeOfProject,
      expectedImpact: project.expectedImpact,
      geographicLocation: project.geographicLocation,
      website: project.website,
      activelyFundraising: project.activelyFundraising,
      amountSeeking: project.amountSeeking
    };
  });
}

/**
 * Main function to fetch and transform all data
 */
export async function loadTransformedData() {
  console.log('Loading data from Airtable...');

  // Fetch all data in parallel
  const [
    airtableWorldviews,
    airtableOutcomes,
    airtableProblems,
    airtableCategories,
    airtableProjects,
    airtableOrganizations
  ] = await Promise.all([
    fetchWorldviews(),
    fetchOutcomes(),
    fetchProblems(),
    fetchProblemCategories(),
    fetchProjects(),
    fetchOrganizations()
  ]);

  console.log('Transforming data...');

  // Create organization ID to name map
  const orgIdToNameMap = new Map<string, string>();
  airtableOrganizations.forEach(org => {
    orgIdToNameMap.set(org.id, org.name);
  });

  // Transform in dependency order
  const { worldviews, idMap: worldviewIdMap } = transformWorldviews(airtableWorldviews);
  const { outcomes, idMap: outcomeIdMap } = transformOutcomes(airtableOutcomes, worldviewIdMap);
  const { categories, idMap: categoryIdMap } = transformProblemCategories(airtableCategories);
  const { problems, idMap: problemIdMap } = transformProblems(
    airtableProblems,
    categoryIdMap,
    outcomeIdMap
  );
  const projects = transformProjects(airtableProjects, problemIdMap, orgIdToNameMap);

  console.log('Data transformation complete!');
  console.log(`  - ${worldviews.length} worldviews`);
  console.log(`  - ${outcomes.length} outcomes`);
  console.log(`  - ${categories.length} problem categories`);
  console.log(`  - ${problems.length} problems`);
  console.log(`  - ${projects.length} projects`);
  console.log(`  - ${airtableOrganizations.length} organizations`);

  return {
    worldviews,
    outcomes,
    problemCategories: categories,
    problems,
    projects
  };
}

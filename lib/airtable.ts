import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY?.trim(),
}).base(process.env.AIRTABLE_BASE_ID?.trim() || '');

export interface Organization {
  id: string;
  name: string;
  organizationType?: string[];
  entityType?: string;
  ecosystemRole?: string[];
  website?: string;
  city?: string;
  state?: string[];
  country?: string[];
  affiliatedPeople?: string[];
  orgToOrgAffiliations?: string[];
  showOnline?: string;
  descriptionOfActivities?: string;
  projects?: string[];
  areaOfFocus?: string[];
  substanceOfFocus?: string[];
  populationServed?: string[];
  verified?: boolean;
}

export interface OrgAffiliation {
  id: string;
  fromOrg?: string[];
  toOrg?: string[];
  relationshipType?: string;
  description?: string;
}

export interface Person {
  id: string;
  fullName: string;
  title?: string;
  primaryOrg?: string[];
  orgAffiliations?: string[];
  ecosystemRole?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  priorityArea?: string;
  typeOfProject?: string[];
  geographicLocation?: string[];
  status?: string;
  associatedOrganizations?: string[];
  peopleInvolved?: string[];
  teamLead?: string[];
  activelyFundraising?: string;
  amountRaisedToDate?: number;
  amountSeeking?: number;
  expectedAnnualRevenue?: string;
  willGenerateRevenue?: string;
  projectStartDate?: string;
  expectedCompletionDate?: string;
  sustainabilityTimeline?: string[];
  currentProgress?: string;
  describeCurrentProgress?: string;
  projectMilestones?: string;
  expectedImpact?: string;
  website?: string;
  projectFunders?: string;
  addressedProblems?: string[];
}

// Theory of Change Interfaces
export interface Worldview {
  id: string;
  worldviewId: string;
  name: string;
  shortName: string;
  color?: string;
  cluster?: string[];
  clusterName?: string;
  clusterDefinition?: string;
  tagline?: string;
  coreIdentity?: string;
  description?: string;
  vision?: string;
  approach?: string;
  strengths?: string;
  tensions?: string;
  naturalAllies?: string;
  exampleOrganizations?: string;
  status?: string;
}

export interface Cluster {
  id: string;
  clusterId: string;
  clusterName: string;
  clusterDefinition?: string;
  worldviews?: string[];
}

export interface Outcome {
  id: string;
  outcomeId: string;
  name: string;
  shortDescription?: string;
  description?: string;
  successIndicators?: string;
  relatedWorldviews?: string;
  worldviewRelevance?: Record<string, string>; // Maps worldview ID to relevance level
  status?: string;
}

export interface OutcomeWorldviewRelationship {
  id: string;
  outcomeId: string[];
  worldviewId: string[];
  relevance: string;
}

export interface ProblemCategory {
  id: string;
  categoryId: string;
  problemCategoryName: string;
  status?: string;
  problems?: string[];
}

export interface Problem {
  id: string;
  problemId: string;
  name: string;
  description?: string;
  problemCategory?: string[];
  affectedOutcomes?: string[]; // Changed from string to string[]
  projects?: string[];
  status?: string;
}

export interface Program {
  id: string;
  name: string;
  organizations?: string[];
  programType?: string;
  programDescription?: string;
  programLength?: string;
  stateProvince?: string[];
  price?: number;
  webpage?: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  const orgs: Organization[] = [];

  await base('Organizations')
    .select({
      view: 'Online_Ecosystem_Map', // Pulling from the Online_Ecosystem_Map view in Airtable
      fields: [
        'Organization Name',
        'Organization Type',
        'Entity Type',
        'Ecosystem Role',
        'Website',
        'City',
        'State / Province',
        'Country',
        'Affiliated People',
        'Org to Org Affiliations',
        'Show Online',
        'Description of Activities',
        'Projects',
        'Area of Focus',
        'Substance of Focus',
        'Population Served',
        'Verified'
      ]
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        const showOnline = record.get('Show Online') as string;

        // Only include orgs where Show Online is NOT "no"
        // The Airtable view controls what records we fetch, and this code filters out "Show Online = No"
        if (showOnline?.toLowerCase() !== 'no') {
          orgs.push({
            id: record.id,
            name: record.get('Organization Name') as string || 'Unnamed Organization',
            organizationType: record.get('Organization Type') as string[],
            entityType: record.get('Entity Type') as string,
            ecosystemRole: record.get('Ecosystem Role') as string[],
            website: record.get('Website') as string,
            city: record.get('City') as string,
            state: record.get('State / Province') as string[],
            country: record.get('Country') as string[],
            affiliatedPeople: record.get('Affiliated People') as string[],
            orgToOrgAffiliations: record.get('Org to Org Affiliations') as string[],
            showOnline: showOnline,
            descriptionOfActivities: record.get('Description of Activities') as string,
            projects: record.get('Projects') as string[],
            areaOfFocus: record.get('Area of Focus') as string[],
            substanceOfFocus: record.get('Substance of Focus') as string[],
            populationServed: record.get('Population Served') as string[],
            verified: record.get('Verified') as boolean,
          });
        }
      });
      fetchNextPage();
    });

  return orgs;
}

export async function getOrgAffiliations(): Promise<OrgAffiliation[]> {
  const affiliations: OrgAffiliation[] = [];

  try {
    await base('Org to Org Affiliations')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          affiliations.push({
            id: record.id,
            fromOrg: record.get('From Organization') as string[],
            toOrg: record.get('To Organization') as string[],
            relationshipType: record.get('Relationship Type') as string,
            description: record.get('Description') as string,
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching org affiliations:', error);
  }

  return affiliations;
}

export async function getPeople(): Promise<Person[]> {
  const people: Person[] = [];

  await base('People')
    .select({
      view: 'Grid view',
      fields: [
        'Full Name',
        'Title/Role',
        'Primary Organization',
        'Org Affiliations',
        'Ecosystem Role'
      ]
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        people.push({
          id: record.id,
          fullName: record.get('Full Name') as string || 'Unknown',
          title: record.get('Title/Role') as string,
          primaryOrg: record.get('Primary Organization') as string[],
          orgAffiliations: record.get('Org Affiliations') as string[],
          ecosystemRole: record.get('Ecosystem Role') as string[],
        });
      });
      fetchNextPage();
    });

  return people;
}

export async function getProjects(): Promise<Project[]> {
  const projects: Project[] = [];

  try {
    await base('Projects')
      .select({
        view: 'Grid view', // Using Grid view until Online_Ecosystem_Map view is created in Projects table
        fields: [
          'Project Name',
          'Project Description',
          'Priority Area',
          'Type of Project',
          'Geographic Location',
          'Status',
          'Associated Organization(s)',
          'People Involved',
          'Team Lead',
          'Actively fundraising?',
          'Amount raised to date',
          'Amount seeking',
          'Expected annual revenue',
          'Will this project generate revenue?',
          'Project Start Date',
          'Expected Completion Date',
          'Sustainability Timeline',
          'Current Progress',
          'Describe current progress',
          'Project Milestones',
          'Expected/target impact + metrics',
          'Website',
          'Project Funders',
          'Show Online',
          'Addressed Problems'
        ]
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          const showOnline = record.get('Show Online') as string;

          // Only include projects where Show Online is NOT "no"
          // The Airtable view controls what records we fetch, and this code filters out "Show Online = No"
          if (showOnline?.toLowerCase() !== 'no') {
            projects.push({
              id: record.id,
              name: record.get('Project Name') as string || 'Unnamed Project',
              description: record.get('Project Description') as string,
              priorityArea: record.get('Priority Area') as string,
              typeOfProject: record.get('Type of Project') as string[],
              geographicLocation: record.get('Geographic Location') as string[],
              status: record.get('Status') as string,
              associatedOrganizations: record.get('Associated Organization(s)') as string[],
              peopleInvolved: record.get('People Involved') as string[],
              teamLead: record.get('Team Lead') as string[],
              activelyFundraising: record.get('Actively fundraising?') as string,
              amountRaisedToDate: record.get('Amount raised to date') as number,
              amountSeeking: record.get('Amount seeking') as number,
              expectedAnnualRevenue: record.get('Expected annual revenue') as string,
              willGenerateRevenue: record.get('Will this project generate revenue?') as string,
              projectStartDate: record.get('Project Start Date') as string,
              expectedCompletionDate: record.get('Expected Completion Date') as string,
              sustainabilityTimeline: record.get('Sustainability Timeline') as string[],
              currentProgress: record.get('Current Progress') as string,
              describeCurrentProgress: record.get('Describe current progress') as string,
              projectMilestones: record.get('Project Milestones') as string,
              expectedImpact: record.get('Expected/target impact + metrics') as string,
              website: record.get('Website') as string,
              projectFunders: record.get('Project Funders') as string,
              addressedProblems: record.get('Addressed Problems') as string[],
            });
          }
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return projects;
}

export async function getPrograms(): Promise<Program[]> {
  const programs: Program[] = [];

  try {
    await base('Programs')
      .select({
        view: 'Grid view',
        fields: [
          'Name',
          'Organizations',
          'Program Type',
          'Program description',
          'Program length',
          'State/Province',
          'Price',
          'Webpage'
        ]
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          programs.push({
            id: record.id,
            name: record.get('Name') as string || 'Unnamed Program',
            organizations: record.get('Organizations') as string[],
            programType: record.get('Program Type') as string,
            programDescription: record.get('Program description') as string,
            programLength: record.get('Program length') as string,
            stateProvince: record.get('State/Province') as string[],
            price: record.get('Price') as number,
            webpage: record.get('Webpage') as string,
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching programs:', error);
  }

  return programs;
}

export interface NetworkData {
  nodes: Array<{
    id: string;
    label: string;
    group: string;
    title?: string;
    color?: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    title?: string;
  }>;
}

export async function getNetworkData(): Promise<NetworkData> {
  const orgs = await getOrganizations();
  const affiliations = await getOrgAffiliations();

  const nodes = orgs.map(org => ({
    id: org.id,
    label: org.name,
    group: org.ecosystemRole?.[0] || 'Other',
    title: `${org.name}\n${org.ecosystemRole?.join(', ') || ''}\n${org.city || ''}, ${org.state?.[0] || ''}`,
    color: getColorForRole(org.ecosystemRole?.[0]),
  }));

  const edges = affiliations
    .filter(aff => aff.fromOrg && aff.toOrg && aff.fromOrg[0] && aff.toOrg[0])
    .map(aff => ({
      from: aff.fromOrg![0],
      to: aff.toOrg![0],
      title: aff.relationshipType || 'Related',
    }));

  return { nodes, edges };
}

function getColorForRole(role?: string): string {
  const colorMap: Record<string, string> = {
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

  return colorMap[role || ''] || '#9CA3AF';
}

// Theory of Change Data Fetching

export async function getWorldviews(): Promise<Worldview[]> {
  const worldviews: Worldview[] = [];

  try {
    console.log('[getWorldviews] Starting fetch...');
    await base('Worldviews')
      .select({
        view: 'Grid view',
      })
      .eachPage(function page(records, fetchNextPage) {
        console.log(`[getWorldviews] Processing ${records.length} records`);
        records.forEach((record) => {
          worldviews.push({
            id: record.id,
            worldviewId: record.get('Worldview ID') as string,
            name: record.get('Name') as string,
            shortName: record.get('Short Name') as string,
            color: record.get('Color') as string,
            cluster: record.get('Cluster') as string[],
            clusterName: record.get('Cluster Name') as string,
            clusterDefinition: record.get('Cluster Definition') as string,
            tagline: record.get('Tagline') as string,
            coreIdentity: record.get('Core Identity') as string,
            description: record.get('Description') as string,
            vision: record.get('Vision') as string,
            approach: record.get('Approach') as string,
            strengths: record.get('Strengths') as string,
            tensions: record.get('Tensions') as string,
            naturalAllies: record.get('Natural Allies') as string,
            exampleOrganizations: record.get('Example Organizations') as string,
            status: record.get('Status') as string,
          });
        });
        fetchNextPage();
      });
    console.log(`[getWorldviews] Complete. Fetched ${worldviews.length} worldviews`);
  } catch (error) {
    console.error('[getWorldviews] Error fetching worldviews:', error);
    throw error;
  }

  return worldviews;
}

export async function getClusters(): Promise<Cluster[]> {
  const clusters: Cluster[] = [];

  try {
    await base('Worldview Clusters')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          clusters.push({
            id: record.id,
            clusterId: record.get('Cluster ID') as string,
            clusterName: record.get('Cluster Name') as string,
            clusterDefinition: record.get('Cluster Definition') as string,
            worldviews: record.get('Worldviews') as string[],
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching clusters:', error);
  }

  return clusters;
}

export async function getOutcomes(): Promise<Outcome[]> {
  const outcomes: Outcome[] = [];

  try {
    await base('Outcomes')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          outcomes.push({
            id: record.id,
            outcomeId: record.get('Outcome ID') as string,
            name: record.get('Name') as string,
            shortDescription: record.get('Short Description') as string,
            description: record.get('Description') as string,
            successIndicators: record.get('Success Indicators') as string,
            relatedWorldviews: record.get('Related Worldviews') as string,
            status: record.get('Status') as string,
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching outcomes:', error);
  }

  return outcomes;
}

export async function getProblemCategories(): Promise<ProblemCategory[]> {
  const categories: ProblemCategory[] = [];

  try {
    await base('Problem Categories')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          const catName = record.get('Problem_category_name') as string;

          categories.push({
            id: record.id,
            categoryId: record.get('Category ID') as string,
            problemCategoryName: catName,
            status: record.get('Status') as string,
            problems: record.get('Problems') as string[],
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching problem categories:', error);
  }

  return categories;
}

export async function getProblems(): Promise<Problem[]> {
  const problems: Problem[] = [];

  try {
    await base('Problems')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          problems.push({
            id: record.id,
            problemId: record.get('Problem ID') as string,
            name: record.get('Name') as string,
            description: record.get('Description') as string,
            problemCategory: record.get('Problem Categories') as string[],
            affectedOutcomes: record.get('affectedOutcomes') as string[],
            projects: record.get('Projects') as string[],
            status: record.get('Status') as string,
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching problems:', error);
  }

  return problems;
}

// Fetch Outcome-Worldview Relationships
export async function getOutcomeWorldviewRelationships(): Promise<OutcomeWorldviewRelationship[]> {
  const relationships: OutcomeWorldviewRelationship[] = [];

  try {
    await base('Outcome-Worldview Relationships')
      .select({
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          relationships.push({
            id: record.id,
            outcomeId: record.get('Outcomes') as string[],
            worldviewId: record.get('Worldviews') as string[],
            relevance: record.get('Relevance') as string,
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching outcome-worldview relationships:', error);
  }

  return relationships;
}

// Helper function to enrich outcomes with worldview relevance data
export async function getOutcomesWithRelevance(): Promise<Outcome[]> {
  const [outcomes, relationships] = await Promise.all([
    getOutcomes(),
    getOutcomeWorldviewRelationships()
  ]);

  // Build a map of outcome ID -> worldview relevance
  const relevanceMap = new Map<string, Record<string, string>>();

  relationships.forEach(rel => {
    if (rel.outcomeId && rel.outcomeId[0] && rel.worldviewId && rel.worldviewId[0]) {
      const outcomeId = rel.outcomeId[0];
      const worldviewId = rel.worldviewId[0];

      if (!relevanceMap.has(outcomeId)) {
        relevanceMap.set(outcomeId, {});
      }

      const outcomeRelevance = relevanceMap.get(outcomeId)!;
      outcomeRelevance[worldviewId] = rel.relevance;
    }
  });

  // Enrich outcomes with relevance data
  return outcomes.map(outcome => ({
    ...outcome,
    worldviewRelevance: relevanceMap.get(outcome.id) || {}
  }));
}

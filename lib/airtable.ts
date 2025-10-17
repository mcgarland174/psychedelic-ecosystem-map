import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

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
  affiliatedOrgs?: string[];
  affiliatedPeople?: string[];
}

export async function getOrganizations(): Promise<Organization[]> {
  const orgs: Organization[] = [];

  await base('Organizations')
    .select({
      view: 'Grid view',
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
        'Org to Org Affiliations'
      ]
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
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
        });
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
        view: 'Grid view',
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          projects.push({
            id: record.id,
            name: record.get('Project Name') as string || record.get('Name') as string || 'Unnamed Project',
            description: record.get('Description') as string,
            affiliatedOrgs: record.get('Affiliated Organizations') as string[] || record.get('Organizations') as string[],
            affiliatedPeople: record.get('Affiliated People') as string[] || record.get('People') as string[],
          });
        });
        fetchNextPage();
      });
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return projects;
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

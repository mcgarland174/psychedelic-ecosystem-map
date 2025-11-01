import { NextResponse } from 'next/server';
import { getOrganizations } from '@/lib/airtable';

export const revalidate = 60; // Revalidate every 60 seconds

// In-memory cache for development
let cachedOrgs: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedOrgs && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[/api/organizations] Returned from cache');
      return NextResponse.json(cachedOrgs);
    }

    console.log('[/api/organizations] Fetching from Airtable...');
    const startTime = Date.now();
    const orgs = await getOrganizations();

    // Update cache
    cachedOrgs = orgs;
    cacheTimestamp = Date.now();

    const duration = Date.now() - startTime;
    console.log(`[/api/organizations] Fetched ${orgs.length} organizations in ${duration}ms`);

    return NextResponse.json(orgs);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch organizations',
        details: error instanceof Error ? error.message : String(error),
        env: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID
        }
      },
      { status: 500 }
    );
  }
}

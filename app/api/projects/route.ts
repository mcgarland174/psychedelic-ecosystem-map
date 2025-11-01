import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/airtable';

export const revalidate = 60; // Revalidate every 60 seconds

// In-memory cache for development
let cachedProjects: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedProjects && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[/api/projects] Returned from cache');
      return NextResponse.json(cachedProjects);
    }

    console.log('[/api/projects] Fetching from Airtable...');
    const startTime = Date.now();
    const projects = await getProjects();

    // Update cache
    cachedProjects = projects;
    cacheTimestamp = Date.now();

    const duration = Date.now() - startTime;
    console.log(`[/api/projects] Fetched ${projects.length} projects in ${duration}ms`);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
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

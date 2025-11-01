import { NextResponse } from 'next/server';
import { getPrograms } from '@/lib/airtable';

export const revalidate = 60; // Revalidate every 60 seconds

// In-memory cache for development
let cachedPrograms: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 60 seconds

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (cachedPrograms && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[/api/programs] Returned from cache');
      return NextResponse.json(cachedPrograms);
    }

    console.log('[/api/programs] Fetching from Airtable...');
    const startTime = Date.now();
    const programs = await getPrograms();

    // Update cache
    cachedPrograms = programs;
    cacheTimestamp = Date.now();

    const duration = Date.now() - startTime;
    console.log(`[/api/programs] Fetched ${programs.length} programs in ${duration}ms`);

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch programs',
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

import { NextResponse } from 'next/server';
import { loadTransformedData } from '@/lib/data-transformer';

export const revalidate = 60; // Revalidate every 60 seconds

// In-memory cache for development
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 60 seconds in dev mode

export async function GET() {
  try {
    console.log('[/api/data] Starting data fetch...');
    const startTime = Date.now();

    // Check cache in development
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      const duration = Date.now() - startTime;
      console.log(`[/api/data] Returned from cache in ${duration}ms`);
      return NextResponse.json(cachedData);
    }

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Data fetch timeout after 25 seconds')), 25000);
    });

    const dataPromise = loadTransformedData();

    // Race between data fetch and timeout
    const data = await Promise.race([dataPromise, timeoutPromise]);

    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();

    const duration = Date.now() - startTime;
    console.log(`[/api/data] Data fetched successfully in ${duration}ms`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/data] Error fetching data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID
        }
      },
      { status: 500 }
    );
  }
}

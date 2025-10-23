import { NextResponse } from 'next/server';
import { loadTransformedData } from '@/lib/data-transformer';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    console.log('[/api/data] Starting data fetch...');
    const startTime = Date.now();

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Data fetch timeout after 25 seconds')), 25000);
    });

    const dataPromise = loadTransformedData();

    // Race between data fetch and timeout
    const data = await Promise.race([dataPromise, timeoutPromise]);

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

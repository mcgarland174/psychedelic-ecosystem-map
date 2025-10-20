import { NextResponse } from 'next/server';
import { getOrganizations } from '@/lib/airtable';

export async function GET() {
  try {
    const orgs = await getOrganizations();
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

import { NextResponse } from 'next/server';
import { getNetworkData } from '@/lib/airtable';

export async function GET() {
  try {
    const data = await getNetworkData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching network data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    );
  }
}

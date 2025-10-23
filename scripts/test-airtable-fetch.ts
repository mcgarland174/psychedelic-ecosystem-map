import * as dotenv from 'dotenv';
import * as path from 'path';
import { getWorldviews, getOutcomesWithRelevance } from '../lib/airtable';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function test() {
  console.log('Testing Airtable data fetching...\n');

  console.log('1. Fetching Worldviews with colors...');
  const worldviews = await getWorldviews();
  console.log(`✓ Found ${worldviews.length} worldviews`);
  if (worldviews.length > 0) {
    console.log('\nSample worldview:');
    console.log(`  Name: ${worldviews[0].name}`);
    console.log(`  Short Name: ${worldviews[0].shortName}`);
    console.log(`  Color: ${worldviews[0].color}`);
    console.log(`  Tagline: ${worldviews[0].tagline}`);
  }

  console.log('\n2. Fetching Outcomes with worldview relevance...');
  const outcomes = await getOutcomesWithRelevance();
  console.log(`✓ Found ${outcomes.length} outcomes`);
  if (outcomes.length > 0) {
    console.log('\nSample outcome:');
    console.log(`  Name: ${outcomes[0].name}`);
    console.log(`  Short Description: ${outcomes[0].shortDescription?.substring(0, 100)}...`);
    console.log(`  Worldview Relevance:`, outcomes[0].worldviewRelevance);
  }

  console.log('\n✅ All tests passed!');
}

test().catch(console.error);

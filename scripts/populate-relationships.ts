import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

// Static data mapping from your app
const outcomeWorldviewRelevance = {
  'Trusted Data Ecosystem': {
    'Medical Integration': 'High',
    'Harm Reduction': 'High',
    'Indigenous Rights': 'Low',
    'Personal Freedom': 'Low',
    'Scientific Inquiry': 'High',
    'Traditional Practices': 'Low',
    'Clinical Delivery': 'High'
  },
  'FDA Approval & Insurance Coverage': {
    'Medical Integration': 'High',
    'Harm Reduction': 'Medium',
    'Indigenous Rights': 'Neutral',
    'Personal Freedom': 'Low',
    'Scientific Inquiry': 'High',
    'Traditional Practices': 'Low',
    'Clinical Delivery': 'High'
  },
  'Reduced Harm & Safer Use': {
    'Medical Integration': 'Medium',
    'Harm Reduction': 'High',
    'Indigenous Rights': 'Medium',
    'Personal Freedom': 'High',
    'Scientific Inquiry': 'Medium',
    'Traditional Practices': 'Medium',
    'Clinical Delivery': 'High'
  },
  'Indigenous Sovereignty Protected': {
    'Medical Integration': 'Low',
    'Harm Reduction': 'Medium',
    'Indigenous Rights': 'High',
    'Personal Freedom': 'Medium',
    'Scientific Inquiry': 'Low',
    'Traditional Practices': 'High',
    'Clinical Delivery': 'Low'
  },
  'Decriminalization Nationwide': {
    'Medical Integration': 'Low',
    'Harm Reduction': 'High',
    'Indigenous Rights': 'High',
    'Personal Freedom': 'High',
    'Scientific Inquiry': 'Medium',
    'Traditional Practices': 'Medium',
    'Clinical Delivery': 'Low'
  }
};

async function fetchWorldviews() {
  const worldviews: Array<{ id: string; name: string }> = [];

  await base('Worldviews')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        worldviews.push({
          id: record.id,
          name: record.get('Name') as string,
        });
      });
      fetchNextPage();
    });

  return worldviews;
}

async function fetchOutcomes() {
  const outcomes: Array<{ id: string; name: string }> = [];

  await base('Outcomes')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        outcomes.push({
          id: record.id,
          name: record.get('Name') as string,
        });
      });
      fetchNextPage();
    });

  return outcomes;
}

async function checkRelationshipsTable() {
  console.log('Checking Outcome-Worldview Relationships table structure...\n');

  try {
    const records = await base('Outcome-Worldview Relationships')
      .select({ maxRecords: 1, view: 'Grid view' })
      .firstPage();

    if (records.length > 0) {
      console.log('Table exists! Sample record fields:');
      console.log(Object.keys(records[0].fields));
    } else {
      console.log('Table exists but is empty. Ready to populate!');
    }
    return true;
  } catch (error) {
    console.error('Error accessing table:', error);
    return false;
  }
}

async function populateRelationships() {
  console.log('Starting population process...\n');

  // Fetch worldviews and outcomes
  console.log('Fetching Worldviews...');
  const worldviews = await fetchWorldviews();
  console.log(`Found ${worldviews.length} worldviews:`);
  worldviews.forEach(wv => console.log(`  - ${wv.name} (${wv.id})`));

  console.log('\nFetching Outcomes...');
  const outcomes = await fetchOutcomes();
  console.log(`Found ${outcomes.length} outcomes:`);
  outcomes.forEach(o => console.log(`  - ${o.name} (${o.id})`));

  // Create mapping objects for easy lookup
  const worldviewMap = new Map(worldviews.map(wv => [wv.name, wv.id]));
  const outcomeMap = new Map(outcomes.map(o => [o.name, o.id]));

  // Build records to insert
  const relationshipsToCreate = [];

  for (const [outcomeName, relevances] of Object.entries(outcomeWorldviewRelevance)) {
    const outcomeId = outcomeMap.get(outcomeName);

    if (!outcomeId) {
      console.warn(`\nWarning: Outcome "${outcomeName}" not found in Airtable. Skipping...`);
      continue;
    }

    for (const [worldviewName, relevance] of Object.entries(relevances)) {
      const worldviewId = worldviewMap.get(worldviewName);

      if (!worldviewId) {
        console.warn(`Warning: Worldview "${worldviewName}" not found in Airtable. Skipping...`);
        continue;
      }

      relationshipsToCreate.push({
        fields: {
          'Outcome': [outcomeId],
          'Worldview': [worldviewId],
          'Relevance': relevance
        }
      });
    }
  }

  console.log(`\nPrepared ${relationshipsToCreate.length} relationships to create.`);
  console.log('\nCreating records in batches of 10...');

  // Create records in batches of 10 (Airtable API limit)
  const batchSize = 10;
  for (let i = 0; i < relationshipsToCreate.length; i += batchSize) {
    const batch = relationshipsToCreate.slice(i, i + batchSize);

    try {
      await base('Outcome-Worldview Relationships').create(batch);
      console.log(`Created records ${i + 1}-${Math.min(i + batchSize, relationshipsToCreate.length)}`);
    } catch (error) {
      console.error(`Error creating batch ${i / batchSize + 1}:`, error);
    }
  }

  console.log('\n✅ Population complete!');
}

async function main() {
  console.log('=== Outcome-Worldview Relationships Population Script ===\n');

  // Check if table exists and structure
  const tableExists = await checkRelationshipsTable();

  if (!tableExists) {
    console.error('\n❌ Table not found or not accessible. Please check:');
    console.error('  1. Table name is exactly "Outcome-Worldview Relationships"');
    console.error('  2. API token has access to this table');
    return;
  }

  console.log('\nReady to populate. Proceeding...\n');
  await populateRelationships();
}

main().catch(console.error);

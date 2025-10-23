import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

// Relevance mapping based on your actual Airtable outcomes and worldviews
const outcomeWorldviewRelevance = {
  'Unified Psychedelic Safety Data Ecosystem': {
    'Medical Integration Orientation': 'High',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'Medium',
    'Traditional/Indigenous Orientation': 'Low',
    'Scientific Inquiry Orientation': 'High',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'Medium'
  },
  'Indigenous-Centered Psychedelic Medicine Ecosystem': {
    'Medical Integration Orientation': 'Low',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'High',
    'Traditional/Indigenous Orientation': 'High',
    'Scientific Inquiry Orientation': 'Medium',
    'Clinical Delivery Orientation': 'Medium',
    'Personal Autonomy Orientation': 'Medium'
  },
  'Coordinated Psychedelic Policy Infrastructure': {
    'Medical Integration Orientation': 'High',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'Medium',
    'Traditional/Indigenous Orientation': 'Medium',
    'Scientific Inquiry Orientation': 'Medium',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'High'
  },
  'Unified Psychedelic Practitioner Development Framework': {
    'Medical Integration Orientation': 'High',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'Medium',
    'Traditional/Indigenous Orientation': 'High',
    'Scientific Inquiry Orientation': 'Medium',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'Low'
  },
  'Comprehensive Psychedelic Safety Response Network': {
    'Medical Integration Orientation': 'High',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'High',
    'Traditional/Indigenous Orientation': 'Medium',
    'Scientific Inquiry Orientation': 'Medium',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'High'
  },
  'Unified Psychedelic Information Ecosystem': {
    'Medical Integration Orientation': 'Medium',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'High',
    'Traditional/Indigenous Orientation': 'High',
    'Scientific Inquiry Orientation': 'High',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'High'
  },
  'Ethical Psychedelic Industry Framework': {
    'Medical Integration Orientation': 'Medium',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'High',
    'Traditional/Indigenous Orientation': 'High',
    'Scientific Inquiry Orientation': 'Low',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'Medium'
  },
  'Sustainable Psychedelic Public Health Financing': {
    'Medical Integration Orientation': 'High',
    'Pragmatic Policy Reform Orientation': 'High',
    'Abolitionist Justice Orientation': 'High',
    'Traditional/Indigenous Orientation': 'Medium',
    'Scientific Inquiry Orientation': 'Medium',
    'Clinical Delivery Orientation': 'High',
    'Personal Autonomy Orientation': 'Medium'
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

async function populateRelationships() {
  console.log('=== Populating Outcome-Worldview Relationships ===\n');

  // Fetch worldviews and outcomes
  console.log('Fetching data from Airtable...');
  const worldviews = await fetchWorldviews();
  const outcomes = await fetchOutcomes();

  console.log(`✓ Found ${worldviews.length} worldviews`);
  console.log(`✓ Found ${outcomes.length} outcomes\n`);

  // Create mapping objects for easy lookup
  const worldviewMap = new Map(worldviews.map(wv => [wv.name, wv.id]));
  const outcomeMap = new Map(outcomes.map(o => [o.name, o.id]));

  // Build records to insert
  const relationshipsToCreate = [];

  for (const [outcomeName, relevances] of Object.entries(outcomeWorldviewRelevance)) {
    const outcomeId = outcomeMap.get(outcomeName);

    if (!outcomeId) {
      console.warn(`⚠️  Warning: Outcome "${outcomeName}" not found in Airtable. Skipping...`);
      continue;
    }

    for (const [worldviewName, relevance] of Object.entries(relevances)) {
      const worldviewId = worldviewMap.get(worldviewName);

      if (!worldviewId) {
        console.warn(`⚠️  Warning: Worldview "${worldviewName}" not found in Airtable. Skipping...`);
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

  console.log(`Prepared ${relationshipsToCreate.length} relationships to create.\n`);

  if (relationshipsToCreate.length === 0) {
    console.error('❌ No relationships to create. Check outcome and worldview names.');
    return;
  }

  console.log('Creating records in Airtable...');

  // Create records in batches of 10 (Airtable API limit)
  const batchSize = 10;
  let successCount = 0;

  for (let i = 0; i < relationshipsToCreate.length; i += batchSize) {
    const batch = relationshipsToCreate.slice(i, i + batchSize);

    try {
      await base('Outcome-Worldview Relationships').create(batch);
      successCount += batch.length;
      console.log(`  ✓ Created ${successCount}/${relationshipsToCreate.length} relationships`);
    } catch (error: any) {
      console.error(`  ❌ Error creating batch:`, error.message);

      // If field names are wrong, show the error
      if (error.statusCode === 422) {
        console.error('\n⚠️  Field name mismatch. Please check your table has these fields:');
        console.error('   - "Outcome" (Link to Outcomes table)');
        console.error('   - "Worldview" (Link to Worldviews table)');
        console.error('   - "Relevance" (Single select with options: High, Medium, Low, Neutral)');
        return;
      }
    }
  }

  console.log(`\n✅ Successfully created ${successCount} relationships!`);
}

populateRelationships().catch(console.error);

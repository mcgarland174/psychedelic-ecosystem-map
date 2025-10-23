import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

async function inspectOutcomes() {
  console.log('=== OUTCOMES IN AIRTABLE ===\n');

  await base('Outcomes')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        console.log(`Name: ${record.get('Name')}`);
        console.log(`Short Description: ${record.get('Short Description')}`);
        console.log(`Description: ${record.get('Description')}`);
        console.log(`Related Worldviews: ${record.get('Related Worldviews')}`);
        console.log('---\n');
      });
      fetchNextPage();
    });
}

async function inspectWorldviews() {
  console.log('\n=== WORLDVIEWS IN AIRTABLE ===\n');

  await base('Worldviews')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        console.log(`Name: ${record.get('Name')}`);
        console.log(`Short Name: ${record.get('Short Name')}`);
        console.log(`Tagline: ${record.get('Tagline')}`);
        console.log(`Description: ${record.get('Description')}`);
        console.log(`Color: ${record.get('Color')}`);
        console.log('---\n');
      });
      fetchNextPage();
    });
}

async function main() {
  await inspectOutcomes();
  await inspectWorldviews();
}

main().catch(console.error);

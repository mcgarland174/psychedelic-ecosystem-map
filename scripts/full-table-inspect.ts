import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

async function fullInspection() {
  console.log('=== Full Inspection of Outcome-Worldview Relationships ===\n');

  const allRecords: any[] = [];

  await base('Outcome-Worldview Relationships')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        allRecords.push({
          id: record.id,
          fields: record.fields,
          _rawJson: record._rawJson
        });
      });
      fetchNextPage();
    });

  console.log(`Total records: ${allRecords.length}\n`);

  if (allRecords.length > 0) {
    console.log('=== First Record (Full Details) ===');
    console.log(JSON.stringify(allRecords[0], null, 2));

    console.log('\n=== All Record IDs and Field Keys ===');
    allRecords.forEach((record, idx) => {
      const fieldKeys = Object.keys(record.fields);
      console.log(`\nRecord ${idx + 1} (${record.id}):`);
      console.log(`  Fields: [${fieldKeys.join(', ')}]`);
      if (fieldKeys.length > 0) {
        fieldKeys.forEach(key => {
          console.log(`    ${key} = ${JSON.stringify(record.fields[key])}`);
        });
      } else {
        console.log('    (No fields with data)');
      }
    });
  }
}

fullInspection().catch(console.error);

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

async function inspectRelationshipTable() {
  console.log('=== Inspecting Outcome-Worldview Relationships Table ===\n');

  try {
    const records = await base('Outcome-Worldview Relationships')
      .select({
        maxRecords: 10,
        view: 'Grid view'
      })
      .firstPage();

    console.log(`Found ${records.length} records in the table.\n`);

    if (records.length > 0) {
      console.log('Field names in the table:');
      const fieldNames = Object.keys(records[0].fields);
      fieldNames.forEach(field => {
        console.log(`  - "${field}"`);
      });

      console.log('\n--- Sample Records ---\n');
      records.slice(0, 3).forEach((record, idx) => {
        console.log(`Record ${idx + 1}:`);
        Object.entries(record.fields).forEach(([key, value]) => {
          console.log(`  ${key}: ${JSON.stringify(value)}`);
        });
        console.log('');
      });
    } else {
      console.log('⚠️  Table is empty. No records to inspect.');
      console.log('Please add the fields manually or let me know the field names you created.');
    }

  } catch (error: any) {
    console.error('Error accessing table:', error.message);
    if (error.statusCode === 404) {
      console.error('\n❌ Table "Outcome-Worldview Relationships" not found.');
      console.error('Please check:');
      console.error('  1. Table name is exactly "Outcome-Worldview Relationships"');
      console.error('  2. Table exists in your base');
    }
  }
}

inspectRelationshipTable().catch(console.error);

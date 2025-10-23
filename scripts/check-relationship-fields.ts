import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID || '');

async function checkFields() {
  console.log('Checking Outcome-Worldview Relationships table fields...\n');

  try {
    // Try to create a test record to see what fields are expected
    const testRecord = await base('Outcome-Worldview Relationships').create({
      // Leave empty to see what fields exist
    }, { typecast: true });

    console.log('Record created (will delete). Fields found:');
    console.log(Object.keys(testRecord.fields));

    // Delete the test record
    await base('Outcome-Worldview Relationships').destroy(testRecord.id);
    console.log('\nTest record deleted.');

  } catch (error: any) {
    if (error.message && error.message.includes('Field')) {
      console.log('Error message:', error.message);
      console.log('\nThis tells us what fields are missing or incorrect.');
    } else {
      console.error('Error:', error.message);
    }

    // Try fetching existing records to see field names
    console.log('\nAttempting to read existing records...');
    const records = await base('Outcome-Worldview Relationships')
      .select({ maxRecords: 1 })
      .firstPage();

    if (records.length > 0) {
      console.log('\nExisting record fields:', Object.keys(records[0].fields));
    } else {
      console.log('\nNo existing records found. Table appears empty.');

      // Let's try to get the schema from Airtable's metadata API
      console.log('\nPlease manually check your table and tell me the exact field names.');
      console.log('The fields should be named exactly as they appear in Airtable.');
    }
  }
}

checkFields().catch(console.error);

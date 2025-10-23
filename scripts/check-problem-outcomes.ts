import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

async function checkProblems() {
  console.log('Fetching problems...\n');

  const records = await base('Problems').select({
    maxRecords: 2
  }).all();

  records.forEach(record => {
    console.log('Problem:', record.get('Name'));
    console.log('All fields:', record.fields);
    console.log('---\n');
  });
}

checkProblems().catch(console.error);

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

const PROBLEMS_TABLE_ID = 'tblkSjXIReUHS828M';

async function fetchRecords() {
  const url = `https://api.airtable.com/v0/${baseId}/${PROBLEMS_TABLE_ID}`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  const data = await response.json();
  return data.records;
}

(async () => {
  console.log('Checking Problems table fields...\n');

  const records = await fetchRecords();

  // Collect all unique field names across all records
  const allFields = new Set();

  records.forEach(record => {
    Object.keys(record.fields).forEach(field => {
      allFields.add(field);
    });
  });

  console.log('All fields in Problems table:');
  Array.from(allFields).sort().forEach(field => {
    console.log(`  - ${field}`);
  });

  // Look for fields that might be the Projects link
  const projectFields = Array.from(allFields).filter(f =>
    f.toLowerCase().includes('project')
  );

  console.log('\nFields containing "project":');
  projectFields.forEach(field => {
    console.log(`  - ${field}`);

    // Find a record that has this field populated
    const sampleRecord = records.find(r => r.fields[field]);
    if (sampleRecord) {
      console.log(`    Type: ${Array.isArray(sampleRecord.fields[field]) ? 'Array (Link)' : typeof sampleRecord.fields[field]}`);
      console.log(`    Sample value:`, sampleRecord.fields[field]);
    } else {
      console.log(`    (No records have this field populated yet)`);
    }
  });
})();

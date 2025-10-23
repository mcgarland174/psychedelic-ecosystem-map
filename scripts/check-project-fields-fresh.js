const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

async function fetchProjects() {
  const url = `https://api.airtable.com/v0/${baseId}/tblwn6yybKojpux1r?maxRecords=5`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  const data = await response.json();

  console.log(`Fetched ${data.records.length} projects\n`);

  // Collect all unique field names
  const allFields = new Set();
  data.records.forEach(record => {
    Object.keys(record.fields).forEach(field => allFields.add(field));
  });

  console.log('All fields found:');
  Array.from(allFields).sort().forEach(field => {
    console.log(`  - ${field}`);
  });

  console.log('\nFields containing "problem":');
  const problemFields = Array.from(allFields).filter(f => f.toLowerCase().includes('problem'));

  if (problemFields.length > 0) {
    problemFields.forEach(field => {
      console.log(`  ✓ ${field}`);

      // Show sample data
      const sampleRecord = data.records.find(r => r.fields[field]);
      if (sampleRecord) {
        console.log(`    Sample:`, sampleRecord.fields[field]);
      }
    });
  } else {
    console.log('  (none found)');
  }
}

fetchProjects();

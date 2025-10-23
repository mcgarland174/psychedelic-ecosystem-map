const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

async function fetchTable(tableId, tableName) {
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  const data = await response.json();
  console.log(`\n${tableName}: ${data.records.length} records`);

  if (data.records.length > 0) {
    const fields = Object.keys(data.records[0].fields);
    console.log(`Fields: ${fields.join(', ')}`);
  }

  return data.records;
}

(async () => {
  const problems = await fetchTable('tblkSjXIReUHS828M', 'Problems');
  const projects = await fetchTable('tblwn6yybKojpux1r', 'Projects');

  console.log('\n--- Sample Problem ---');
  if (problems.length > 0) {
    console.log('Name:', problems[0].fields.Name);
    console.log('Description:', problems[0].fields.Description?.substring(0, 200) + '...');
  }

  console.log('\n--- Sample Project ---');
  if (projects.length > 0) {
    console.log('Name:', projects[0].fields.Name);
    const desc = projects[0].fields['Project Description'] || projects[0].fields.Description;
    console.log('Description:', desc?.substring(0, 200) + '...');
  }
})();

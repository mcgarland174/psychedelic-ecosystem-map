import Airtable from 'airtable';
import * as fs from 'fs';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY?.trim(),
}).base(process.env.AIRTABLE_BASE_ID?.trim() || '');

interface CSVOrganization {
  'Organization Name': string;
  'Organization Type': string;
  'Entity Type': string;
  'Ecosystem Role': string;
  'Website': string;
  'State / Province': string;
  'Country': string;
  'Area of Focus': string;
  'Substance of Focus': string;
  'Population Served': string;
  'Status': string;
  'Description of Activities': string;
}

// Parse CSV manually to handle quoted fields properly
function parseCSV(csvContent: string): CSVOrganization[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const organizations: CSVOrganization[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length === headers.length) {
      const org: any = {};
      headers.forEach((header, index) => {
        org[header] = values[index];
      });
      organizations.push(org as CSVOrganization);
    }
  }

  return organizations;
}

async function analyzeSpecificOrgs() {
  const csvPath = '/Users/malcolmgarland/Desktop/Copy of Organizations-Grid view - Organizations-Grid view.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const csvOrganizations = parseCSV(csvContent);

  // Fetch Airtable data
  const airtableOrgs = new Map<string, any>();
  await base('Organizations')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        const name = record.get('Organization Name') as string;
        if (name) {
          airtableOrgs.set(name.toLowerCase().trim(), {
            id: record.id,
            name: name,
            fields: record.fields,
          });
        }
      });
      fetchNextPage();
    });

  // Categories of changes
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('              DETAILED ANALYSIS OF UPDATES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Organizations getting descriptions updated
  console.log('📝 ORGANIZATIONS WITH DESCRIPTION CHANGES:\n');
  let descCount = 0;
  csvOrganizations.slice(0, 5).forEach(csvOrg => {
    const existing = airtableOrgs.get(csvOrg['Organization Name'].toLowerCase().trim());
    if (existing) {
      const oldDesc = existing.fields['Description of Activities'];
      const newDesc = csvOrg['Description of Activities'];
      if (oldDesc !== newDesc && newDesc && newDesc.trim() !== '') {
        descCount++;
        console.log(`${descCount}. ${csvOrg['Organization Name']}`);
        console.log(`   OLD: ${oldDesc || '(empty)'}`);
        console.log(`   NEW: ${newDesc}`);
        console.log('');
      }
    }
  });

  // 2. Organizations getting fields filled in (empty -> filled)
  console.log('\n✨ ORGANIZATIONS GETTING NEW DATA (previously empty):\n');
  let newDataCount = 0;
  csvOrganizations.slice(0, 10).forEach(csvOrg => {
    const existing = airtableOrgs.get(csvOrg['Organization Name'].toLowerCase().trim());
    if (existing) {
      const fieldsBeingFilled: string[] = [];

      // Check each field
      if (!existing.fields['Entity Type'] && csvOrg['Entity Type']) {
        fieldsBeingFilled.push(`Entity Type: ${csvOrg['Entity Type']}`);
      }
      if (!existing.fields['Ecosystem Role'] && csvOrg['Ecosystem Role']) {
        fieldsBeingFilled.push(`Ecosystem Role: ${csvOrg['Ecosystem Role']}`);
      }
      if ((!existing.fields['State / Province'] || existing.fields['State / Province'].length === 0) && csvOrg['State / Province']) {
        fieldsBeingFilled.push(`State: ${csvOrg['State / Province']}`);
      }
      if (!existing.fields['Description of Activities'] && csvOrg['Description of Activities']) {
        fieldsBeingFilled.push(`Description: ${csvOrg['Description of Activities'].substring(0, 50)}...`);
      }

      if (fieldsBeingFilled.length > 0) {
        newDataCount++;
        console.log(`${newDataCount}. ${csvOrg['Organization Name']}`);
        fieldsBeingFilled.forEach(f => console.log(`   + ${f}`));
        console.log('');
      }
    }
  });

  // 3. Organizations where data is being REPLACED (had data, now different)
  console.log('\n⚠️  ORGANIZATIONS WITH DATA BEING REPLACED:\n');
  let replaceCount = 0;
  csvOrganizations.forEach(csvOrg => {
    const existing = airtableOrgs.get(csvOrg['Organization Name'].toLowerCase().trim());
    if (existing && replaceCount < 10) {
      const replacements: string[] = [];

      // Check Description
      const oldDesc = existing.fields['Description of Activities'];
      const newDesc = csvOrg['Description of Activities'];
      if (oldDesc && newDesc && oldDesc.trim() !== '' && newDesc.trim() !== '' && oldDesc !== newDesc) {
        replacements.push('Description');
      }

      // Check Website
      const oldWebsite = existing.fields['Website'];
      const newWebsite = csvOrg['Website'];
      if (oldWebsite && newWebsite && oldWebsite !== newWebsite) {
        replacements.push(`Website: ${oldWebsite} → ${newWebsite}`);
      }

      if (replacements.length > 0) {
        replaceCount++;
        console.log(`${replaceCount}. ${csvOrg['Organization Name']}`);
        replacements.forEach(r => console.log(`   ⚠️  ${r}`));
        console.log('');
      }
    }
  });

  // 4. List the unchanged organizations
  console.log('\n✅ UNCHANGED ORGANIZATIONS (CSV matches Airtable):\n');
  const unchanged: string[] = [];
  csvOrganizations.forEach(csvOrg => {
    const existing = airtableOrgs.get(csvOrg['Organization Name'].toLowerCase().trim());
    if (existing) {
      // Quick check if major fields match
      const matches =
        existing.fields['Entity Type'] === csvOrg['Entity Type'] &&
        existing.fields['Website'] === csvOrg['Website'] &&
        existing.fields['Description of Activities'] === csvOrg['Description of Activities'];

      if (matches) {
        unchanged.push(csvOrg['Organization Name']);
      }
    }
  });

  unchanged.slice(0, 17).forEach((name, i) => {
    console.log(`${i + 1}. ${name}`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
}

analyzeSpecificOrgs();

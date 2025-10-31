import Airtable from 'airtable';
import * as fs from 'fs';
import * as path from 'path';

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

interface AirtableOrganization {
  id: string;
  name: string;
  fields: any;
}

interface UpdateStats {
  matched: number;
  toUpdate: number;
  toCreate: number;
  unchanged: number;
  errors: string[];
}

interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

interface OrganizationChange {
  name: string;
  action: 'update' | 'create' | 'unchanged';
  changes?: FieldChange[];
  recordId?: string;
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

// Convert CSV field to Airtable format
function convertToAirtableField(fieldName: string, value: string): any {
  if (!value || value.trim() === '') {
    return undefined;
  }

  // Multi-select fields (arrays)
  const arrayFields = [
    'Organization Type',
    'Ecosystem Role',
    'State / Province',
    'Country',
    'Area of Focus',
    'Substance of Focus',
    'Population Served',
    'Status'
  ];

  if (arrayFields.includes(fieldName)) {
    // Split by comma and clean up
    return value.split(',').map(v => v.trim()).filter(v => v !== '');
  }

  return value;
}

// Map CSV field names to Airtable field names
function mapCSVToAirtable(csvOrg: CSVOrganization): any {
  return {
    'Organization Name': convertToAirtableField('Organization Name', csvOrg['Organization Name']),
    'Organization Type': convertToAirtableField('Organization Type', csvOrg['Organization Type']),
    'Entity Type': convertToAirtableField('Entity Type', csvOrg['Entity Type']),
    'Ecosystem Role': convertToAirtableField('Ecosystem Role', csvOrg['Ecosystem Role']),
    'Website': convertToAirtableField('Website', csvOrg['Website']),
    'State / Province': convertToAirtableField('State / Province', csvOrg['State / Province']),
    'Country': convertToAirtableField('Country', csvOrg['Country']),
    'Area of Focus': convertToAirtableField('Area of Focus', csvOrg['Area of Focus']),
    'Substance of Focus': convertToAirtableField('Substance of Focus', csvOrg['Substance of Focus']),
    'Population Served': convertToAirtableField('Population Served', csvOrg['Population Served']),
    'Status': convertToAirtableField('Status', csvOrg['Status']),
    'Description of Activities': convertToAirtableField('Description of Activities', csvOrg['Description of Activities']),
  };
}

// Compare two values for equality
function valuesEqual(val1: any, val2: any): boolean {
  // Handle undefined/null
  if (val1 == null && val2 == null) return true;
  if (val1 == null || val2 == null) return false;

  // Handle arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    const sorted1 = [...val1].sort();
    const sorted2 = [...val2].sort();
    return sorted1.every((v, i) => v === sorted2[i]);
  }

  // Handle strings
  if (typeof val1 === 'string' && typeof val2 === 'string') {
    return val1.trim() === val2.trim();
  }

  return val1 === val2;
}

// Compare CSV data with existing Airtable record
function getFieldChanges(airtableFields: any, csvFields: any): FieldChange[] {
  const changes: FieldChange[] = [];
  const csvFieldNames = Object.keys(csvFields);

  for (const fieldName of csvFieldNames) {
    const newValue = csvFields[fieldName];
    const oldValue = airtableFields[fieldName];

    // Skip if new value is undefined (not in CSV)
    if (newValue === undefined) continue;

    if (!valuesEqual(oldValue, newValue)) {
      changes.push({
        field: fieldName,
        oldValue: oldValue,
        newValue: newValue,
      });
    }
  }

  return changes;
}

async function fetchAllAirtableOrganizations(): Promise<Map<string, AirtableOrganization>> {
  const orgMap = new Map<string, AirtableOrganization>();

  console.log('Fetching existing organizations from Airtable...');

  await base('Organizations')
    .select({ view: 'Grid view' })
    .eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        const name = record.get('Organization Name') as string;
        if (name) {
          orgMap.set(name.toLowerCase().trim(), {
            id: record.id,
            name: name,
            fields: record.fields,
          });
        }
      });
      fetchNextPage();
    });

  console.log(`Fetched ${orgMap.size} existing organizations from Airtable\n`);
  return orgMap;
}

async function previewChanges(csvPath: string): Promise<OrganizationChange[]> {
  // Read CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const csvOrganizations = parseCSV(csvContent);
  console.log(`Loaded ${csvOrganizations.length} organizations from CSV\n`);

  // Fetch existing Airtable data
  const airtableOrgs = await fetchAllAirtableOrganizations();

  // Analyze changes
  const changes: OrganizationChange[] = [];
  const stats: UpdateStats = {
    matched: 0,
    toUpdate: 0,
    toCreate: 0,
    unchanged: 0,
    errors: [],
  };

  for (const csvOrg of csvOrganizations) {
    const orgName = csvOrg['Organization Name'];
    if (!orgName || orgName.trim() === '') {
      stats.errors.push('Found organization with empty name in CSV');
      continue;
    }

    const airtableFields = mapCSVToAirtable(csvOrg);
    const existingOrg = airtableOrgs.get(orgName.toLowerCase().trim());

    if (existingOrg) {
      // Organization exists - check for changes
      stats.matched++;
      const fieldChanges = getFieldChanges(existingOrg.fields, airtableFields);

      if (fieldChanges.length > 0) {
        stats.toUpdate++;
        changes.push({
          name: orgName,
          action: 'update',
          recordId: existingOrg.id,
          changes: fieldChanges,
        });
      } else {
        stats.unchanged++;
        changes.push({
          name: orgName,
          action: 'unchanged',
          recordId: existingOrg.id,
        });
      }
    } else {
      // New organization
      stats.toCreate++;
      changes.push({
        name: orgName,
        action: 'create',
        changes: Object.entries(airtableFields)
          .filter(([_, value]) => value !== undefined)
          .map(([field, value]) => ({
            field,
            oldValue: null,
            newValue: value,
          })),
      });
    }
  }

  return changes;
}

async function applyUpdates(csvPath: string, changes: OrganizationChange[]): Promise<void> {
  console.log('\n🚀 Starting to apply updates...\n');

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const csvOrganizations = parseCSV(csvContent);
  const csvMap = new Map(csvOrganizations.map(org => [org['Organization Name'].toLowerCase().trim(), org]));

  let updatedCount = 0;
  let createdCount = 0;
  let errorCount = 0;

  // Process updates
  const toUpdate = changes.filter(c => c.action === 'update');
  if (toUpdate.length > 0) {
    console.log(`Updating ${toUpdate.length} records...`);

    // Batch updates (max 10 at a time to respect API limits)
    for (let i = 0; i < toUpdate.length; i += 10) {
      const batch = toUpdate.slice(i, i + 10);
      const updatePromises = batch.map(async (change) => {
        try {
          const csvOrg = csvMap.get(change.name.toLowerCase().trim());
          if (!csvOrg) return;

          const fieldsToUpdate = mapCSVToAirtable(csvOrg);
          // Remove undefined fields
          Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === undefined) {
              delete fieldsToUpdate[key];
            }
          });

          await base('Organizations').update(change.recordId!, fieldsToUpdate);
          updatedCount++;
          console.log(`  ✓ Updated: ${change.name}`);
        } catch (error: any) {
          errorCount++;
          console.error(`  ✗ Error updating ${change.name}:`, error.message);
        }
      });

      await Promise.all(updatePromises);

      // Rate limiting - wait a bit between batches
      if (i + 10 < toUpdate.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  // Process creates
  const toCreate = changes.filter(c => c.action === 'create');
  if (toCreate.length > 0) {
    console.log(`\nCreating ${toCreate.length} new records...`);

    // Batch creates (max 10 at a time)
    for (let i = 0; i < toCreate.length; i += 10) {
      const batch = toCreate.slice(i, i + 10);
      const createPromises = batch.map(async (change) => {
        try {
          const csvOrg = csvMap.get(change.name.toLowerCase().trim());
          if (!csvOrg) return;

          const fieldsToCreate = mapCSVToAirtable(csvOrg);
          // Remove undefined fields
          Object.keys(fieldsToCreate).forEach(key => {
            if (fieldsToCreate[key] === undefined) {
              delete fieldsToCreate[key];
            }
          });

          await base('Organizations').create(fieldsToCreate);
          createdCount++;
          console.log(`  ✓ Created: ${change.name}`);
        } catch (error: any) {
          errorCount++;
          console.error(`  ✗ Error creating ${change.name}:`, error.message);
        }
      });

      await Promise.all(createPromises);

      // Rate limiting
      if (i + 10 < toCreate.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  console.log('\n✅ Update complete!');
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Created: ${createdCount}`);
  console.log(`   Errors: ${errorCount}`);
}

function printPreview(changes: OrganizationChange[]): void {
  const toUpdate = changes.filter(c => c.action === 'update');
  const toCreate = changes.filter(c => c.action === 'create');
  const unchanged = changes.filter(c => c.action === 'unchanged');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                      PREVIEW OF CHANGES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log(`📊 Summary:`);
  console.log(`   Total in CSV: ${changes.length}`);
  console.log(`   To Update: ${toUpdate.length}`);
  console.log(`   To Create: ${toCreate.length}`);
  console.log(`   Unchanged: ${unchanged.length}\n`);

  // Show updates
  if (toUpdate.length > 0) {
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`📝 ORGANIZATIONS TO UPDATE (${toUpdate.length}):`);
    console.log('─────────────────────────────────────────────────────────────\n');

    toUpdate.slice(0, 20).forEach((change, index) => {
      console.log(`${index + 1}. ${change.name}`);
      change.changes?.forEach((fieldChange) => {
        const oldVal = JSON.stringify(fieldChange.oldValue);
        const newVal = JSON.stringify(fieldChange.newValue);
        console.log(`   ${fieldChange.field}:`);
        console.log(`     OLD: ${oldVal}`);
        console.log(`     NEW: ${newVal}`);
      });
      console.log('');
    });

    if (toUpdate.length > 20) {
      console.log(`   ... and ${toUpdate.length - 20} more\n`);
    }
  }

  // Show creates
  if (toCreate.length > 0) {
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`✨ NEW ORGANIZATIONS TO CREATE (${toCreate.length}):`);
    console.log('─────────────────────────────────────────────────────────────\n');

    toCreate.slice(0, 10).forEach((change, index) => {
      console.log(`${index + 1}. ${change.name}`);
      change.changes?.slice(0, 3).forEach((fieldChange) => {
        console.log(`   ${fieldChange.field}: ${JSON.stringify(fieldChange.newValue)}`);
      });
      console.log('');
    });

    if (toCreate.length > 10) {
      console.log(`   ... and ${toCreate.length - 10} more\n`);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  const csvPath = args.find(arg => !arg.startsWith('--')) ||
    '/Users/malcolmgarland/Desktop/Copy of Organizations-Grid view - Organizations-Grid view.csv';

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  console.log(`Reading CSV from: ${csvPath}\n`);

  try {
    // Always preview first
    const changes = await previewChanges(csvPath);
    printPreview(changes);

    if (executeMode) {
      console.log('⚠️  EXECUTE MODE ENABLED - Changes will be applied to Airtable!\n');
      console.log('Starting in 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
      await applyUpdates(csvPath, changes);
    } else {
      console.log('ℹ️  This is a PREVIEW only. No changes have been made to Airtable.');
      console.log('   To apply these changes, run with --execute flag:\n');
      console.log(`   npx tsx scripts/update-organizations-from-csv.ts --execute\n`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

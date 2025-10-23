const fs = require('fs');
const path = require('path');

// Configuration - UPDATE THESE AFTER CREATING TABLES IN AIRTABLE
const CONFIG = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableIds: {
    worldviews: 'YOUR_WORLDVIEWS_TABLE_ID',
    cluster: 'YOUR_CLUSTER_TABLE_ID',
    outcomes: 'YOUR_OUTCOMES_TABLE_ID',
    problemCategories: 'YOUR_PROBLEM_CATEGORIES_TABLE_ID',
    problems: 'YOUR_PROBLEMS_TABLE_ID',
    projects: 'YOUR_PROJECTS_TABLE_ID'
  }
};

// CSV file paths
const CSV_DIR = path.join(process.env.HOME, 'Desktop');
const CSV_FILES = {
  worldviews: path.join(CSV_DIR, 'ToC_Worldviews.csv'),
  cluster: path.join(CSV_DIR, 'ToC_Cluster.csv'),
  outcomes: path.join(CSV_DIR, 'ToC_Outcomes.csv'),
  problemCategories: path.join(CSV_DIR, 'ToC_Problem_Categories.csv'),
  problems: path.join(CSV_DIR, 'ToC_Problems.csv')
};

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    // Handle quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim().replace(/^"|"$/g, ''));

    const record = {};
    headers.forEach((header, index) => {
      record[header] = fields[index] || '';
    });
    return record;
  });
}

// Airtable API helper
async function airtableRequest(tableId, method = 'GET', body = null) {
  const url = `https://api.airtable.com/v0/${CONFIG.baseId}/${tableId}`;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Create records in batches of 10 (Airtable limit)
async function createRecords(tableId, records) {
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  const allCreatedRecords = [];

  for (const batch of batches) {
    console.log(`  Creating batch of ${batch.length} records...`);
    const result = await airtableRequest(tableId, 'POST', { records: batch });
    allCreatedRecords.push(...result.records);
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return allCreatedRecords;
}

// Main import function
async function importData() {
  console.log('🚀 Starting Theory of Change data import...\n');

  // Verify configuration
  if (CONFIG.tableIds.worldviews === 'YOUR_WORLDVIEWS_TABLE_ID') {
    console.error('❌ ERROR: Please update the tableIds in CONFIG before running this script!');
    process.exit(1);
  }

  try {
    // Step 1: Import Clusters
    console.log('📊 Step 1/5: Importing Clusters...');
    const clusterCSV = fs.readFileSync(CSV_FILES.cluster, 'utf-8');
    const clusterData = parseCSV(clusterCSV);

    const clusterRecords = clusterData.map(row => ({
      fields: {
        'Cluster ID': row['Cluster ID'],
        'Cluster Name': row['Cluster Name'],
        'Cluster Definition': row['Cluster Definition']
      }
    }));

    const createdClusters = await createRecords(CONFIG.tableIds.cluster, clusterRecords);
    console.log(`✅ Created ${createdClusters.length} clusters\n`);

    // Create cluster ID to record ID map
    const clusterMap = {};
    createdClusters.forEach(record => {
      clusterMap[record.fields['Cluster ID']] = record.id;
    });

    // Step 2: Import Worldviews
    console.log('📊 Step 2/5: Importing Worldviews...');
    const worldviewsCSV = fs.readFileSync(CSV_FILES.worldviews, 'utf-8');
    const worldviewsData = parseCSV(worldviewsCSV);

    const worldviewRecords = worldviewsData.map(row => ({
      fields: {
        'Worldview ID': row['Worldview ID'],
        'Name': row['Name'],
        'Short Name': row['Short Name'],
        'Cluster': clusterMap[row['Cluster']] ? [clusterMap[row['Cluster']]] : [],
        'Tagline': row['Tagline'],
        'Core Identity': row['Core identity'],
        'Description': row['Description'],
        'Vision': row['Vision'],
        'Approach': row['Approach'],
        'Strengths': row['Strengths'],
        'Tensions': row['Tensions'],
        'Natural Allies': row['Natural Allies'],
        'Example Organizations': row['Example Organizations'],
        'Status': row['Status'] || 'Active'
      }
    }));

    const createdWorldviews = await createRecords(CONFIG.tableIds.worldviews, worldviewRecords);
    console.log(`✅ Created ${createdWorldviews.length} worldviews\n`);

    // Step 3: Import Outcomes
    console.log('📊 Step 3/5: Importing Outcomes...');
    const outcomesCSV = fs.readFileSync(CSV_FILES.outcomes, 'utf-8');
    const outcomesData = parseCSV(outcomesCSV);

    const outcomeRecords = outcomesData.map(row => ({
      fields: {
        'Outcome ID': row['Outcome ID'],
        'Name': row['Name'],
        'Short Description': row['Short Description'],
        'Description': row['Description'],
        'Success Indicators': row['Success Indicators'],
        'Related Worldviews': row['Related Worldviews'],
        'Status': row['Status'] || 'Active'
      }
    }));

    const createdOutcomes = await createRecords(CONFIG.tableIds.outcomes, outcomeRecords);
    console.log(`✅ Created ${createdOutcomes.length} outcomes\n`);

    // Create outcome ID to record ID map
    const outcomeMap = {};
    createdOutcomes.forEach(record => {
      outcomeMap[record.fields['Outcome ID']] = record.id;
    });

    // Step 4: Import Problem Categories
    console.log('📊 Step 4/5: Importing Problem Categories...');
    const categoriesCSV = fs.readFileSync(CSV_FILES.problemCategories, 'utf-8');
    const categoriesData = parseCSV(categoriesCSV);

    const categoryRecords = categoriesData.map(row => ({
      fields: {
        'Category ID': row['Category ID'],
        'Problem Category Name': row['Problem_category_name'],
        'Status': row['Status'] || 'Active'
      }
    }));

    const createdCategories = await createRecords(CONFIG.tableIds.problemCategories, categoryRecords);
    console.log(`✅ Created ${createdCategories.length} problem categories\n`);

    // Create category ID to record ID map
    const categoryMap = {};
    createdCategories.forEach(record => {
      categoryMap[record.fields['Category ID']] = record.id;
    });

    // Step 5: Import Problems
    console.log('📊 Step 5/5: Importing Problems...');
    const problemsCSV = fs.readFileSync(CSV_FILES.problems, 'utf-8');
    const problemsData = parseCSV(problemsCSV);

    const problemRecords = problemsData.map(row => ({
      fields: {
        'Problem ID': row['Problem ID'],
        'Name': row['Name'],
        'Description': row['Description'],
        'Problem Category': categoryMap[row['problem_Category']] ? [categoryMap[row['problem_Category']]] : [],
        'Affected Outcomes': row['Affected Outcomes'] || '',
        'Related Projects': row['Related Projects'] || '',
        'Status': row['Status'] || 'Active'
      }
    }));

    const createdProblems = await createRecords(CONFIG.tableIds.problems, problemRecords);
    console.log(`✅ Created ${createdProblems.length} problems\n`);

    // Summary
    console.log('🎉 Import complete!\n');
    console.log('Summary:');
    console.log(`  - Clusters: ${createdClusters.length}`);
    console.log(`  - Worldviews: ${createdWorldviews.length}`);
    console.log(`  - Outcomes: ${createdOutcomes.length}`);
    console.log(`  - Problem Categories: ${createdCategories.length}`);
    console.log(`  - Problems: ${createdProblems.length}`);
    console.log('\n✅ All data imported successfully!');
    console.log('\nNext steps:');
    console.log('  1. Review the data in Airtable');
    console.log('  2. Link Projects to Problems manually or via another script');
    console.log('  3. Update the Theory of Change page to fetch from Airtable');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the import
importData();

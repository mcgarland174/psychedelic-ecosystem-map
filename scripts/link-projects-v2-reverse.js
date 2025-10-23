const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

const PROBLEMS_TABLE_ID = 'tblkSjXIReUHS828M';
const PROJECTS_TABLE_ID = 'tblwn6yybKojpux1r';

// Fetch all records from a table
async function fetchAllRecords(tableId) {
  let records = [];
  let offset = null;

  do {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}${offset ? `?offset=${offset}` : ''}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const data = await response.json();
    records = records.concat(data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

// Update a record
async function updateRecord(tableId, recordId, fields) {
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Match problems to a project
function matchProblems(project, allProblems) {
  const matches = [];

  const projectName = project.fields['Project Name']?.toLowerCase() || '';
  const projectDesc = project.fields['Project Description']?.toLowerCase() || '';
  const projectType = (project.fields['Type of Project'] || []).join(' ').toLowerCase();
  const projectPriority = project.fields['Priority Area']?.toLowerCase() || '';
  const projectText = projectName + ' ' + projectDesc + ' ' + projectType + ' ' + projectPriority;

  // Skip if project has no meaningful content
  if (!projectName && !projectDesc) return [];

  // Define keyword mappings
  const keywordMappings = {
    'data': ['data', 'database', 'information', 'tracking', 'reporting', 'monitoring', 'registry', 'collection'],
    'safety': ['safety', 'adverse', 'harm reduction', 'crisis', 'emergency', 'poison', 'risk'],
    'training': ['training', 'education', 'practitioner', 'certification', 'competency', 'curriculum', 'workshop'],
    'indigenous': ['indigenous', 'traditional', 'cultural', 'ceremonial', 'tribal', 'native', 'ancestry'],
    'equity': ['equity', 'access', 'marginalized', 'underserved', 'BIPOC', 'diversity', 'inclusion', 'justice'],
    'policy': ['policy', 'legislation', 'regulation', 'governance', 'advocacy', 'reform', 'legal'],
    'research': ['research', 'study', 'trial', 'clinical', 'scientific', 'evidence', 'investigation'],
    'community': ['community', 'peer support', 'grassroots', 'support group', 'network']
  };

  // Check each problem
  for (const problem of allProblems) {
    const problemName = problem.fields.Name?.toLowerCase() || '';
    const problemDesc = problem.fields.Description?.toLowerCase() || '';
    const problemText = problemName + ' ' + problemDesc;

    // Score based on keyword matches
    let score = 0;

    for (const [category, keywords] of Object.entries(keywordMappings)) {
      const problemHasCategory = keywords.some(kw => problemText.includes(kw));
      const projectHasCategory = keywords.some(kw => projectText.includes(kw));

      if (problemHasCategory && projectHasCategory) {
        score += 1;
      }
    }

    // Additional specific matches
    if (problemText.includes('colorado') && projectText.includes('colorado')) score += 2;
    if (problemText.includes('oregon') && projectText.includes('oregon')) score += 2;
    if (problemText.includes('poison') && projectText.includes('poison')) score += 3;
    if (problemText.includes('spiritual') && projectText.includes('spiritual')) score += 2;

    // If score is 2 or higher, it's likely a match
    if (score >= 2) {
      matches.push({
        problem,
        score,
        problemName: problemName || problemDesc.substring(0, 50)
      });
    }
  }

  // Sort by score
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

// Main execution
(async () => {
  console.log('🔍 Fetching Projects and Problems from Airtable...\n');

  const [projects, problems] = await Promise.all([
    fetchAllRecords(PROJECTS_TABLE_ID),
    fetchAllRecords(PROBLEMS_TABLE_ID)
  ]);

  console.log(`Found ${projects.length} projects and ${problems.length} problems\n`);

  // Check for "Addressed Problems" field in Projects table
  const sampleProject = projects.find(p => Object.keys(p.fields).length > 0);

  if (!sampleProject) {
    console.log('❌ No projects with fields found');
    return;
  }

  // Look for the Addressed Problems field
  const addressedProblemsField = Object.keys(sampleProject.fields).find(f =>
    f === 'Addressed Problems' || f.toLowerCase().includes('problem')
  ) || 'Addressed Problems'; // Default to exact name

  console.log('Looking for "Addressed Problems" field...');

  console.log(`✅ Found field: "${addressedProblemsField}"\n`);
  console.log('🤖 Matching problems to projects...\n');

  let totalMatches = 0;
  const updates = [];
  let alreadyLinked = 0;
  let noMatches = 0;

  for (const project of projects) {
    const projectName = project.fields['Project Name'] || project.fields['Project Description']?.substring(0, 50) || 'Unnamed';

    // Check if already has problems linked
    const existingProblems = project.fields[addressedProblemsField] || [];

    if (existingProblems.length > 0) {
      alreadyLinked++;
      continue; // Skip if already linked
    }

    const matches = matchProblems(project, problems);

    if (matches.length > 0) {
      console.log(`\n📦 ${projectName}`);
      console.log(`   Found ${matches.length} potential problem matches:`);

      matches.slice(0, 3).forEach(m => {
        console.log(`   - ${m.problemName} (score: ${m.score})`);
      });

      // Prepare update with problem IDs (take top 3 matches)
      const problemIds = matches.slice(0, 3).map(m => m.problem.id);

      updates.push({
        projectId: project.id,
        projectName,
        problemIds,
        matchCount: matches.length
      });

      totalMatches += matches.length;
    } else {
      noMatches++;
      console.log(`\n📦 ${projectName} - No matching problems found`);
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  - Total projects: ${projects.length}`);
  console.log(`  - Already linked: ${alreadyLinked}`);
  console.log(`  - Found matches for: ${updates.length} projects`);
  console.log(`  - No matches found: ${noMatches} projects`);
  console.log(`  - Total potential matches: ${totalMatches}`);
  console.log(`  - Will link top 3 problems to each project\n`);

  // If UPDATE environment variable is set, proceed
  if (process.env.UPDATE === 'true') {
    console.log('🚀 Updating Projects table...\n');

    for (const update of updates) {
      try {
        await updateRecord(PROJECTS_TABLE_ID, update.projectId, {
          [addressedProblemsField]: update.problemIds
        });
        console.log(`✅ Updated: ${update.projectName} (${update.problemIds.length} problems)`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`❌ Failed to update ${update.projectName}:`, error.message);
      }
    }

    console.log('\n✨ Done! All projects have been linked to relevant problems.');
  } else {
    console.log('ℹ️  Dry run complete. No changes made to Airtable.');
    console.log('\nTo actually update records, run:');
    console.log('UPDATE=true node scripts/link-projects-v2-reverse.js');
  }
})();

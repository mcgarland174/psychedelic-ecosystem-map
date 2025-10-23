const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

const PROBLEMS_TABLE_ID = 'tblkSjXIReUHS828M';
const PROJECTS_TABLE_ID = 'tblwn6yybKojpux1r';
const PROJECTS_FIELD_NAME = 'Projects'; // The field name in Problems table

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

// Match projects to a problem based on descriptions and keywords
function matchProjects(problem, allProjects) {
  const matches = [];

  const problemName = problem.fields.Name?.toLowerCase() || '';
  const problemDesc = problem.fields.Description?.toLowerCase() || '';
  const problemText = problemName + ' ' + problemDesc;

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

  // Check each project
  for (const project of allProjects) {
    const projectName = project.fields['Project Name']?.toLowerCase() || '';
    const projectDesc = project.fields['Project Description']?.toLowerCase() || '';
    const projectType = (project.fields['Type of Project'] || []).join(' ').toLowerCase();
    const projectPriority = project.fields['Priority Area']?.toLowerCase() || '';
    const projectText = projectName + ' ' + projectDesc + ' ' + projectType + ' ' + projectPriority;

    // Skip if project has no meaningful content
    if (!projectName && !projectDesc) continue;

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
        project,
        score,
        projectName: projectName || projectDesc.substring(0, 50)
      });
    }
  }

  // Sort by score
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

// Main execution
(async () => {
  console.log('🔍 Fetching Problems and Projects from Airtable...\n');

  const [problems, projects] = await Promise.all([
    fetchAllRecords(PROBLEMS_TABLE_ID),
    fetchAllRecords(PROJECTS_TABLE_ID)
  ]);

  console.log(`Found ${problems.length} problems and ${projects.length} projects\n`);
  console.log('🤖 Matching projects to problems...\n');

  let totalMatches = 0;
  const updates = [];

  for (const problem of problems) {
    const matches = matchProjects(problem, projects);

    if (matches.length > 0) {
      console.log(`\n📋 ${problem.fields.Name}`);
      console.log(`   Found ${matches.length} potential matches:`);

      matches.slice(0, 5).forEach(m => {
        console.log(`   - ${m.projectName} (score: ${m.score})`);
      });

      // Prepare update with project IDs (take top 3 matches)
      const projectIds = matches.slice(0, 3).map(m => m.project.id);

      updates.push({
        problemId: problem.id,
        problemName: problem.fields.Name,
        projectIds,
        matchCount: matches.length
      });

      totalMatches += matches.length;
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  - Total potential matches: ${totalMatches}`);
  console.log(`  - Problems with matches: ${updates.length} / ${problems.length}`);
  console.log(`  - Will link top 3 projects to each problem\n`);

  // If UPDATE environment variable is set, proceed
  if (process.env.UPDATE === 'true') {
    console.log('🚀 Updating Problems table...\n');

    for (const update of updates) {
      try {
        await updateRecord(PROBLEMS_TABLE_ID, update.problemId, {
          [PROJECTS_FIELD_NAME]: update.projectIds
        });
        console.log(`✅ Updated: ${update.problemName} (${update.projectIds.length} projects)`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`❌ Failed to update ${update.problemName}:`, error.message);
      }
    }

    console.log('\n✨ Done! All problems have been linked to relevant projects.');
  } else {
    console.log('ℹ️  Dry run complete. No changes made to Airtable.');
    console.log('\nTo actually update records, run:');
    console.log('UPDATE=true node scripts/link-projects-v2.js');
  }
})();

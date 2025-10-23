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
    'data': ['data', 'database', 'information', 'tracking', 'reporting', 'monitoring', 'registry'],
    'safety': ['safety', 'adverse', 'harm reduction', 'crisis', 'emergency', 'poison'],
    'training': ['training', 'education', 'practitioner', 'certification', 'competency', 'curriculum'],
    'indigenous': ['indigenous', 'traditional', 'cultural', 'ceremonial', 'tribal', 'native'],
    'equity': ['equity', 'access', 'marginalized', 'underserved', 'BIPOC', 'diversity', 'inclusion'],
    'policy': ['policy', 'legislation', 'regulation', 'governance', 'advocacy', 'reform'],
    'research': ['research', 'study', 'trial', 'clinical', 'scientific', 'evidence'],
    'community': ['community', 'peer support', 'grassroots', 'support group']
  };

  // Check each project
  for (const project of allProjects) {
    const projectName = project.fields['Project Name']?.toLowerCase() || '';
    const projectDesc = project.fields['Project Description']?.toLowerCase() || '';
    const projectType = (project.fields['Type of Project'] || []).join(' ').toLowerCase();
    const projectPriority = project.fields['Priority Area']?.toLowerCase() || '';
    const projectText = projectName + ' ' + projectDesc + ' ' + projectType + ' ' + projectPriority;

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
    if (problemText.includes('poison center') && projectText.includes('poison')) score += 3;

    // If score is 2 or higher, it's likely a match
    if (score >= 2) {
      matches.push({
        project,
        score,
        reason: `Matched on ${score} categories`
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

  // Check if Problems table has a Projects field
  const sampleProblem = problems[0];
  const hasProjectsField = Object.keys(sampleProblem.fields).some(f =>
    f.toLowerCase().includes('project') && Array.isArray(sampleProblem.fields[f])
  );

  if (!hasProjectsField) {
    console.log('❌ ERROR: Problems table does not have a "Projects" link field.');
    console.log('Available fields:', Object.keys(sampleProblem.fields).join(', '));
    console.log('\nPlease add a "Projects" field (Link to another record → Projects table) to the Problems table.');
    return;
  }

  const projectsFieldName = Object.keys(sampleProblem.fields).find(f =>
    f.toLowerCase().includes('project') && Array.isArray(sampleProblem.fields[f])
  );

  console.log(`✅ Found Projects link field: "${projectsFieldName}"\n`);
  console.log('🤖 Matching projects to problems...\n');

  let totalMatches = 0;
  const updates = [];

  for (const problem of problems) {
    const matches = matchProjects(problem, projects);

    if (matches.length > 0) {
      console.log(`\n📋 ${problem.fields.Name}`);
      console.log(`   Found ${matches.length} potential matches:`);

      matches.slice(0, 5).forEach(m => {
        console.log(`   - ${m.project.fields['Project Name']} (score: ${m.score})`);
      });

      // Prepare update with project IDs
      const projectIds = matches.slice(0, 3).map(m => m.project.id);

      updates.push({
        problemId: problem.id,
        problemName: problem.fields.Name,
        projectIds
      });

      totalMatches += matches.length;
    }
  }

  console.log(`\n\n📊 Summary: Found ${totalMatches} total potential matches`);
  console.log(`Will update ${updates.length} problems with project links\n`);

  console.log('Would you like to proceed with updating the Problems table? (y/n)');
  console.log('(Run with UPDATE=true to actually update records)\n');

  // If UPDATE environment variable is set, proceed
  if (process.env.UPDATE === 'true') {
    console.log('🚀 Updating Problems table...\n');

    for (const update of updates) {
      try {
        await updateRecord(PROBLEMS_TABLE_ID, update.problemId, {
          [projectsFieldName]: update.projectIds
        });
        console.log(`✅ Updated: ${update.problemName}`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Failed to update ${update.problemName}:`, error.message);
      }
    }

    console.log('\n✨ Done! All problems have been linked to relevant projects.');
  } else {
    console.log('ℹ️  Dry run complete. No changes made to Airtable.');
    console.log('To actually update records, run: UPDATE=true node scripts/link-projects-to-problems.js');
  }
})();

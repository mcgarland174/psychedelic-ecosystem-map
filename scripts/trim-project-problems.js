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

// Score how relevant a problem is to a project
function scoreProblemRelevance(project, problem) {
  const projectName = project.fields['Project Name']?.toLowerCase() || '';
  const projectDesc = project.fields['Project Description']?.toLowerCase() || '';
  const projectType = (project.fields['Type of Project'] || []).join(' ').toLowerCase();
  const projectPriority = project.fields['Priority Area']?.toLowerCase() || '';
  const projectText = projectName + ' ' + projectDesc + ' ' + projectType + ' ' + projectPriority;

  const problemName = problem.fields.Name?.toLowerCase() || '';
  const problemDesc = problem.fields.Description?.toLowerCase() || '';
  const problemText = problemName + ' ' + problemDesc;

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

  let score = 0;

  for (const [category, keywords] of Object.entries(keywordMappings)) {
    const problemHasCategory = keywords.some(kw => problemText.includes(kw));
    const projectHasCategory = keywords.some(kw => projectText.includes(kw));

    if (problemHasCategory && projectHasCategory) {
      score += 1;
    }
  }

  // Specific boosts
  if (problemText.includes('colorado') && projectText.includes('colorado')) score += 2;
  if (problemText.includes('oregon') && projectText.includes('oregon')) score += 2;
  if (problemText.includes('poison') && projectText.includes('poison')) score += 3;
  if (problemText.includes('spiritual') && projectText.includes('spiritual')) score += 2;

  return score;
}

// Main execution
(async () => {
  console.log('🔍 Fetching Projects and Problems from Airtable...\n');

  const [projects, problems] = await Promise.all([
    fetchAllRecords(PROJECTS_TABLE_ID),
    fetchAllRecords(PROBLEMS_TABLE_ID)
  ]);

  console.log(`Found ${projects.length} projects and ${problems.length} problems\n`);

  // Create a problem lookup map
  const problemMap = {};
  problems.forEach(p => {
    problemMap[p.id] = p;
  });

  // Find projects with too many problems
  const projectsToTrim = [];
  let totalWithTooMany = 0;

  for (const project of projects) {
    const addressedProblems = project.fields['Addressed Problems'] || [];
    const projectName = project.fields['Project Name'] || project.fields['Project Description']?.substring(0, 50) || 'Unnamed';

    if (addressedProblems.length > 5) {
      totalWithTooMany++;

      // Score each problem
      const scoredProblems = addressedProblems.map(problemId => {
        const problem = problemMap[problemId];
        const score = problem ? scoreProblemRelevance(project, problem) : 0;
        return {
          problemId,
          problem,
          score
        };
      });

      // Sort by score
      scoredProblems.sort((a, b) => b.score - a.score);

      // Keep top 3
      const topProblems = scoredProblems.slice(0, 3);

      console.log(`\n📦 ${projectName}`);
      console.log(`   Currently has: ${addressedProblems.length} problems`);
      console.log(`   Will keep top 3:`);

      topProblems.forEach((p, idx) => {
        console.log(`   ${idx + 1}. ${p.problem?.fields.Name || 'Unknown'} (score: ${p.score})`);
      });

      projectsToTrim.push({
        projectId: project.id,
        projectName,
        currentCount: addressedProblems.length,
        keepProblems: topProblems.map(p => p.problemId)
      });
    } else if (addressedProblems.length >= 4) {
      // Show projects with 4-5 problems (at the limit)
      console.log(`\n✓ ${projectName}: ${addressedProblems.length} problems (at limit, no change needed)`);
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  - Total projects: ${projects.length}`);
  console.log(`  - Projects with >5 problems: ${totalWithTooMany}`);
  console.log(`  - Will trim down to 3 problems each\n`);

  // If UPDATE environment variable is set, proceed
  if (process.env.UPDATE === 'true') {
    console.log('🚀 Trimming projects with too many problems...\n');

    for (const update of projectsToTrim) {
      try {
        await updateRecord(PROJECTS_TABLE_ID, update.projectId, {
          'Addressed Problems': update.keepProblems
        });
        console.log(`✅ Trimmed: ${update.projectName} (${update.currentCount} → 3 problems)`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`❌ Failed to trim ${update.projectName}:`, error.message);
      }
    }

    console.log('\n✨ Done! All projects now have 3 or fewer problems.');
  } else {
    console.log('ℹ️  Dry run complete. No changes made to Airtable.');
    console.log('\nTo actually trim records, run:');
    console.log('UPDATE=true node scripts/trim-project-problems.js');
  }
})();

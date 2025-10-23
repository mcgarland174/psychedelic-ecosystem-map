import * as dotenv from 'dotenv';
import * as path from 'path';
import { loadTransformedData } from '../lib/data-transformer';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function test() {
  console.log('=== Testing Data Transformation ===\n');

  const data = await loadTransformedData();

  console.log('\n=== Sample Worldview ===');
  if (data.worldviews.length > 0) {
    const wv = data.worldviews[0];
    console.log(`ID: ${wv.id}`);
    console.log(`Name: ${wv.name}`);
    console.log(`Short Name: ${wv.shortName}`);
    console.log(`Color: ${wv.color}`);
    console.log(`Cluster: ${wv.cluster}`);
    console.log(`Tagline: ${wv.tagline}`);
  }

  console.log('\n=== Sample Outcome ===');
  if (data.outcomes.length > 0) {
    const outcome = data.outcomes[0];
    console.log(`ID: ${outcome.id}`);
    console.log(`Name: ${outcome.name}`);
    console.log(`Description: ${outcome.description.substring(0, 100)}...`);
    console.log(`Worldview Relevance:`, outcome.worldviewRelevance);
    console.log(`Success Indicators (${outcome.successIndicators.length} total):`);
    outcome.successIndicators.slice(0, 2).forEach((indicator, idx) => {
      console.log(`  ${idx + 1}. ${indicator.substring(0, 80)}...`);
    });
  }

  console.log('\n=== Sample Problem Category ===');
  if (data.problemCategories.length > 0) {
    const cat = data.problemCategories[0];
    console.log(`ID: ${cat.id}`);
    console.log(`Name: ${cat.name}`);
    console.log(`Icon: ${cat.icon}`);
  }

  console.log('\n=== Sample Problem ===');
  if (data.problems.length > 0) {
    const problem = data.problems[0];
    console.log(`ID: ${problem.id}`);
    console.log(`Name: ${problem.name}`);
    console.log(`Category: ${problem.category}`);
    console.log(`Affected Outcomes:`, problem.affectedOutcomes);
  }

  console.log('\n=== Sample Project ===');
  if (data.projects.length > 0) {
    const project = data.projects[0];
    console.log(`ID: ${project.id}`);
    console.log(`Name: ${project.name}`);
    console.log(`Organizations:`, project.organizations.slice(0, 2));
    console.log(`Status: ${project.status}`);
    console.log(`Addressed Problems:`, project.addressedProblems);
  }

  console.log('\n✅ Transformation test complete!');
}

test().catch(console.error);

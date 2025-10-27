/**
 * Airtable Form URLs and Pre-population Utilities
 *
 * This module provides utilities for generating Airtable form URLs with pre-populated data.
 * Airtable forms support pre-filling fields via URL parameters using the format:
 * ?prefill_FieldName=value
 */

import type { AppWorldview, AppOutcome, AppProblem, AppProject } from './data-transformer';

// Base form URLs
const FORM_URLS = {
  // Worldviews
  proposeWorldview: 'https://airtable.com/appQkt2yYzVKhRaXx/pagEZUcAb9vP4GyES/form',
  editWorldview: 'https://airtable.com/appQkt2yYzVKhRaXx/pagSrQiD2VLKruPu8/form',

  // Outcomes
  proposeOutcome: 'https://airtable.com/appQkt2yYzVKhRaXx/pagVXWSZzMH79ay7u/form',
  editOutcome: 'https://airtable.com/appQkt2yYzVKhRaXx/pagbjvFayRP1WSw4i/form',

  // Problems
  proposeProblem: 'https://airtable.com/appQkt2yYzVKhRaXx/pagT1ymQQXNAkDwnZ/form',
  editProblem: 'https://airtable.com/appQkt2yYzVKhRaXx/paghxP8Jn5kRgmeAF/form',

  // Projects
  submitProject: 'https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form',
  editProject: 'https://airtable.com/appQkt2yYzVKhRaXx/pag6Qb3syeGlCDUni/form',
} as const;

/**
 * Helper function to build URL with query parameters
 */
function buildFormUrl(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
}

/**
 * Generate URL for proposing a new worldview
 */
export function getProposeWorldviewUrl(): string {
  return FORM_URLS.proposeWorldview;
}

/**
 * Generate URL for editing a worldview with pre-populated data
 */
export function getEditWorldviewUrl(worldview: AppWorldview): string {
  return buildFormUrl(FORM_URLS.editWorldview, {
    'prefill_Worldview': worldview.recordId, // This should match the linked record field name in Airtable
    'prefill_Worldview Name': worldview.name,
    'prefill_Short Name': worldview.shortName,
    'prefill_Tagline': worldview.tagline,
    'prefill_Description': worldview.description,
    'prefill_Vision': worldview.vision,
    'prefill_Approach': worldview.approach,
    'prefill_Strengths': worldview.strengths,
    'prefill_Tensions': worldview.tensions,
  });
}

/**
 * Generate URL for proposing a new outcome
 */
export function getProposeOutcomeUrl(): string {
  return FORM_URLS.proposeOutcome;
}

/**
 * Generate URL for editing an outcome with pre-populated data
 */
export function getEditOutcomeUrl(outcome: AppOutcome): string {
  return buildFormUrl(FORM_URLS.editOutcome, {
    'prefill_Outcome Name': outcome.name,
    'prefill_Outcome ID': outcome.outcomeId,
    'prefill_Short Description': outcome.shortDescription,
    'prefill_Description': outcome.description,
    'prefill_Success Indicators': outcome.successIndicators,
  });
}

/**
 * Generate URL for proposing a new problem
 */
export function getProposeeProblemUrl(): string {
  return FORM_URLS.proposeProblem;
}

/**
 * Generate URL for editing a problem with pre-populated data
 */
export function getEditProblemUrl(problem: AppProblem): string {
  return buildFormUrl(FORM_URLS.editProblem, {
    'prefill_Problem Name': problem.name,
    'prefill_Problem ID': problem.problemId,
    'prefill_Description': problem.description,
  });
}

/**
 * Generate URL for submitting a new project
 */
export function getSubmitProjectUrl(): string {
  return FORM_URLS.submitProject;
}

/**
 * Generate URL for editing a project with pre-populated data
 */
export function getEditProjectUrl(project: AppProject): string {
  return buildFormUrl(FORM_URLS.editProject, {
    'prefill_Project Name': project.name,
    'prefill_Description': project.description,
    'prefill_Status': project.status,
    'prefill_Organizations': project.organizations.join(', '),
  });
}

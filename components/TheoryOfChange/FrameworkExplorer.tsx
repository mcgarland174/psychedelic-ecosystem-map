'use client';

import { useState, useMemo } from 'react';
import type { AppProject, AppProblem, AppProblemCategory, AppWorldview, AppOutcome } from '@/lib/data-transformer';
import WorldviewDetailModal from './Modals/WorldviewDetailModal';
import OutcomeDetailModal from './Modals/OutcomeDetailModal';
import ProblemDetailModal from './Modals/ProblemDetailModal';
import ProjectDetailModal from './Modals/ProjectDetailModal';
import {
  getProposeWorldviewUrl,
  getProposeOutcomeUrl,
  getProposeeProblemUrl,
  getSubmitProjectUrl
} from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, LIGHT_TEXT, NEUTRALS, PRIMARY, TEAL, ORANGE_GOLD, getCategoryBadgeClasses, getCategoryColor } from '@/lib/brand-colors';

interface FrameworkExplorerProps {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problems: AppProblem[];
  problemCategories: AppProblemCategory[];
  projects: AppProject[];
}

type ExploreTab = 'worldviews' | 'outcomes' | 'problems' | 'projects';
type ViewMode = 'grid' | 'list' | 'compact';
type SortOption = string;

export default function FrameworkExplorer({
  worldviews,
  outcomes,
  problems,
  problemCategories,
  projects,
}: FrameworkExplorerProps) {
  const [activeTab, setActiveTab] = useState<ExploreTab>('worldviews');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Worldview filters
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedOutcomeForWV, setSelectedOutcomeForWV] = useState<string | null>(null);
  const [worldviewSort, setWorldviewSort] = useState<SortOption>('alphabetical-az');

  // Outcome filters
  const [selectedWorldviewForOutcome, setSelectedWorldviewForOutcome] = useState<string | null>(null);
  const [relevanceFilter, setRelevanceFilter] = useState<string | null>(null);
  const [outcomeSort, setOutcomeSort] = useState<SortOption>('outcome-id');

  // Problem filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOutcomeForProblem, setSelectedOutcomeForProblem] = useState<string | null>(null);
  const [projectCoverage, setProjectCoverage] = useState<string | null>(null);
  const [problemSort, setProblemSort] = useState<SortOption>('problem-id');

  // Project filters
  const [selectedProblemForProject, setSelectedProblemForProject] = useState<string | null>(null);
  const [selectedOutcomeForProject, setSelectedOutcomeForProject] = useState<string | null>(null);
  const [selectedWorldviewForProject, setSelectedWorldviewForProject] = useState<string | null>(null);
  const [projectSort, setProjectSort] = useState<SortOption>('alphabetical-az');

  // Detail modals
  const [selectedWorldview, setSelectedWorldview] = useState<AppWorldview | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<AppOutcome | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<AppProblem | null>(null);
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);

  // Extract unique clusters from worldviews
  const clusters = useMemo(() => {
    const clusterMap = new Map<string, string>();
    worldviews.forEach(wv => {
      if (wv.cluster) {
        // Convert cluster to string and normalize by trimming whitespace
        const clusterStr = Array.isArray(wv.cluster) ? wv.cluster.join(', ') : String(wv.cluster);
        const normalized = clusterStr.trim();
        // Use normalized as key to prevent duplicates, store original for display
        if (!clusterMap.has(normalized)) {
          clusterMap.set(normalized, normalized);
        }
      }
    });
    return Array.from(clusterMap.values()).sort();
  }, [worldviews]);

  // Extract unique organizations from projects
  const organizations = useMemo(() => {
    const orgNames = new Set<string>();
    projects.forEach(p => {
      p.organizations?.forEach(org => orgNames.add(org));
    });
    return Array.from(orgNames).sort().map(name => ({ id: name, name }));
  }, [projects]);

  // Filter and sort worldviews
  const filteredWorldviews = useMemo(() => {
    let filtered = [...worldviews];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(wv =>
        wv.name.toLowerCase().includes(term) ||
        wv.shortName?.toLowerCase().includes(term) ||
        wv.tagline?.toLowerCase().includes(term) ||
        wv.description?.toLowerCase().includes(term)
      );
    }

    // Cluster filter
    if (selectedCluster) {
      filtered = filtered.filter(wv => {
        if (!wv.cluster) return false;
        const clusterStr = Array.isArray(wv.cluster) ? wv.cluster.join(', ') : String(wv.cluster);
        return clusterStr.trim() === selectedCluster.trim();
      });
    }

    // Outcome relevance filter
    if (selectedOutcomeForWV) {
      const outcome = outcomes.find(o => o.id === selectedOutcomeForWV);
      if (outcome) {
        filtered = filtered.filter(wv =>
          outcome.worldviewRelevance[wv.id] === 'High' ||
          outcome.worldviewRelevance[wv.id] === 'Medium'
        );
      }
    }

    // Sort
    switch (worldviewSort) {
      case 'alphabetical-az':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'alphabetical-za':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'cluster':
        filtered.sort((a, b) => (a.cluster || '').localeCompare(b.cluster || ''));
        break;
    }

    return filtered;
  }, [worldviews, searchTerm, selectedCluster, selectedOutcomeForWV, worldviewSort, outcomes]);

  // Filter and sort outcomes
  const filteredOutcomes = useMemo(() => {
    let filtered = [...outcomes];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(term) ||
        o.shortDescription?.toLowerCase().includes(term) ||
        o.description?.toLowerCase().includes(term)
      );
    }

    // Worldview relevance filter
    if (selectedWorldviewForOutcome && relevanceFilter) {
      filtered = filtered.filter(o =>
        o.worldviewRelevance[selectedWorldviewForOutcome] === relevanceFilter
      );
    }

    // Sort
    switch (outcomeSort) {
      case 'outcome-id':
        filtered.sort((a, b) => a.outcomeId.localeCompare(b.outcomeId));
        break;
      case 'alphabetical-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'problems-desc':
        filtered.sort((a, b) => {
          const aProblems = problems.filter(p => p.affectedOutcomes.includes(a.id)).length;
          const bProblems = problems.filter(p => p.affectedOutcomes.includes(b.id)).length;
          return bProblems - aProblems;
        });
        break;
    }

    return filtered;
  }, [outcomes, searchTerm, selectedWorldviewForOutcome, relevanceFilter, outcomeSort, problems]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = [...problems];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.problemId.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Outcome filter
    if (selectedOutcomeForProblem) {
      filtered = filtered.filter(p => p.affectedOutcomes.includes(selectedOutcomeForProblem));
    }

    // Project coverage filter
    if (projectCoverage) {
      const projectsByProblem = new Map<string, number>();
      problems.forEach(prob => {
        const count = projects.filter(proj => proj.addressedProblems?.includes(prob.id)).length;
        projectsByProblem.set(prob.id, count);
      });

      if (projectCoverage === 'has-projects') {
        filtered = filtered.filter(p => (projectsByProblem.get(p.id) || 0) > 0);
      } else if (projectCoverage === 'no-projects') {
        filtered = filtered.filter(p => (projectsByProblem.get(p.id) || 0) === 0);
      } else if (projectCoverage === 'multiple-projects') {
        filtered = filtered.filter(p => (projectsByProblem.get(p.id) || 0) >= 2);
      }
    }

    // Sort
    switch (problemSort) {
      case 'problem-id':
        filtered.sort((a, b) => a.problemId.localeCompare(b.problemId));
        break;
      case 'alphabetical-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        filtered.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      case 'projects-desc':
        filtered.sort((a, b) => {
          const aCount = projects.filter(proj => proj.addressedProblems?.includes(a.id)).length;
          const bCount = projects.filter(proj => proj.addressedProblems?.includes(b.id)).length;
          return bCount - aCount;
        });
        break;
    }

    return filtered;
  }, [problems, searchTerm, selectedCategory, selectedOutcomeForProblem, projectCoverage, problemSort, projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(p => p.addressedProblems && p.addressedProblems.length > 0);

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    // Problem filter
    if (selectedProblemForProject) {
      filtered = filtered.filter(p => p.addressedProblems?.includes(selectedProblemForProject));
    }

    // Outcome filter (via problems)
    if (selectedOutcomeForProject) {
      const relevantProblems = problems.filter(prob =>
        prob.affectedOutcomes.includes(selectedOutcomeForProject)
      ).map(prob => prob.id);

      filtered = filtered.filter(p =>
        p.addressedProblems?.some(probId => relevantProblems.includes(probId))
      );
    }

    // Worldview filter (via outcomes via problems)
    if (selectedWorldviewForProject) {
      const relevantOutcomes = outcomes.filter(o =>
        o.worldviewRelevance[selectedWorldviewForProject] === 'High' ||
        o.worldviewRelevance[selectedWorldviewForProject] === 'Medium'
      ).map(o => o.id);

      const relevantProblems = problems.filter(prob =>
        prob.affectedOutcomes.some(outId => relevantOutcomes.includes(outId))
      ).map(prob => prob.id);

      filtered = filtered.filter(p =>
        p.addressedProblems?.some(probId => relevantProblems.includes(probId))
      );
    }

    // Sort
    switch (projectSort) {
      case 'alphabetical-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetical-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
    }

    return filtered;
  }, [projects, searchTerm, selectedProblemForProject, selectedOutcomeForProject, selectedWorldviewForProject, projectSort, problems, outcomes]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCluster(null);
    setSelectedOutcomeForWV(null);
    setSelectedWorldviewForOutcome(null);
    setRelevanceFilter(null);
    setSelectedCategory(null);
    setSelectedOutcomeForProblem(null);
    setProjectCoverage(null);
    setSelectedProblemForProject(null);
    setSelectedOutcomeForProject(null);
    setSelectedWorldviewForProject(null);
  };

  // Get active filter count based on current tab
  const activeFiltersCount = useMemo(() => {
    let count = searchTerm ? 1 : 0;

    switch (activeTab) {
      case 'worldviews':
        if (selectedCluster) count++;
        if (selectedOutcomeForWV) count++;
        break;
      case 'outcomes':
        if (selectedWorldviewForOutcome) count++;
        if (relevanceFilter) count++;
        break;
      case 'problems':
        if (selectedCategory) count++;
        if (selectedOutcomeForProblem) count++;
        if (projectCoverage) count++;
        break;
      case 'projects':
        if (selectedProblemForProject) count++;
        if (selectedOutcomeForProject) count++;
        if (selectedWorldviewForProject) count++;
        break;
    }

    return count;
  }, [activeTab, searchTerm, selectedCluster, selectedOutcomeForWV, selectedWorldviewForOutcome, relevanceFilter, selectedCategory, selectedOutcomeForProblem, projectCoverage, selectedProblemForProject, selectedOutcomeForProject, selectedWorldviewForProject]);

  // Get current filtered items based on active tab
  const currentItems = useMemo(() => {
    switch (activeTab) {
      case 'worldviews': return filteredWorldviews;
      case 'outcomes': return filteredOutcomes;
      case 'problems': return filteredProblems;
      case 'projects': return filteredProjects;
    }
  }, [activeTab, filteredWorldviews, filteredOutcomes, filteredProblems, filteredProjects]);

  // Get total count for current tab
  const totalCount = useMemo(() => {
    switch (activeTab) {
      case 'worldviews': return worldviews.length;
      case 'outcomes': return outcomes.length;
      case 'problems': return problems.length;
      case 'projects': return projects.filter(p => p.addressedProblems && p.addressedProblems.length > 0).length;
    }
  }, [activeTab, worldviews, outcomes, problems, projects]);

  // Gap analysis stats
  const problemsWithProjects = useMemo(() =>
    problems.filter(prob =>
      projects.some(proj => proj.addressedProblems?.includes(prob.id))
    ).length
  , [problems, projects]);

  const problemsNeedingProjects = problems.length - problemsWithProjects;
  const coveragePercentage = Math.round((problemsWithProjects / problems.length) * 100);

  return (
    <>
      <section className="min-h-screen px-6 py-12" style={{ backgroundColor: LIGHT_BACKGROUNDS.primary }}>
        <div className="max-w-[1800px] mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: PRIMARY.deepBrown }}>
              Framework Explorer
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: LIGHT_TEXT.secondary }}>
              Discover and explore the building blocks of change
            </p>
          </div>

          {/* Sticky Tab Navigation */}
          <div className="sticky top-0 z-20 pb-6 mb-6" style={{ backgroundColor: LIGHT_BACKGROUNDS.primary }}>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
            {/* Worldviews Tab */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('worldviews');
                  clearAllFilters();
                }}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                  activeTab === 'worldviews'
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={activeTab === 'worldviews' ? {
                  backgroundColor: TEAL.teal,
                  boxShadow: `0 4px 6px -1px ${TEAL.teal}50`
                } : undefined}
              >
                <span className="flex items-center gap-2">
                  🌍 Worldviews
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{
                    backgroundColor: activeTab === 'worldviews' ? TEAL.darkTeal : TEAL.lightTeal,
                    color: activeTab === 'worldviews' ? 'white' : TEAL.darkTeal
                  }}>
                    {worldviews.length}
                  </span>
                </span>
              </button>
            </div>

            {/* Arrow 1 */}
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: TEAL.teal }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Outcomes Tab */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('outcomes');
                  clearAllFilters();
                }}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                  activeTab === 'outcomes'
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={activeTab === 'outcomes' ? {
                  backgroundColor: TEAL.mediumTeal,
                  boxShadow: `0 4px 6px -1px ${TEAL.mediumTeal}50`
                } : undefined}
              >
                <span className="flex items-center gap-2">
                  🎯 Outcomes
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{
                    backgroundColor: activeTab === 'outcomes' ? TEAL.teal : TEAL.lightTeal,
                    color: activeTab === 'outcomes' ? 'white' : TEAL.darkTeal
                  }}>
                    {outcomes.length}
                  </span>
                </span>
              </button>
            </div>

            {/* Arrow 2 */}
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: TEAL.lightTeal }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Problems Tab */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('problems');
                  clearAllFilters();
                }}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                  activeTab === 'problems'
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={activeTab === 'problems' ? {
                  backgroundColor: ORANGE_GOLD.amber,
                  boxShadow: `0 4px 6px -1px ${ORANGE_GOLD.amber}50`
                } : undefined}
              >
                <span className="flex items-center gap-2">
                  ⚠️ Problems
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{
                    backgroundColor: activeTab === 'problems' ? ORANGE_GOLD.darkBrown : ORANGE_GOLD.paleGold,
                    color: activeTab === 'problems' ? 'white' : ORANGE_GOLD.darkBrown
                  }}>
                    {problems.length}
                  </span>
                </span>
              </button>
            </div>

            {/* Arrow 3 */}
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: ORANGE_GOLD.amber }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>

            {/* Projects Tab */}
            <div className="relative group">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  clearAllFilters();
                }}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all relative ${
                  activeTab === 'projects'
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={activeTab === 'projects' ? {
                  backgroundColor: PRIMARY.gold,
                  boxShadow: `0 4px 6px -1px ${PRIMARY.gold}50`
                } : undefined}
              >
                <span className="flex items-center gap-2">
                  🚀 Projects
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{
                    backgroundColor: activeTab === 'projects' ? ORANGE_GOLD.bronze : ORANGE_GOLD.paleGold,
                    color: activeTab === 'projects' ? 'white' : ORANGE_GOLD.darkBrown
                  }}>
                    {projects.filter(p => p.addressedProblems && p.addressedProblems.length > 0).length}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

          {/* Search Bar with Results Counter */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                  style={{
                    ['--tw-ring-color' as any]: activeTab === 'worldviews' ? TEAL.teal :
                                                  activeTab === 'outcomes' ? TEAL.lightTeal :
                                                  activeTab === 'problems' ? ORANGE_GOLD.amber :
                                                  PRIMARY.gold
                  }}
                  onFocus={(e) => {
                    const borderColor = activeTab === 'worldviews' ? TEAL.teal :
                                       activeTab === 'outcomes' ? TEAL.lightTeal :
                                       activeTab === 'problems' ? ORANGE_GOLD.amber :
                                       PRIMARY.gold;
                    e.target.style.borderColor = borderColor;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgb(51, 65, 85)'; // slate-700
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Results Counter */}
              <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-4">
                <span className="text-gray-600 text-sm font-medium">Showing</span>
                <span className="text-2xl font-bold" style={{
                  color: activeTab === 'worldviews' ? TEAL.teal :
                         activeTab === 'outcomes' ? TEAL.lightTeal :
                         activeTab === 'problems' ? ORANGE_GOLD.amber :
                         PRIMARY.gold
                }}>
                  {activeTab === 'worldviews' ? filteredWorldviews.length :
                   activeTab === 'outcomes' ? filteredOutcomes.length :
                   activeTab === 'problems' ? filteredProblems.length :
                   filteredProjects.length}
                </span>
                <span className="text-gray-600 text-sm">
                  of {activeTab === 'worldviews' ? worldviews.length :
                      activeTab === 'outcomes' ? outcomes.length :
                      activeTab === 'problems' ? problems.length :
                      projects.length}
                </span>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                  showFilters
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
                style={showFilters ? {
                  backgroundColor: activeTab === 'worldviews' ? TEAL.teal :
                                   activeTab === 'outcomes' ? TEAL.lightTeal :
                                   activeTab === 'problems' ? ORANGE_GOLD.amber :
                                   PRIMARY.gold,
                  borderColor: activeTab === 'worldviews' ? TEAL.lightTeal :
                               activeTab === 'outcomes' ? TEAL.mediumTeal :
                               activeTab === 'problems' ? ORANGE_GOLD.lightGold :
                               ORANGE_GOLD.gold
                } : {
                  ['--hover-border' as any]: activeTab === 'worldviews' ? TEAL.teal :
                                              activeTab === 'outcomes' ? TEAL.lightTeal :
                                              activeTab === 'problems' ? ORANGE_GOLD.amber :
                                              PRIMARY.gold
                }}
                onMouseEnter={(e) => {
                  if (!showFilters) {
                    const borderColor = activeTab === 'worldviews' ? TEAL.teal :
                                       activeTab === 'outcomes' ? TEAL.lightTeal :
                                       activeTab === 'problems' ? ORANGE_GOLD.amber :
                                       PRIMARY.gold;
                    e.currentTarget.style.borderColor = borderColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showFilters) {
                    e.currentTarget.style.borderColor = 'rgb(51, 65, 85)'; // slate-700
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: ORANGE_GOLD.brightOrange }}>
                    {activeFiltersCount}
                  </span>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Propose New Button */}
              <a
                href={
                  activeTab === 'worldviews' ? getProposeWorldviewUrl() :
                  activeTab === 'outcomes' ? getProposeOutcomeUrl() :
                  activeTab === 'problems' ? getProposeeProblemUrl() :
                  getSubmitProjectUrl()
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-400 hover:from-teal-600 hover:to-cyan-600 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {activeTab === 'projects' ? 'Submit New' : 'Propose New'}
              </a>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-600">Active Filters:</span>

                {/* Search Term Chip */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: activeTab === 'worldviews' ? `${TEAL.teal}33` :
                                      activeTab === 'outcomes' ? `${TEAL.lightTeal}33` :
                                      activeTab === 'problems' ? `${ORANGE_GOLD.amber}33` :
                                      `${PRIMARY.gold}33`,
                      color: activeTab === 'worldviews' ? TEAL.lightTeal :
                            activeTab === 'outcomes' ? TEAL.lightTeal :
                            activeTab === 'problems' ? ORANGE_GOLD.lightGold :
                            ORANGE_GOLD.lightGold,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: activeTab === 'worldviews' ? `${TEAL.teal}4D` :
                                   activeTab === 'outcomes' ? `${TEAL.lightTeal}4D` :
                                   activeTab === 'problems' ? `${ORANGE_GOLD.amber}4D` :
                                   `${PRIMARY.gold}4D`
                    }}
                    onMouseEnter={(e) => {
                      const bgColor = activeTab === 'worldviews' ? `${TEAL.teal}4D` :
                                     activeTab === 'outcomes' ? `${TEAL.lightTeal}4D` :
                                     activeTab === 'problems' ? `${ORANGE_GOLD.amber}4D` :
                                     `${PRIMARY.gold}4D`;
                      e.currentTarget.style.backgroundColor = bgColor;
                    }}
                    onMouseLeave={(e) => {
                      const bgColor = activeTab === 'worldviews' ? `${TEAL.teal}33` :
                                     activeTab === 'outcomes' ? `${TEAL.lightTeal}33` :
                                     activeTab === 'problems' ? `${ORANGE_GOLD.amber}33` :
                                     `${PRIMARY.gold}33`;
                      e.currentTarget.style.backgroundColor = bgColor;
                    }}
                  >
                    <span>Search: "{searchTerm}"</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Worldviews Filters */}
                {activeTab === 'worldviews' && (
                  <>
                    {selectedCluster && (
                      <button
                        onClick={() => setSelectedCluster(null)}
                        className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors flex items-center gap-2 border border-teal-200"
                      >
                        <span>Cluster: {selectedCluster}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {selectedOutcomeForWV && (
                      <button
                        onClick={() => setSelectedOutcomeForWV(null)}
                        className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors flex items-center gap-2 border border-teal-200"
                      >
                        <span>Outcome: {outcomes.find(o => o.id === selectedOutcomeForWV)?.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Outcomes Filters */}
                {activeTab === 'outcomes' && (
                  <>
                    {selectedWorldviewForOutcome && (
                      <button
                        onClick={() => {
                          setSelectedWorldviewForOutcome(null);
                          setRelevanceFilter(null);
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${TEAL.lightTeal}33`,
                          color: TEAL.lightTeal,
                          borderColor: `${TEAL.lightTeal}4D`
                        }}
                      >
                        <span>Worldview: {worldviews.find(w => w.id === selectedWorldviewForOutcome)?.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {relevanceFilter && (
                      <button
                        onClick={() => setRelevanceFilter(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${TEAL.lightTeal}33`,
                          color: TEAL.lightTeal,
                          borderColor: `${TEAL.lightTeal}4D`
                        }}
                      >
                        <span>Relevance: {relevanceFilter}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Problems Filters */}
                {activeTab === 'problems' && (
                  <>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${ORANGE_GOLD.amber}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${ORANGE_GOLD.amber}4D`
                        }}
                      >
                        <span>Category: {problemCategories.find(c => c.id === selectedCategory)?.problemCategoryName}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {selectedOutcomeForProblem && (
                      <button
                        onClick={() => setSelectedOutcomeForProblem(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${ORANGE_GOLD.amber}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${ORANGE_GOLD.amber}4D`
                        }}
                      >
                        <span>Outcome: {outcomes.find(o => o.id === selectedOutcomeForProblem)?.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {projectCoverage && (
                      <button
                        onClick={() => setProjectCoverage(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${ORANGE_GOLD.amber}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${ORANGE_GOLD.amber}4D`
                        }}
                      >
                        <span>Coverage: {projectCoverage === 'has-projects' ? 'Has Projects' : projectCoverage === 'no-projects' ? 'No Projects (Gap)' : '2+ Projects'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Projects Filters */}
                {activeTab === 'projects' && (
                  <>
                    {selectedProblemForProject && (
                      <button
                        onClick={() => setSelectedProblemForProject(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${PRIMARY.gold}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${PRIMARY.gold}4D`
                        }}
                      >
                        <span>Problem: {problems.find(p => p.id === selectedProblemForProject)?.name.substring(0, 30)}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {selectedOutcomeForProject && (
                      <button
                        onClick={() => setSelectedOutcomeForProject(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${PRIMARY.gold}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${PRIMARY.gold}4D`
                        }}
                      >
                        <span>Outcome: {outcomes.find(o => o.id === selectedOutcomeForProject)?.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {selectedWorldviewForProject && (
                      <button
                        onClick={() => setSelectedWorldviewForProject(null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2 border"
                        style={{
                          backgroundColor: `${PRIMARY.gold}33`,
                          color: ORANGE_GOLD.lightGold,
                          borderColor: `${PRIMARY.gold}4D`
                        }}
                      >
                        <span>Worldview: {worldviews.find(w => w.id === selectedWorldviewForProject)?.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Clear All Button */}
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
                >
                  <span>Clear All</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Filter Presets and View Mode Toggle */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            {/* Filter Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-600 mr-2">Quick Filters:</span>

              {/* Problems Tab Presets */}
              {activeTab === 'problems' && (
                <>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setProjectCoverage('no-projects');
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors border"
                    style={{
                      backgroundColor: `${ORANGE_GOLD.amber}33`,
                      color: ORANGE_GOLD.lightGold,
                      borderColor: `${ORANGE_GOLD.amber}4D`
                    }}
                  >
                    🚨 Show Gaps
                  </button>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setProjectCoverage('has-projects');
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border"
                    style={{
                      backgroundColor: `${PRIMARY.gold}33`,
                      color: ORANGE_GOLD.lightGold,
                      borderColor: `${PRIMARY.gold}4D`
                    }}
                  >
                    ✅ Being Addressed
                  </button>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setProjectCoverage('multiple-projects');
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    🔥 High Coverage
                  </button>
                </>
              )}

              {/* Outcomes Tab Presets */}
              {activeTab === 'outcomes' && (
                <>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      // Show outcomes with most problems
                      setOutcomeSort('problems-desc');
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors border"
                    style={{
                      backgroundColor: `${TEAL.lightTeal}33`,
                      color: TEAL.lightTeal,
                      borderColor: `${TEAL.lightTeal}4D`
                    }}
                  >
                    🎯 Most Blocked
                  </button>
                </>
              )}

              {/* Worldviews Tab Presets */}
              {activeTab === 'worldviews' && clusters.length > 0 && (
                <>
                  {clusters.slice(0, 3).map(cluster => (
                    <button
                      key={cluster}
                      onClick={() => {
                        clearAllFilters();
                        setSelectedCluster(cluster);
                      }}
                      className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors border border-teal-200"
                    >
                      {cluster}
                    </button>
                  ))}
                </>
              )}

              {/* Projects Tab Presets */}
              {activeTab === 'projects' && (
                <>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setProjectSort('alphabetical-az');
                    }}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
                  >
                    🚀 All Projects
                  </button>
                </>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
                title="Compact View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <div className={`mb-6 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              {/* Worldviews Filters */}
              {activeTab === 'worldviews' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Cluster</label>
                    <select
                      value={selectedCluster || ''}
                      onChange={(e) => setSelectedCluster(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-teal-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Clusters</option>
                      {clusters.map((cluster) => (
                        <option key={cluster} value={cluster}>{cluster}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Relevant to Outcome</label>
                    <select
                      value={selectedOutcomeForWV || ''}
                      onChange={(e) => setSelectedOutcomeForWV(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-teal-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Outcomes</option>
                      {outcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.id}>{outcome.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      disabled={activeFiltersCount === 0}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Outcomes Filters */}
              {activeTab === 'outcomes' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Worldview</label>
                    <select
                      value={selectedWorldviewForOutcome || ''}
                      onChange={(e) => setSelectedWorldviewForOutcome(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-teal-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Worldviews</option>
                      {worldviews.map((wv) => (
                        <option key={wv.id} value={wv.id}>{wv.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Relevance Level</label>
                    <select
                      value={relevanceFilter || ''}
                      onChange={(e) => setRelevanceFilter(e.target.value || null)}
                      disabled={!selectedWorldviewForOutcome}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">Any Relevance</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      disabled={activeFiltersCount === 0}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Problems Filters */}
              {activeTab === 'problems' && (
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Category</label>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Categories</option>
                      {problemCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.problemCategoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Affects Outcome</label>
                    <select
                      value={selectedOutcomeForProblem || ''}
                      onChange={(e) => setSelectedOutcomeForProblem(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Outcomes</option>
                      {outcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.id}>{outcome.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Project Coverage</label>
                    <select
                      value={projectCoverage || ''}
                      onChange={(e) => setProjectCoverage(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">Any Coverage</option>
                      <option value="has-projects">Has Projects</option>
                      <option value="no-projects">No Projects (Gap)</option>
                      <option value="multiple-projects">2+ Projects</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      disabled={activeFiltersCount === 0}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Filters */}
              {activeTab === 'projects' && (
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Addresses Problem</label>
                    <select
                      value={selectedProblemForProject || ''}
                      onChange={(e) => setSelectedProblemForProject(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-600 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Problems</option>
                      {problems.map((prob) => (
                        <option key={prob.id} value={prob.id}>{prob.name.substring(0, 50)}{prob.name.length > 50 ? '...' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Contributes to Outcome</label>
                    <select
                      value={selectedOutcomeForProject || ''}
                      onChange={(e) => setSelectedOutcomeForProject(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-600 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Outcomes</option>
                      {outcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.id}>{outcome.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Aligns with Worldview</label>
                    <select
                      value={selectedWorldviewForProject || ''}
                      onChange={(e) => setSelectedWorldviewForProject(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-yellow-600 transition-colors"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border,
                        color: PRIMARY.deepBrown
                      }}
                    >
                      <option value="">All Worldviews</option>
                      {worldviews.map((wv) => (
                        <option key={wv.id} value={wv.id}>{wv.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      disabled={activeFiltersCount === 0}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count and Sort */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-600">
              <span className="text-gray-900 font-bold text-xl">{currentItems.length}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> {activeTab}
            </p>

            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm font-medium">Sort by:</label>

              {/* Worldviews Sort */}
              {activeTab === 'worldviews' && (
                <select
                  value={worldviewSort}
                  onChange={(e) => setWorldviewSort(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="alphabetical-az">Alphabetical (A-Z)</option>
                  <option value="alphabetical-za">Alphabetical (Z-A)</option>
                  <option value="cluster">By Cluster</option>
                </select>
              )}

              {/* Outcomes Sort */}
              {activeTab === 'outcomes' && (
                <select
                  value={outcomeSort}
                  onChange={(e) => setOutcomeSort(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="outcome-id">By Outcome ID</option>
                  <option value="alphabetical-az">Alphabetical (A-Z)</option>
                  <option value="problems-desc">Most Problems First</option>
                </select>
              )}

              {/* Problems Sort */}
              {activeTab === 'problems' && (
                <select
                  value={problemSort}
                  onChange={(e) => setProblemSort(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="problem-id">By Problem ID</option>
                  <option value="alphabetical-az">Alphabetical (A-Z)</option>
                  <option value="category">By Category</option>
                  <option value="projects-desc">Most Projects First</option>
                </select>
              )}

              {/* Projects Sort */}
              {activeTab === 'projects' && (
                <select
                  value={projectSort}
                  onChange={(e) => setProjectSort(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                >
                  <option value="alphabetical-az">Alphabetical (A-Z)</option>
                  <option value="alphabetical-za">Alphabetical (Z-A)</option>
                  <option value="status">By Status</option>
                </select>
              )}
            </div>
          </div>

          {/* Content Grid */}
          {currentItems.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 border-2 border-gray-200 border-dashed">
              <div className="max-w-2xl mx-auto">
                {/* Animated Icon */}
                <div className="relative mb-6">
                  <svg className="w-20 h-20 text-gray-400 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-teal-200 rounded-full blur-xl animate-pulse"></div>
                </div>

                {/* Context-Aware Messages */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeFiltersCount > 0 ? `No ${activeTab} match your filters` : `Start exploring ${activeTab}!`}
                </h3>

                {/* Helpful suggestions based on context */}
                <div className="text-center mb-6">
                  {activeTab === 'problems' && projectCoverage === 'no-projects' ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                      <p className="text-orange-700 font-medium mb-2">🎯 Looking for gaps to fill?</p>
                      <p className="text-gray-700 text-sm">
                        Great! This means all problems in this category have active projects. Try exploring other categories or outcomes to find opportunities.
                      </p>
                    </div>
                  ) : activeFiltersCount > 0 ? (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                      <p className="text-teal-700 font-medium mb-2">💡 Try these suggestions:</p>
                      <ul className="text-gray-700 text-sm space-y-2 text-left max-w-md mx-auto">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Remove some filters to broaden your search</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Try different filter combinations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Check your search terms for typos</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                      <p className="text-teal-700 font-medium mb-2">🌟 Quick tips:</p>
                      <ul className="text-gray-700 text-sm space-y-2 text-left max-w-md mx-auto">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Use the search bar to find specific {activeTab}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Click filters above to narrow down results</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-400 mt-0.5">→</span>
                          <span>Try the quick filter buttons for common views</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-teal-500/30"
                    >
                      ✨ Clear All Filters
                    </button>
                  )}

                  {activeTab === 'problems' && (
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setProjectCoverage('no-projects');
                      }}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
                    >
                      🔍 Find Gaps
                    </button>
                  )}

                  {activeTab === 'outcomes' && (
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setOutcomeSort('problems-desc');
                      }}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-teal-500/30"
                    >
                      📊 Most Blocked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={`
              transition-all duration-300 ease-in-out
              ${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
              ${viewMode === 'list' ? 'space-y-4' : ''}
              ${viewMode === 'compact' ? 'space-y-2' : ''}
            `}>
              {/* Render based on active tab */}
              {activeTab === 'worldviews' && filteredWorldviews.map((worldview, index) => {
                const relevantOutcomesCount = outcomes.filter(o =>
                  o.worldviewRelevance[worldview.id] === 'High' || o.worldviewRelevance[worldview.id] === 'Medium'
                ).length;

                // Grid View
                if (viewMode === 'grid') {
                  return (
                    <button
                      key={worldview.id}
                      onClick={() => setSelectedWorldview(worldview)}
                      className="bg-white rounded-xl p-6 border-l-4 border-r border-t border-b border-gray-200 hover:border-teal-500 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-teal-500/10 text-left group relative overflow-hidden animate-fadeIn"
                      style={{
                        borderLeftColor: worldview.color || '#6B7280',
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
                          style={{ backgroundColor: worldview.color || '#6B7280' }}
                        >
                          {(worldview.shortName || worldview.name || 'WV').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors leading-tight">
                            {worldview.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="relative group/cluster">
                              <span
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium cursor-help"
                                title={worldview.clusterDefinition || worldview.cluster}
                              >
                                {worldview.cluster}
                              </span>
                              {worldview.clusterDefinition && (
                                <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white border border-teal-500 rounded-lg shadow-xl opacity-0 group-hover/cluster:opacity-100 pointer-events-none transition-opacity z-10">
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {worldview.clusterDefinition}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tagline */}
                      {worldview.tagline && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2 italic font-medium">
                          "{worldview.tagline}"
                        </p>
                      )}

                      {/* Description */}
                      {worldview.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-4 leading-relaxed">
                          {worldview.description}
                        </p>
                      )}

                      {/* Hover Action */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Click for full details</span>
                        <div className="flex items-center gap-2 text-teal-400 text-sm font-bold group-hover:gap-3 transition-all">
                          <span>View More</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                }

                // List View
                if (viewMode === 'list') {
                  return (
                    <button
                      key={worldview.id}
                      onClick={() => setSelectedWorldview(worldview)}
                      className="w-full bg-white rounded-lg p-5 border border-gray-200 hover:border-teal-500 transition-all text-left group flex items-center gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: worldview.color || '#6B7280' }}
                      >
                        {(worldview.shortName || worldview.name || 'WV').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                          {worldview.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-1">{worldview.tagline}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="relative group/cluster">
                          <span
                            className="cursor-help"
                            title={worldview.clusterDefinition || worldview.cluster}
                          >
                            {worldview.cluster}
                          </span>
                          {worldview.clusterDefinition && (
                            <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white border border-teal-500 rounded-lg shadow-xl opacity-0 group-hover/cluster:opacity-100 pointer-events-none transition-opacity z-10">
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {worldview.clusterDefinition}
                              </p>
                            </div>
                          )}
                        </div>
                        <span>{relevantOutcomesCount} outcomes</span>
                      </div>
                    </button>
                  );
                }

                // Compact View
                return (
                  <button
                    key={worldview.id}
                    onClick={() => setSelectedWorldview(worldview)}
                    className="w-full bg-white rounded-lg px-4 py-3 border border-gray-200 hover:border-teal-500 transition-all text-left group flex items-center gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: worldview.color || '#6B7280' }}
                    >
                      {(worldview.shortName || worldview.name || 'WV').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                        {worldview.name}
                      </h3>
                    </div>
                    <div className="relative group/cluster">
                      <span
                        className="text-xs text-gray-500 cursor-help"
                        title={worldview.clusterDefinition || worldview.cluster}
                      >
                        {worldview.cluster}
                      </span>
                      {worldview.clusterDefinition && (
                        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white border border-teal-500 rounded-lg shadow-xl opacity-0 group-hover/cluster:opacity-100 pointer-events-none transition-opacity z-10">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {worldview.clusterDefinition}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Outcomes rendering - simplified card design */}
              {activeTab === 'outcomes' && filteredOutcomes.map((outcome) => {
                const affectingProblemsCount = problems.filter(p => p.affectedOutcomes.includes(outcome.id)).length;

                if (viewMode === 'grid') {
                  return (
                    <button
                      key={outcome.id}
                      onClick={() => setSelectedOutcome(outcome)}
                      className="bg-white rounded-xl p-6 border-l-4 border-r border-t border-b border-gray-200 hover:border-teal-400 transition-all hover:shadow-2xl hover:shadow-teal-500/10 text-left group relative overflow-hidden"
                      style={{ borderLeftColor: '#A855F7' }}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                          🎯
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors leading-tight">
                            {outcome.name}
                          </h3>
                        </div>
                      </div>

                      {/* Short Description */}
                      {outcome.shortDescription && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-4 leading-relaxed">
                          {outcome.shortDescription}
                        </p>
                      )}

                      {/* Hover Action */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Click for full details</span>
                        <div className="flex items-center gap-2 text-teal-400 text-sm font-bold group-hover:gap-3 transition-all">
                          <span>View More</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                }

                // List and Compact views for outcomes (simplified for space)
                return (
                  <button
                    key={outcome.id}
                    onClick={() => setSelectedOutcome(outcome)}
                    className={`w-full bg-white rounded-lg border border-gray-200 hover:border-teal-400 transition-all text-left group flex items-center gap-4 ${
                      viewMode === 'list' ? 'p-5' : 'px-4 py-3'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className={`${viewMode === 'list' ? 'text-base' : 'text-sm'} font-bold text-gray-900 group-hover:text-teal-600 transition-colors ${viewMode === 'compact' ? 'truncate' : 'line-clamp-1'}`}>
                        {outcome.name}
                      </h3>
                      {viewMode === 'list' && outcome.shortDescription && (
                        <p className="text-gray-600 text-sm line-clamp-1 mt-1">{outcome.shortDescription}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{affectingProblemsCount} problems</span>
                  </button>
                );
              })}

              {/* Problems rendering */}
              {activeTab === 'problems' && filteredProblems.map((problem) => {
                const category = problemCategories.find(cat => cat.id === problem.category);
                const projectCount = projects.filter(proj => proj.addressedProblems?.includes(problem.id)).length;
                const affectedOutcomesList = outcomes.filter(o => problem.affectedOutcomes?.includes(o.id));
                const addressingProjects = projects.filter(proj => proj.addressedProblems?.includes(problem.id));

                if (viewMode === 'grid') {
                  return (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className="bg-white rounded-xl p-5 border-l-4 border-r border-t border-b border-gray-200 hover:border-orange-500 transition-all hover:shadow-2xl hover:shadow-orange-500/10 text-left group relative overflow-hidden"
                      style={{ borderLeftColor: '#F97316' }}
                    >
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                          {problem.name}
                        </h3>
                        {category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {category.problemCategoryName}
                          </span>
                        )}
                      </div>

                      {/* Affected Outcomes */}
                      {affectedOutcomesList.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-600 uppercase mb-2">Blocking Outcomes:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {affectedOutcomesList.map((outcome) => (
                              <span
                                key={outcome.id}
                                className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium"
                                title={outcome.name}
                              >
                                {outcome.name.length > 25 ? outcome.name.substring(0, 25) + '...' : outcome.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Footer with Divider */}
                      <div className="pt-4 mt-4 border-t border-gray-200/50">
                        <div className={`text-xs font-medium flex items-center gap-1.5 ${
                          projectCount > 0
                            ? 'text-yellow-500'
                            : 'text-orange-400'
                        }`}>
                          <span>
                            {projectCount > 0
                              ? `✅ Addressed • ${projectCount} project${projectCount > 1 ? 's' : ''}`
                              : `🚨 Not Addressed`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                }

                // List and Compact for problems
                return (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`w-full bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-all text-left group flex items-center gap-4 ${
                      viewMode === 'list' ? 'p-5' : 'px-4 py-3'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className={`${viewMode === 'list' ? 'text-base' : 'text-sm'} font-bold text-gray-900 group-hover:text-orange-600 transition-colors ${viewMode === 'compact' ? 'truncate' : 'line-clamp-1'}`}>
                        {problem.name}
                      </h3>
                      {viewMode === 'list' && category && (
                        <p className="text-gray-600 text-sm mt-1">{category.problemCategoryName}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${projectCount > 0 ? 'text-yellow-500' : 'text-orange-400'}`}>
                      {projectCount > 0 ? `${projectCount} projects` : 'Gap'}
                    </span>
                  </button>
                );
              })}

              {/* Projects rendering */}
              {activeTab === 'projects' && filteredProjects.map((project) => {
                const projectProblems = problems.filter(prob => project.addressedProblems?.includes(prob.id));
                const problemCategories = Array.from(new Set(projectProblems.map(p => problems.find(prob => prob.id === p.id)?.category).filter(Boolean)));

                if (viewMode === 'grid') {
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-xl p-6 border-l-4 border-r border-t border-b border-gray-200 hover:border-yellow-600 transition-all hover:shadow-2xl hover:shadow-yellow-600/10 text-left group relative overflow-hidden"
                      style={{ borderLeftColor: '#10B981' }}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold text-xl flex-shrink-0 shadow-lg">
                          🚀
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors leading-tight">
                            {project.name}
                          </h3>
                          {project.status && (
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              project.status === 'Active' || project.status === 'In Progress'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {project.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {project.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-4 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {/* Organizations */}
                      {project.organizations && project.organizations.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Leading Organizations:</p>
                              <div className="flex flex-wrap gap-1">
                                {project.organizations.map((orgName, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                                    {orgName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Problems Addressed */}
                      {projectProblems.length > 0 && (
                        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-orange-400 uppercase mb-2">
                                Addressing {projectProblems.length} Problem{projectProblems.length !== 1 ? 's' : ''}:
                              </p>
                              <div className="space-y-1">
                                {projectProblems.map((prob) => (
                                  <p key={prob.id} className="text-orange-700 text-xs line-clamp-1">
                                    • {prob.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Last Updated / Timeline */}
                      {project.lastUpdated && (
                        <div className="mb-4 flex items-center gap-2 text-gray-600 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Last Updated: {project.lastUpdated}</span>
                        </div>
                      )}

                      {/* Impact Summary */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Problems</p>
                          <p className="text-lg font-bold text-orange-400">{projectProblems.length}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Organizations</p>
                          <p className="text-lg font-bold text-teal-400">{project.organizations?.length || 0}</p>
                        </div>
                      </div>

                      {/* Hover Action */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Click for full details</span>
                        <div className="flex items-center gap-2 text-yellow-500 text-sm font-bold group-hover:gap-3 transition-all">
                          <span>View More</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                }

                // List and Compact for projects
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full bg-white rounded-lg border border-gray-200 hover:border-yellow-600 transition-all text-left group flex items-center gap-4 ${
                      viewMode === 'list' ? 'p-5' : 'px-4 py-3'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className={`${viewMode === 'list' ? 'text-base' : 'text-sm'} font-bold text-gray-900 group-hover:text-yellow-700 transition-colors ${viewMode === 'compact' ? 'truncate' : 'line-clamp-1'}`}>
                        {project.name}
                      </h3>
                      {viewMode === 'list' && project.description && (
                        <p className="text-gray-600 text-sm line-clamp-1 mt-1">{project.description}</p>
                      )}
                    </div>
                    {project.status && (
                      <span className={`text-xs font-medium flex-shrink-0 ${
                        project.status === 'Active' || project.status === 'In Progress'
                          ? 'text-yellow-500'
                          : 'text-blue-400'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modals */}
      {selectedWorldview && (
        <WorldviewDetailModal
          worldview={selectedWorldview}
          onClose={() => setSelectedWorldview(null)}
        />
      )}

      {selectedOutcome && (
        <OutcomeDetailModal
          outcome={selectedOutcome}
          worldviews={worldviews}
          problems={problems}
          onClose={() => setSelectedOutcome(null)}
          onProblemClick={(problem) => {
            setSelectedOutcome(null);
            setSelectedProblem(problem);
          }}
          onWorldviewClick={(worldview) => {
            setSelectedOutcome(null);
            setSelectedWorldview(worldview);
          }}
        />
      )}

      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          projects={projects}
          outcomes={outcomes}
          problemCategories={problemCategories}
          onClose={() => setSelectedProblem(null)}
          onProjectClick={(project) => {
            setSelectedProblem(null);
            setSelectedProject(project);
          }}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          problems={problems}
          organizations={organizations}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

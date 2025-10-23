'use client';

import { useState, useMemo } from 'react';
import type { AppProject, AppProblem, AppProblemCategory, AppWorldview } from '@/lib/data-transformer';

interface ProjectExplorerProps {
  projects: AppProject[];
  problems: AppProblem[];
  problemCategories: AppProblemCategory[];
  worldviews: AppWorldview[];
}

export default function ProjectExplorer({
  projects,
  problems,
  problemCategories,
  worldviews,
}: ProjectExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblemCategory, setSelectedProblemCategory] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [selectedWorldview, setSelectedWorldview] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Extract unique organizations from projects
  const organizations = useMemo(() => {
    const orgNames = new Set<string>();
    projects.forEach(p => {
      p.organizations?.forEach(org => orgNames.add(org));
    });
    return Array.from(orgNames).sort().map(name => ({ id: name, name }));
  }, [projects]);

  // Filter projects
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

    // Problem category filter
    if (selectedProblemCategory) {
      filtered = filtered.filter(p => {
        const projectProblems = problems.filter(prob =>
          p.addressedProblems?.includes(prob.id)
        );
        return projectProblems.some(prob =>
          prob.problemCategory?.includes(selectedProblemCategory)
        );
      });
    }

    // Problem filter
    if (selectedProblem) {
      filtered = filtered.filter(p =>
        p.addressedProblems?.includes(selectedProblem)
      );
    }

    // Organization filter
    if (selectedOrganization) {
      filtered = filtered.filter(p =>
        p.associatedOrganizations?.includes(selectedOrganization)
      );
    }

    return filtered;
  }, [projects, searchTerm, selectedProblemCategory, selectedProblem, selectedOrganization, problems]);

  // Get active filters count
  const activeFiltersCount =
    (selectedProblemCategory ? 1 : 0) +
    (selectedProblem ? 1 : 0) +
    (selectedWorldview ? 1 : 0) +
    (selectedOrganization ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedProblemCategory(null);
    setSelectedProblem(null);
    setSelectedWorldview(null);
    setSelectedOrganization(null);
    setSearchTerm('');
  };

  // Get filtered problems based on category
  const filteredProblemsForDropdown = selectedProblemCategory
    ? problems.filter(p => p.problemCategory?.includes(selectedProblemCategory))
    : problems;

  return (
    <section className="min-h-screen bg-slate-900 px-6 py-20">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Project Explorer
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover projects addressing specific problems across the psychedelic ecosystem
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl font-bold text-white flex items-center justify-between md:justify-start gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Problem Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Problem Category</label>
                  <select
                    value={selectedProblemCategory || ''}
                    onChange={(e) => {
                      setSelectedProblemCategory(e.target.value || null);
                      setSelectedProblem(null); // Reset problem when category changes
                    }}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {problemCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.problemCategoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Problem Filter */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Specific Problem</label>
                  <select
                    value={selectedProblem || ''}
                    onChange={(e) => setSelectedProblem(e.target.value || null)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    disabled={!selectedProblemCategory}
                  >
                    <option value="">All Problems</option>
                    {filteredProblemsForDropdown.map((prob) => (
                      <option key={prob.id} value={prob.id}>
                        {prob.problemId}: {prob.name.substring(0, 40)}{prob.name.length > 40 ? '...' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Organization Filter */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Organization</label>
                  <select
                    value={selectedOrganization || ''}
                    onChange={(e) => setSelectedOrganization(e.target.value || null)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">All Organizations</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    disabled={activeFiltersCount === 0 && !searchTerm}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-400">
            <span className="text-white font-bold text-xl">{filteredProjects.length}</span> project{filteredProjects.length === 1 ? '' : 's'} found
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => {
              const projectProblems = problems.filter(prob =>
                project.addressedProblems?.includes(prob.id)
              );

              // Project organizations are just the names in the array
              const projectOrgs = project.organizations || [];

              return (
                <div
                  key={project.id}
                  className="group bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all hover:shadow-xl hover:scale-105"
                >
                  {/* Project Name */}
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>

                  {/* Description */}
                  {project.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {/* Organizations */}
                  {projectOrgs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Organizations:</p>
                      <div className="flex flex-wrap gap-2">
                        {projectOrgs.slice(0, 2).map((orgName, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs font-medium"
                          >
                            {orgName}
                          </span>
                        ))}
                        {projectOrgs.length > 2 && (
                          <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-medium">
                            +{projectOrgs.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Problems Addressed */}
                  {projectProblems.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Addressing:</p>
                      <div className="flex flex-wrap gap-2">
                        {projectProblems.slice(0, 3).map((prob) => (
                          <span
                            key={prob.id}
                            className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium"
                            title={prob.name}
                          >
                            {prob.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  {project.status && (
                    <div className="mb-4">
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">
                        {project.status}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
                    <a
                      href={`/?project=${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-bold text-center transition-colors"
                    >
                      View in Map
                    </a>
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
                        title="Project Website"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find more projects
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

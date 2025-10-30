'use client';

import { useState, useMemo } from 'react';
import ProjectBubbleView from './ProjectBubbleView';
import ProjectGeographicView from './ProjectGeographicView';

interface Project {
  id: string;
  name: string;
  priorityArea?: string;
  typeOfProject?: string[];
  geographicLocation?: string[];
  status?: string;
  description?: string;
  website?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  activeView: 'grouped' | 'geographic' | 'directory';
  onProjectClick?: (projectId: string) => void;
  submitProjectUrl?: string;
}

export default function ProjectsSection({ projects, activeView, onProjectClick, submitProjectUrl }: ProjectsSectionProps) {
  const [groupBy, setGroupBy] = useState<'priorityArea' | 'typeOfProject' | 'geographicLocation' | 'status'>('priorityArea');
  const [filterType, setFilterType] = useState<string>('none');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get filter options based on selected filter type
  const filterOptions = useMemo(() => {
    const options = new Set<string>();

    switch (filterType) {
      case 'priorityArea':
        projects.forEach(project => {
          if (project.priorityArea) options.add(project.priorityArea);
        });
        break;
      case 'typeOfProject':
        projects.forEach(project => {
          project.typeOfProject?.forEach(type => options.add(type));
        });
        break;
      case 'geographicLocation':
        projects.forEach(project => {
          project.geographicLocation?.forEach(loc => options.add(loc));
        });
        break;
      case 'status':
        projects.forEach(project => {
          if (project.status) options.add(project.status);
        });
        break;
    }

    return Array.from(options).sort();
  }, [projects, filterType]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    if (filterType === 'none' || filterValue === 'all') {
      return projects;
    }

    return projects.filter(project => {
      switch (filterType) {
        case 'priorityArea':
          return project.priorityArea === filterValue;
        case 'typeOfProject':
          return project.typeOfProject?.includes(filterValue);
        case 'geographicLocation':
          return project.geographicLocation?.includes(filterValue);
        case 'status':
          return project.status === filterValue;
        default:
          return true;
      }
    });
  }, [projects, filterType, filterValue]);

  // Search filtered projects for directory view
  const searchFilteredProjects = useMemo(() => {
    return filteredProjects.filter(project => {
      if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filteredProjects, searchTerm]);

  return (
    <div className="px-8 py-8">
          {/* Grouped View */}
          {activeView === 'grouped' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-xl shadow-md border-2 border-[#E9D5B8] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Group By */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Group By
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <select
                          value={groupBy}
                          onChange={(e) => setGroupBy(e.target.value as any)}
                          className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                        >
                          <option value="priorityArea">Priority Area</option>
                          <option value="typeOfProject">Type of Project</option>
                          <option value="geographicLocation">Geographic Location</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter By (Type) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Filter By
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                        </div>
                        <select
                          value={filterType}
                          onChange={(e) => {
                            setFilterType(e.target.value);
                            setFilterValue('all');
                          }}
                          className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                        >
                          <option value="none">No Filter</option>
                          <option value="priorityArea">Priority Area</option>
                          <option value="typeOfProject">Type of Project</option>
                          <option value="geographicLocation">Geographic Location</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter Value */}
                    {filterType !== 'none' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Value
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                          >
                            <option value="all">All</option>
                            {filterOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-[#E9D5B8]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-semibold text-gray-900">
                        Showing <span className="font-bold text-[#007F6E]">{filteredProjects.length}</span> projects
                      </span>
                      {filterType !== 'none' && filterValue !== 'all' && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-[#E6543E] to-[#A33D2C] text-white text-sm font-bold rounded-full shadow-sm animate-fadeIn">
                          Filtered: {filterValue}
                        </span>
                      )}
                    </div>
                  </div>
              </div>

              {/* Bubble Visualization */}
              {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border-2 border-[#E9D5B8] p-12">
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#003B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      {filterType !== 'none' && filterValue !== 'all'
                        ? "No projects match your current filters. Try adjusting your search criteria."
                        : "No projects available to display. Be the first to add a project!"
                      }
                    </p>
                    {filterType !== 'none' && filterValue !== 'all' ? (
                      <button
                        onClick={() => {
                          setFilterType('none');
                          setFilterValue('all');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear All Filters
                      </button>
                    ) : submitProjectUrl ? (
                      <a
                        href={submitProjectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Submit Project
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <ProjectBubbleView
                  projects={filteredProjects}
                  groupBy={groupBy}
                  onProjectClick={onProjectClick}
                />
              )}
            </div>
          )}

          {/* Geographic View */}
          {activeView === 'geographic' && (
            projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border-2 border-[#E9D5B8] p-12">
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#003B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    No projects available to display. Be the first to add a project!
                  </p>
                  {submitProjectUrl && (
                    <a
                      href={submitProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Submit Project
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <ProjectGeographicView
                projects={filteredProjects}
                onProjectClick={onProjectClick}
              />
            )
          )}

          {/* Directory View */}
          {activeView === 'directory' && (
            <div className={isFullscreen ? "fixed inset-0 z-50 bg-[#F5EBDD] overflow-auto p-6 space-y-4" : "space-y-4"}>
              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-md border-2 border-[#E9D5B8] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search by name..."
                          className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Filter By
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                        </div>
                        <select
                          value={filterType}
                          onChange={(e) => {
                            setFilterType(e.target.value);
                            setFilterValue('all');
                          }}
                          className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                        >
                          <option value="none">No Filter</option>
                          <option value="priorityArea">Priority Area</option>
                          <option value="typeOfProject">Type of Project</option>
                          <option value="geographicLocation">Geographic Location</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>

                    {filterType !== 'none' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Value
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                          >
                            <option value="all">All</option>
                            {filterOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E9D5B8] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-gray-900">
                        Showing <span className="font-bold text-[#007F6E]">{searchFilteredProjects.length}</span> of <span className="font-bold text-[#007F6E]">{projects.length}</span> projects
                      </span>
                      {(searchTerm || filterType !== 'none') && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-[#E6543E] to-[#A33D2C] text-white text-sm font-bold rounded-full shadow-sm animate-fadeIn">
                          Filtered
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="px-4 py-2 bg-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#003B73]/50 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        {isFullscreen ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Exit Fullscreen
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Fullscreen
                          </>
                        )}
                      </button>
                      {(searchTerm || filterType !== 'none') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterType('none');
                            setFilterValue('all');
                          }}
                          className="px-4 py-2 bg-[#E6543E] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6543E]/50 transition-all hover:scale-105"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-[#E9D5B8] overflow-hidden">
                {searchFilteredProjects.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#003B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      {searchTerm || filterType !== 'none'
                        ? "No projects match your current filters. Try adjusting your search criteria."
                        : "No projects available to display. Be the first to add a project!"
                      }
                    </p>
                    {(searchTerm || filterType !== 'none') ? (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterType('none');
                          setFilterValue('all');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear All Filters
                      </button>
                    ) : submitProjectUrl ? (
                      <a
                        href={submitProjectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Submit Project
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Project Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Priority Area</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchFilteredProjects.map(project => (
                        <tr
                          key={project.id}
                          onClick={() => onProjectClick?.(project.id)}
                          className="hover:bg-[#F5EBDD] cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{project.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.priorityArea || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{project.typeOfProject?.join(', ') || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{project.geographicLocation?.join(', ') || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.status || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
          )}
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FocusTrap from 'focus-trap-react';
import CompositionView from '@/components/CompositionView';
import GeographicCompositionView from '@/components/GeographicCompositionView';
import SimpleBubbleView from '@/components/SimpleBubbleView';
import TableView from '@/components/TableView';
import OrgDetailPanel from '@/components/OrgDetailPanel';
import ProjectsSection from '@/components/ProjectsSection';
import ProjectDetailPanel from '@/components/ProjectDetailPanel';
import TermTooltip from '@/components/TermTooltip';
import ChangePathways from '@/components/TheoryOfChange/ChangePathways';
import FrameworkExplorer from '@/components/TheoryOfChange/FrameworkExplorer';
import type { AppWorldview, AppOutcome, AppProblem, AppProblemCategory, AppProject } from '@/lib/data-transformer';

// Top-level section types for combined navigation
type TopSection = 'story' | 'change-pathways' | 'framework-explorer' | 'ecosystem-map';

interface Organization {
  id: string;
  name: string;
  organizationType?: string[];
  entityType?: string;
  ecosystemRole?: string[];
  website?: string;
  city?: string;
  state?: string[];
  country?: string[];
  affiliatedPeople?: string[];
  orgToOrgAffiliations?: string[];
  verified?: boolean;
}

function ToolsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Top-level section state (new layer)
  const initialTopSection = (searchParams.get('section') as TopSection) || 'ecosystem-map';
  const [topSection, setTopSection] = useState<TopSection>(initialTopSection);

  // Original ecosystem map state (preserved exactly)
  const [activeSection, setActiveSection] = useState<'organizations' | 'projects'>('organizations');
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [orgView, setOrgView] = useState<'grouped' | 'geographic' | 'table'>('grouped');
  const [projectView, setProjectView] = useState<'grouped' | 'geographic' | 'directory'>('grouped');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Theory of Change data state
  const [tocData, setTocData] = useState<{
    worldviews: AppWorldview[];
    outcomes: AppOutcome[];
    problems: AppProblem[];
    problemCategories: AppProblemCategory[];
    projects: AppProject[];
  } | null>(null);
  const [tocLoading, setTocLoading] = useState(false);
  const [tocError, setTocError] = useState<string | null>(null);

  // Handle top-level section changes with URL update
  const handleTopSectionChange = (section: TopSection) => {
    setTopSection(section);
    router.push(`/tools?section=${section}`, { scroll: false });
  };

  // Airtable form URLs
  const SUBMIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7exiNQcO65VQvk/form'; // For submitting new organizations
  const SUBMIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form'; // For submitting new projects
  const EDIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7ssRGDlHJylwFr/form'; // For editing existing organizations
  const EDIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag6Qb3syeGlCDUni/form'; // For editing existing projects

  // Fetch ecosystem map data
  useEffect(() => {
    async function fetchData() {
      try {
        const [orgsResponse, projectsResponse] = await Promise.all([
          fetch('/api/organizations'),
          fetch('/api/projects')
        ]);

        if (!orgsResponse.ok) throw new Error('Failed to fetch organizations');
        if (!projectsResponse.ok) throw new Error('Failed to fetch projects');

        const [orgsData, projectsData] = await Promise.all([
          orgsResponse.json(),
          projectsResponse.json()
        ]);

        setOrganizations(orgsData);
        setProjects(projectsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Unable to load ecosystem data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch Theory of Change data when user navigates to change-pathways or framework-explorer
  useEffect(() => {
    if ((topSection === 'change-pathways' || topSection === 'framework-explorer') && !tocData && !tocLoading) {
      async function fetchTocData() {
        setTocLoading(true);
        try {
          const response = await fetch('/api/data');
          if (!response.ok) throw new Error('Failed to fetch Theory of Change data');

          const data = await response.json();
          setTocData(data);
          setTocError(null);
        } catch (error) {
          console.error('Error fetching Theory of Change data:', error);
          setTocError('Unable to load Theory of Change data. Please try again.');
        } finally {
          setTocLoading(false);
        }
      }

      fetchTocData();
    }
  }, [topSection, tocData, tocLoading]);

  // Handle Escape key for modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProjectId) {
          setSelectedProjectId(null);
        } else if (selectedOrgId) {
          setSelectedOrgId(null);
        }
      }
    };

    if (selectedOrgId || selectedProjectId) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedOrgId, selectedProjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="text-center">
          {/* Loading Animation */}
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B180A' }}>
            Loading Ecosystem Data
          </h3>
          <p className="text-base font-medium animate-pulse leading-relaxed" style={{ color: '#4A4643' }}>Discovering connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 px-4" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="w-24 h-24 mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: '#2B180A' }}>Something went wrong</h2>
        <p className="text-base max-w-md text-center font-normal leading-relaxed" style={{ color: '#4A4643' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      {/* Top-Level Navigation (New Layer) */}
      <div className="bg-white border-b" style={{ borderColor: '#E6DED0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleTopSectionChange('story')}
              className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${topSection === 'story' ? 'text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: topSection === 'story' ? '#4A7C7E' : undefined,
                color: topSection !== 'story' ? '#2B1810' : undefined,
                border: topSection !== 'story' ? '1px solid #E6DED0' : undefined
              }}
            >
              Story Mode
            </button>
            <button
              onClick={() => handleTopSectionChange('change-pathways')}
              className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${topSection === 'change-pathways' ? 'text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: topSection === 'change-pathways' ? '#4A7C7E' : undefined,
                color: topSection !== 'change-pathways' ? '#2B1810' : undefined,
                border: topSection !== 'change-pathways' ? '1px solid #E6DED0' : undefined
              }}
            >
              Change Pathways
            </button>
            <button
              onClick={() => handleTopSectionChange('framework-explorer')}
              className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${topSection === 'framework-explorer' ? 'text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: topSection === 'framework-explorer' ? '#4A7C7E' : undefined,
                color: topSection !== 'framework-explorer' ? '#2B1810' : undefined,
                border: topSection !== 'framework-explorer' ? '1px solid #E6DED0' : undefined
              }}
            >
              Framework Explorer
            </button>
            <button
              onClick={() => handleTopSectionChange('ecosystem-map')}
              className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${topSection === 'ecosystem-map' ? 'text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}
              style={{
                backgroundColor: topSection === 'ecosystem-map' ? '#4A7C7E' : undefined,
                color: topSection !== 'ecosystem-map' ? '#2B1810' : undefined,
                border: topSection !== 'ecosystem-map' ? '1px solid #E6DED0' : undefined
              }}
            >
              Ecosystem Map
            </button>
          </div>
        </div>
      </div>

      {/* ECOSYSTEM MAP SECTION (100% Original) */}
      {topSection === 'ecosystem-map' && (
        <>
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

          {/* Hero Header */}
          <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F7F0E8 0%, #FFFFFF 100%)' }}>
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 pb-0">
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 animate-slideUp" style={{ color: '#2B180A' }}>
              Psychedelic Ecosystem Map
            </h1>
            <div className="text-xs md:text-sm max-w-xl mx-auto mb-4 animate-slideUp font-normal leading-relaxed" style={{ color: '#4A4643', animationDelay: '0.1s', lineHeight: '1.5' }}>
              Explore the interconnected network of <span className="inline-flex items-center gap-1"><span>organizations</span><TermTooltip term="ecosystem-role" iconSize={14} /></span>, projects, and programs
              shaping the future of psychedelic research and therapy
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6" style={{ zoom: 0.85 }}>
          {/* Tab Container */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border-2" style={{ borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.15), 0 4px 6px -2px rgba(49, 126, 109, 0.05)' }}>
            {/* Tab Navigation */}
            <div className="flex border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
              <button
                onClick={() => {
                  setTransitionDirection('left');
                  setActiveSection('organizations');
                }}
                className={`
                  flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px]
                  hover:scale-105 active:scale-95
                  ${activeSection === 'organizations'
                    ? 'bg-white border-b-4 animate-bounce-once'
                    : 'hover:bg-white/50'
                  }
                `}
                style={{
                  transform: activeSection === 'organizations' ? 'translateY(0)' : undefined,
                  color: activeSection === 'organizations' ? '#317E6D' : '#2B180A99',
                  borderColor: activeSection === 'organizations' ? '#317E6D' : 'transparent'
                }}
                aria-label={`Organizations section. ${organizations.length} organizations.`}
                aria-current={activeSection === 'organizations' ? 'page' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Organizations ({organizations.length})
              </button>

              <button
                onClick={() => {
                  setTransitionDirection('right');
                  setActiveSection('projects');
                }}
                className={`
                  flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px]
                  hover:scale-105 active:scale-95
                  ${activeSection === 'projects'
                    ? 'bg-white border-b-4 animate-bounce-once'
                    : 'hover:bg-white/50'
                  }
                `}
                style={{
                  transform: activeSection === 'projects' ? 'translateY(0)' : undefined,
                  color: activeSection === 'projects' ? '#317E6D' : '#2B180A99',
                  borderColor: activeSection === 'projects' ? '#317E6D' : 'transparent'
                }}
                aria-label={`Projects section. ${projects.length} projects.`}
                aria-current={activeSection === 'projects' ? 'page' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Projects ({projects.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-10 min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
              {/* Organizations Section */}
              {activeSection === 'organizations' && (
                <div key="org-section" className={transitionDirection === 'left' ? 'animate-slideInFromLeft' : 'animate-slideInFromRight'}>
                  {/* Modern View Tabs with Decorative Top Bar */}
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 overflow-hidden mb-8" style={{ borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.1), 0 4px 6px -2px rgba(49, 126, 109, 0.05)' }}>
                    {/* Decorative Top Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

                    <div className="border-b" style={{ borderColor: '#E6C8A1' }}>
                      <div className="flex items-center justify-between px-6 py-3">
                        <nav className="flex space-x-2" aria-label="Views">
                          <button
                            onClick={() => setOrgView('grouped')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${orgView === 'grouped'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: orgView !== 'grouped' ? '#2B180A' : undefined }}
                            aria-label="Grouped view"
                            aria-current={orgView === 'grouped' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="6" cy="6" r="3" strokeWidth={2} />
                              <circle cx="18" cy="6" r="3" strokeWidth={2} />
                              <circle cx="6" cy="18" r="3" strokeWidth={2} />
                              <circle cx="18" cy="18" r="3" strokeWidth={2} />
                            </svg>
                            Grouped View
                          </button>

                          <button
                            onClick={() => setOrgView('geographic')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${orgView === 'geographic'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: orgView !== 'geographic' ? '#2B180A' : undefined }}
                            aria-label="Geographic view"
                            aria-current={orgView === 'geographic' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Geographic View
                          </button>

                          <button
                            onClick={() => setOrgView('table')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${orgView === 'table'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: orgView !== 'table' ? '#2B180A' : undefined }}
                            aria-label="Directory table view"
                            aria-current={orgView === 'table' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Directory
                          </button>
                        </nav>

                        {/* Submit Organization Button */}
                        <a
                          href={SUBMIT_ORG_FORM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          Submit Organization
                        </a>
                      </div>
                    </div>

                    {/* View Content */}
                    <div className="p-8 bg-white">
                      {orgView === 'grouped' && (
                        <SimpleBubbleView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                      {orgView === 'geographic' && (
                        <GeographicCompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                      {orgView === 'table' && (
                        <TableView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div key="projects-section" className={transitionDirection === 'right' ? 'animate-slideInFromRight' : 'animate-slideInFromLeft'}>
                  {/* Modern View Tabs with Decorative Top Bar */}
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 overflow-hidden mb-8" style={{ borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.1), 0 4px 6px -2px rgba(49, 126, 109, 0.05)' }}>
                    {/* Decorative Top Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

                    <div className="border-b" style={{ borderColor: '#E6C8A1' }}>
                      <div className="flex items-center justify-between px-6 py-3">
                        <nav className="flex space-x-2" aria-label="Views">
                          <button
                            onClick={() => setProjectView('grouped')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${projectView === 'grouped'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: projectView !== 'grouped' ? '#2B180A' : undefined }}
                            aria-label="Grouped view"
                            aria-current={projectView === 'grouped' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="6" cy="6" r="3" strokeWidth={2} />
                              <circle cx="18" cy="6" r="3" strokeWidth={2} />
                              <circle cx="6" cy="18" r="3" strokeWidth={2} />
                              <circle cx="18" cy="18" r="3" strokeWidth={2} />
                            </svg>
                            Grouped View
                          </button>

                          <button
                            onClick={() => setProjectView('geographic')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${projectView === 'geographic'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: projectView !== 'geographic' ? '#2B180A' : undefined }}
                            aria-label="Geographic view"
                            aria-current={projectView === 'geographic' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Geographic View
                          </button>

                          <button
                            onClick={() => setProjectView('directory')}
                            className={`
                              px-6 py-3 rounded-xl font-semibold text-sm min-h-[44px]
                              transition-all duration-300 flex items-center gap-2
                              ${projectView === 'directory'
                                ? 'bg-teal-500 text-white shadow-md'
                                : 'hover:bg-gray-50'
                              }
                            `}
                            style={{ color: projectView !== 'directory' ? '#2B180A' : undefined }}
                            aria-label="Directory table view"
                            aria-current={projectView === 'directory' ? 'page' : undefined}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Directory
                          </button>
                        </nav>

                        {/* Submit Project Button */}
                        <a
                          href={SUBMIT_PROJECT_FORM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          Submit Project
                        </a>
                      </div>
                    </div>

                    {/* View Content */}
                    <div className="p-8 bg-white">
                      <ProjectsSection projects={projects} activeView={projectView} onProjectClick={setSelectedProjectId} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Organization Detail Modal */}
      {selectedOrgId && (
        <FocusTrap>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="org-detail-title"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <OrgDetailPanel
                orgId={selectedOrgId}
                organizations={organizations}
                projects={projects}
                onClose={() => setSelectedOrgId(null)}
                onProjectClick={(projectId) => {
                  setSelectedOrgId(null);
                  setSelectedProjectId(projectId);
                }}
                editFormUrl={EDIT_ORG_FORM_URL}
              />
            </div>
          </div>
        </FocusTrap>
      )}

      {/* Project Detail Modal */}
      {selectedProjectId && (
        <FocusTrap>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProjectDetailPanel
                projectId={selectedProjectId}
                projects={projects}
                organizations={organizations}
                onClose={() => setSelectedProjectId(null)}
                onOrgClick={(orgId) => {
                  setSelectedProjectId(null);
                  setSelectedOrgId(orgId);
                }}
                editFormUrl={EDIT_PROJECT_FORM_URL}
              />
            </div>
          </div>
        </FocusTrap>
      )}

      {/* End of Ecosystem Map Section */}
      </>
      )}

      {/* OTHER SECTIONS (Placeholders) */}
      {topSection === 'story' && (
        <main className="flex-1 flex items-center justify-center p-16">
          <div className="bg-white rounded-3xl shadow-sm border p-16 text-center max-w-2xl" style={{ borderColor: '#E6DED0' }}>
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Story Mode</h2>
            <p className="text-base leading-relaxed" style={{ color: '#6B5B4F' }}>Coming Soon</p>
          </div>
        </main>
      )}

      {topSection === 'change-pathways' && (
        <>
          {tocLoading && (
            <main className="flex-1 flex items-center justify-center p-16">
              <div className="bg-white rounded-3xl shadow-sm border p-16 text-center max-w-2xl" style={{ borderColor: '#E6DED0' }}>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="text-base mt-4" style={{ color: '#6B5B4F' }}>Loading Change Pathways...</p>
              </div>
            </main>
          )}
          {tocError && (
            <main className="flex-1 flex items-center justify-center p-16">
              <div className="bg-white rounded-3xl shadow-sm border p-16 text-center max-w-2xl" style={{ borderColor: '#E6DED0' }}>
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Error</h2>
                <p className="text-base leading-relaxed" style={{ color: '#6B5B4F' }}>{tocError}</p>
                <button
                  onClick={() => {
                    setTocError(null);
                    setTocData(null);
                  }}
                  className="mt-4 px-6 py-2 rounded-full font-medium transition-colors"
                  style={{ backgroundColor: '#4A7C7E', color: 'white' }}
                >
                  Try Again
                </button>
              </div>
            </main>
          )}
          {!tocLoading && !tocError && tocData && (
            <ChangePathways
              worldviews={tocData.worldviews}
              outcomes={tocData.outcomes}
              problems={tocData.problems}
              problemCategories={tocData.problemCategories}
              projects={tocData.projects}
            />
          )}
        </>
      )}

      {topSection === 'framework-explorer' && (
        <>
          {tocLoading && (
            <main className="flex-1 flex items-center justify-center p-16">
              <div className="bg-white rounded-3xl shadow-sm border p-16 text-center max-w-2xl" style={{ borderColor: '#E6DED0' }}>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="text-base mt-4" style={{ color: '#6B5B4F' }}>Loading Framework Explorer...</p>
              </div>
            </main>
          )}
          {tocError && (
            <main className="flex-1 flex items-center justify-center p-16">
              <div className="bg-white rounded-3xl shadow-sm border p-16 text-center max-w-2xl" style={{ borderColor: '#E6DED0' }}>
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Error</h2>
                <p className="text-base leading-relaxed" style={{ color: '#6B5B4F' }}>{tocError}</p>
                <button
                  onClick={() => {
                    setTocError(null);
                    setTocData(null);
                  }}
                  className="mt-4 px-6 py-2 rounded-full font-medium transition-colors"
                  style={{ backgroundColor: '#4A7C7E', color: 'white' }}
                >
                  Try Again
                </button>
              </div>
            </main>
          )}
          {!tocLoading && !tocError && tocData && (
            <FrameworkExplorer
              worldviews={tocData.worldviews}
              outcomes={tocData.outcomes}
              problems={tocData.problems}
              problemCategories={tocData.problemCategories}
              projects={tocData.projects}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5EFE7' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  );
}

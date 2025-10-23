'use client';

/**
 * DRAFT: Combined Page Layout
 *
 * This file demonstrates how the Ecosystem Map and Theory of Change tools
 * would be integrated into a unified page using the CombinedNavigation component.
 *
 * This is a DRAFT for review purposes only - not yet integrated into the codebase.
 */

import { useState, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import OrgDetailPanel from '@/components/OrgDetailPanel';
import ProjectDetailPanel from '@/components/ProjectDetailPanel';

// Ecosystem Map components
import SimpleBubbleView from '@/components/SimpleBubbleView';
import CompositionView from '@/components/CompositionView';
import GeographicCompositionView from '@/components/GeographicCompositionView';
import TableView from '@/components/TableView';
import ProjectsSection from '@/components/ProjectsSection';

// TODO: Theory of Change components (to be created)
// import WorldviewsSection from '@/components/theory/WorldviewsSection';
// import OutcomesSection from '@/components/theory/OutcomesSection';
// import ProblemsSection from '@/components/theory/ProblemsSection';
// import TheoryProjectsSection from '@/components/theory/TheoryProjectsSection';

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

// Navigation types - Single level navigation
type Section = 'story' | 'change-pathways' | 'framework-explorer' | 'ecosystem-map';
type EcosystemView = 'grouped' | 'geographic' | 'table';

export default function CombinedPage() {
  // Navigation state - simplified to single level
  const [activeSection, setActiveSection] = useState<Section>('ecosystem-map');

  // View state for each section
  const [orgView, setOrgView] = useState<EcosystemView>('grouped');
  const [projectView, setProjectView] = useState<EcosystemView>('grouped');

  // Data state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Airtable form URLs
  const SUBMIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7exiNQcO65VQvk/form';
  const SUBMIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form';
  const EDIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7ssRGDlHJylwFr/form';
  const EDIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag6Qb3syeGlCDUni/form';

  // Fetch ecosystem data
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

  // Get context-aware submit button props
  const getSubmitButtonProps = () => {
    if (activeSection === 'ecosystem-map') {
      return {
        label: 'Contribute Your Project',
        url: SUBMIT_PROJECT_FORM_URL
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B180A' }}>
            Loading Ecosystem Data
          </h3>
          <p className="text-base font-medium animate-pulse leading-relaxed" style={{ color: '#4A4643' }}>
            Discovering connections...
          </p>
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

  const submitButtonProps = getSubmitButtonProps();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5EFE7' }}>
      {/* Single-Level Navigation Header */}
      <header className="relative overflow-hidden bg-white border-b" style={{ borderColor: '#E6DED0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Hero Title */}
          <div className="text-center pt-16 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#2B1810' }}>
              Theory of Change
            </h1>
            <p className="text-base md:text-lg max-w-3xl mx-auto font-normal leading-relaxed"
               style={{ color: '#6B5B4F' }}>
              Mapping the worldviews, outcomes, and projects shaping the psychedelic ecosystem
            </p>
          </div>

          {/* Single-Level Navigation - All Sections Visible */}
          <div className="flex justify-center gap-3 pb-8">
            <button
              onClick={() => setActiveSection('story')}
              className={`
                px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${activeSection === 'story'
                  ? 'text-white shadow-md'
                  : 'bg-white hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: activeSection === 'story' ? '#4A7C7E' : undefined,
                color: activeSection !== 'story' ? '#2B1810' : undefined,
                border: activeSection !== 'story' ? '1px solid #E6DED0' : undefined
              }}
              aria-current={activeSection === 'story' ? 'page' : undefined}
            >
              Story Mode
            </button>

            <button
              onClick={() => setActiveSection('change-pathways')}
              className={`
                px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${activeSection === 'change-pathways'
                  ? 'text-white shadow-md'
                  : 'bg-white hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: activeSection === 'change-pathways' ? '#4A7C7E' : undefined,
                color: activeSection !== 'change-pathways' ? '#2B1810' : undefined,
                border: activeSection !== 'change-pathways' ? '1px solid #E6DED0' : undefined
              }}
              aria-current={activeSection === 'change-pathways' ? 'page' : undefined}
            >
              Change Pathways
            </button>

            <button
              onClick={() => setActiveSection('framework-explorer')}
              className={`
                px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${activeSection === 'framework-explorer'
                  ? 'text-white shadow-md'
                  : 'bg-white hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: activeSection === 'framework-explorer' ? '#4A7C7E' : undefined,
                color: activeSection !== 'framework-explorer' ? '#2B1810' : undefined,
                border: activeSection !== 'framework-explorer' ? '1px solid #E6DED0' : undefined
              }}
              aria-current={activeSection === 'framework-explorer' ? 'page' : undefined}
            >
              Framework Explorer
            </button>

            <button
              onClick={() => setActiveSection('ecosystem-map')}
              className={`
                px-6 py-3 rounded-full font-medium text-base transition-all duration-200
                ${activeSection === 'ecosystem-map'
                  ? 'text-white shadow-md'
                  : 'bg-white hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: activeSection === 'ecosystem-map' ? '#4A7C7E' : undefined,
                color: activeSection !== 'ecosystem-map' ? '#2B1810' : undefined,
                border: activeSection !== 'ecosystem-map' ? '1px solid #E6DED0' : undefined
              }}
              aria-current={activeSection === 'ecosystem-map' ? 'page' : undefined}
            >
              Ecosystem Map
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ECOSYSTEM MAP CONTENT */}
          {activeSection === 'ecosystem-map' && (
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden" style={{ borderColor: '#E6DED0' }}>
              <div className="border-b" style={{ borderColor: '#E6DED0' }}>
                <div className="flex items-center justify-between px-8 py-5">
                  <nav className="flex gap-2">
                    <button
                      onClick={() => setOrgView('grouped')}
                      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                        ${orgView === 'grouped' ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                      style={{
                        backgroundColor: orgView === 'grouped' ? '#2B1810' : undefined,
                        color: orgView !== 'grouped' ? '#6B5B4F' : undefined,
                        border: orgView !== 'grouped' ? '1px solid #E6DED0' : undefined
                      }}
                    >
                      Visualize Connections
                    </button>
                    <button
                      onClick={() => setOrgView('geographic')}
                      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                        ${orgView === 'geographic' ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                      style={{
                        backgroundColor: orgView === 'geographic' ? '#2B1810' : undefined,
                        color: orgView !== 'geographic' ? '#6B5B4F' : undefined,
                        border: orgView !== 'geographic' ? '1px solid #E6DED0' : undefined
                      }}
                    >
                      Track Opportunities
                    </button>
                    <button
                      onClick={() => setOrgView('table')}
                      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                        ${orgView === 'table' ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                      style={{
                        backgroundColor: orgView === 'table' ? '#2B1810' : undefined,
                        color: orgView !== 'table' ? '#6B5B4F' : undefined,
                        border: orgView !== 'table' ? '1px solid #E6DED0' : undefined
                      }}
                    >
                      Directory
                    </button>
                  </nav>

                  {submitButtonProps && (
                    <a
                      href={submitButtonProps.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 text-white rounded-full font-medium text-sm transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                      style={{ backgroundColor: '#2B1810' }}
                    >
                      {submitButtonProps.label}
                    </a>
                  )}
                </div>
              </div>

              <div className="p-8 bg-white">
                {orgView === 'grouped' && <SimpleBubbleView organizations={organizations} onOrgClick={setSelectedOrgId} />}
                {orgView === 'geographic' && <GeographicCompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />}
                {orgView === 'table' && <TableView organizations={organizations} onOrgClick={setSelectedOrgId} />}
              </div>
            </div>
          )}

          {/* STORY MODE CONTENT */}
          {activeSection === 'story' && (
            <div className="bg-white rounded-3xl shadow-sm border p-16 text-center" style={{ borderColor: '#E6DED0' }}>
              <svg className="w-24 h-24 mx-auto mb-8" style={{ color: '#CC8D37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Story Mode</h3>
              <p className="text-base max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#6B5B4F' }}>
                Explore the narrative behind the psychedelic ecosystem - how different worldviews, challenges,
                and interventions connect to create meaningful change.
              </p>
              <div className="border rounded-2xl p-8 max-w-xl mx-auto" style={{ backgroundColor: '#FBF7F3', borderColor: '#E6DED0' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#2B1810' }}>Coming Soon</p>
                <p className="text-sm" style={{ color: '#6B5B4F' }}>
                  An interactive narrative experience guiding you through the theory of change
                </p>
              </div>
            </div>
          )}

          {/* CHANGE PATHWAYS CONTENT */}
          {activeSection === 'change-pathways' && (
            <div className="bg-white rounded-3xl shadow-sm border p-16 text-center" style={{ borderColor: '#E6DED0' }}>
              <svg className="w-24 h-24 mx-auto mb-8" style={{ color: '#CC8D37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Change Pathways</h3>
              <p className="text-base max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#6B5B4F' }}>
                Visualize the pathways from problems to outcomes - see how different interventions and projects
                create impact across the psychedelic ecosystem.
              </p>
              <div className="border rounded-2xl p-8 max-w-xl mx-auto" style={{ backgroundColor: '#FBF7F3', borderColor: '#E6DED0' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#2B1810' }}>Coming Soon</p>
                <p className="text-sm" style={{ color: '#6B5B4F' }}>
                  Interactive pathway mapping showing connections between problems, outcomes, and projects
                </p>
              </div>
            </div>
          )}

          {/* FRAMEWORK EXPLORER CONTENT */}
          {activeSection === 'framework-explorer' && (
            <div className="bg-white rounded-3xl shadow-sm border p-16 text-center" style={{ borderColor: '#E6DED0' }}>
              <svg className="w-24 h-24 mx-auto mb-8" style={{ color: '#CC8D37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-4xl font-bold mb-4" style={{ color: '#2B1810' }}>Framework Explorer</h3>
              <p className="text-base max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#6B5B4F' }}>
                Deep dive into the full theory of change framework - explore worldviews, outcomes, problems,
                and projects in detail with filtering and search capabilities.
              </p>
              <div className="border rounded-2xl p-8 max-w-xl mx-auto" style={{ backgroundColor: '#FBF7F3', borderColor: '#E6DED0' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#2B1810' }}>Coming Soon</p>
                <p className="text-sm" style={{ color: '#6B5B4F' }}>
                  Comprehensive framework browser with filtering, search, and detailed views
                </p>
              </div>
            </div>
          )}
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
    </div>
  );
}

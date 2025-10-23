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

// Navigation types
type Tool = 'ecosystem' | 'theory' | 'about';
type EcosystemSection = 'organizations' | 'projects' | 'programs';
type TheorySection = 'worldviews' | 'outcomes' | 'problems' | 'toc-projects';
type EcosystemView = 'grouped' | 'geographic' | 'table';

export default function CombinedPage() {
  // Navigation state
  const [activeTool, setActiveTool] = useState<Tool>('ecosystem');
  const [ecosystemSection, setEcosystemSection] = useState<EcosystemSection>('organizations');
  const [theorySection, setTheorySection] = useState<TheorySection>('worldviews');

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
    if (activeTool === 'ecosystem') {
      if (ecosystemSection === 'organizations') {
        return {
          label: 'Submit Organization',
          url: SUBMIT_ORG_FORM_URL
        };
      } else if (ecosystemSection === 'projects') {
        return {
          label: 'Submit Project',
          url: SUBMIT_PROJECT_FORM_URL
        };
      }
    } else if (activeTool === 'theory') {
      // TODO: Add Theory of Change submission forms
      return {
        label: 'Submit to Theory of Change',
        url: '#' // Placeholder
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      {/* Decorative Top Bar */}
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

      {/* Combined Navigation Header */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F7F0E8 0%, #FFFFFF 100%)' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 pb-0">

          {/* Hero Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-slideUp" style={{ color: '#2B180A' }}>
              Psychedelic Ecosystem Tools
            </h1>
            <p className="text-base md:text-xl max-w-3xl mx-auto mb-8 animate-slideUp font-normal leading-relaxed"
               style={{ color: '#4A4643', animationDelay: '0.1s', lineHeight: '1.6' }}>
              Explore organizations, projects, and our theory of change for the psychedelic ecosystem
            </p>
          </div>

          {/* Top-Level Tool Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTool('ecosystem')}
              className={`
                px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300
                flex items-center gap-3 shadow-lg hover:shadow-xl
                ${activeTool === 'ecosystem'
                  ? 'bg-teal-500 text-white scale-105'
                  : 'bg-white hover:bg-teal-50'
                }
              `}
              style={{
                color: activeTool !== 'ecosystem' ? '#2B180A' : undefined,
                borderWidth: '2px',
                borderColor: activeTool === 'ecosystem' ? '#317E6D' : '#E6C8A1'
              }}
              aria-current={activeTool === 'ecosystem' ? 'page' : undefined}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ecosystem Map
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: activeTool === 'ecosystem' ? 'rgba(255,255,255,0.2)' : '#F4CE99', color: activeTool === 'ecosystem' ? 'white' : '#2B180A' }}>
                {organizations.length} orgs, {projects.length} projects
              </span>
            </button>

            <button
              onClick={() => setActiveTool('theory')}
              className={`
                px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300
                flex items-center gap-3 shadow-lg hover:shadow-xl
                ${activeTool === 'theory'
                  ? 'bg-teal-500 text-white scale-105'
                  : 'bg-white hover:bg-teal-50'
                }
              `}
              style={{
                color: activeTool !== 'theory' ? '#2B180A' : undefined,
                borderWidth: '2px',
                borderColor: activeTool === 'theory' ? '#317E6D' : '#E6C8A1'
              }}
              aria-current={activeTool === 'theory' ? 'page' : undefined}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Theory of Change
            </button>

            <button
              onClick={() => setActiveTool('about')}
              className={`
                px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300
                flex items-center gap-3 shadow-lg hover:shadow-xl
                ${activeTool === 'about'
                  ? 'bg-teal-500 text-white scale-105'
                  : 'bg-white hover:bg-teal-50'
                }
              `}
              style={{
                color: activeTool !== 'about' ? '#2B180A' : undefined,
                borderWidth: '2px',
                borderColor: activeTool === 'about' ? '#317E6D' : '#E6C8A1'
              }}
              aria-current={activeTool === 'about' ? 'page' : undefined}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </button>
          </div>

          {/* Context-Aware Section Tabs */}
          {activeTool === 'ecosystem' && (
            <div className="flex justify-center gap-3 pb-6">
              <button
                onClick={() => setEcosystemSection('organizations')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${ecosystemSection === 'organizations'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: ecosystemSection === 'organizations' ? '#317E6D' : 'transparent' }}
                aria-current={ecosystemSection === 'organizations' ? 'page' : undefined}
              >
                Organizations ({organizations.length})
              </button>
              <button
                onClick={() => setEcosystemSection('projects')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${ecosystemSection === 'projects'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: ecosystemSection === 'projects' ? '#317E6D' : 'transparent' }}
                aria-current={ecosystemSection === 'projects' ? 'page' : undefined}
              >
                Projects ({projects.length})
              </button>
              <button
                onClick={() => setEcosystemSection('programs')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${ecosystemSection === 'programs'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: ecosystemSection === 'programs' ? '#317E6D' : 'transparent' }}
                aria-current={ecosystemSection === 'programs' ? 'page' : undefined}
              >
                Programs
              </button>
            </div>
          )}

          {activeTool === 'theory' && (
            <div className="flex justify-center gap-3 pb-6">
              <button
                onClick={() => setTheorySection('worldviews')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${theorySection === 'worldviews'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: theorySection === 'worldviews' ? '#317E6D' : 'transparent' }}
                aria-current={theorySection === 'worldviews' ? 'page' : undefined}
              >
                Worldviews
              </button>
              <button
                onClick={() => setTheorySection('outcomes')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${theorySection === 'outcomes'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: theorySection === 'outcomes' ? '#317E6D' : 'transparent' }}
                aria-current={theorySection === 'outcomes' ? 'page' : undefined}
              >
                Outcomes
              </button>
              <button
                onClick={() => setTheorySection('problems')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${theorySection === 'problems'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: theorySection === 'problems' ? '#317E6D' : 'transparent' }}
                aria-current={theorySection === 'problems' ? 'page' : undefined}
              >
                Problems
              </button>
              <button
                onClick={() => setTheorySection('toc-projects')}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  ${theorySection === 'toc-projects'
                    ? 'bg-white text-teal-600 shadow-md border-2'
                    : 'text-white hover:bg-white/20'
                  }
                `}
                style={{ borderColor: theorySection === 'toc-projects' ? '#317E6D' : 'transparent' }}
                aria-current={theorySection === 'toc-projects' ? 'page' : undefined}
              >
                Projects
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ECOSYSTEM MAP CONTENT */}
          {activeTool === 'ecosystem' && (
            <>
              {/* Organizations Section */}
              {ecosystemSection === 'organizations' && (
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 overflow-hidden"
                     style={{ borderColor: '#E6C8A1' }}>
                  <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

                  <div className="border-b" style={{ borderColor: '#E6C8A1' }}>
                    <div className="flex items-center justify-between px-6 py-3">
                      <nav className="flex space-x-2">
                        <button
                          onClick={() => setOrgView('grouped')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${orgView === 'grouped' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: orgView !== 'grouped' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="6" cy="6" r="3" strokeWidth={2} />
                            <circle cx="18" cy="6" r="3" strokeWidth={2} />
                            <circle cx="6" cy="18" r="3" strokeWidth={2} />
                            <circle cx="18" cy="18" r="3" strokeWidth={2} />
                          </svg>
                          Grouped View
                        </button>
                        <button
                          onClick={() => setOrgView('geographic')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${orgView === 'geographic' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: orgView !== 'geographic' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Geographic View
                        </button>
                        <button
                          onClick={() => setOrgView('table')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${orgView === 'table' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: orgView !== 'table' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Directory
                        </button>
                      </nav>

                      {submitButtonProps && (
                        <a
                          href={submitButtonProps.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
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

              {/* Projects Section */}
              {ecosystemSection === 'projects' && (
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 overflow-hidden"
                     style={{ borderColor: '#E6C8A1' }}>
                  <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

                  <div className="border-b" style={{ borderColor: '#E6C8A1' }}>
                    <div className="flex items-center justify-between px-6 py-3">
                      <nav className="flex space-x-2">
                        <button
                          onClick={() => setProjectView('grouped')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${projectView === 'grouped' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: projectView !== 'grouped' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="6" cy="6" r="3" strokeWidth={2} />
                            <circle cx="18" cy="6" r="3" strokeWidth={2} />
                            <circle cx="6" cy="18" r="3" strokeWidth={2} />
                            <circle cx="18" cy="18" r="3" strokeWidth={2} />
                          </svg>
                          Grouped View
                        </button>
                        <button
                          onClick={() => setProjectView('geographic')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${projectView === 'geographic' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: projectView !== 'geographic' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Geographic View
                        </button>
                        <button
                          onClick={() => setProjectView('table')}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
                            ${projectView === 'table' ? 'bg-teal-500 text-white shadow-md' : 'hover:bg-gray-50'}`}
                          style={{ color: projectView !== 'table' ? '#2B180A' : undefined }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Directory
                        </button>
                      </nav>

                      {submitButtonProps && (
                        <a
                          href={submitButtonProps.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          {submitButtonProps.label}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-8 bg-white">
                    <ProjectsSection projects={projects} activeView={projectView} onProjectClick={setSelectedProjectId} />
                  </div>
                </div>
              )}

              {/* Programs Section (Placeholder) */}
              {ecosystemSection === 'programs' && (
                <div className="bg-white rounded-2xl shadow-lg border-2 p-12 text-center" style={{ borderColor: '#E6C8A1' }}>
                  <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500 absolute top-0 left-0 right-0" />
                  <svg className="w-16 h-16 mx-auto mb-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#2B180A' }}>Programs Coming Soon</h3>
                  <p className="text-base max-w-md mx-auto" style={{ color: '#4A4643' }}>
                    This section will showcase psychedelic programs and initiatives across the ecosystem.
                  </p>
                </div>
              )}
            </>
          )}

          {/* THEORY OF CHANGE CONTENT */}
          {activeTool === 'theory' && (
            <div className="bg-white rounded-2xl shadow-lg border-2 p-12 text-center" style={{ borderColor: '#E6C8A1' }}>
              <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500 absolute top-0 left-0 right-0" />
              <svg className="w-20 h-20 mx-auto mb-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-3xl font-bold mb-4" style={{ color: '#2B180A' }}>Theory of Change</h3>
              <p className="text-lg mb-2" style={{ color: '#4A4643' }}>
                <strong>Active Section:</strong> {theorySection.charAt(0).toUpperCase() + theorySection.slice(1)}
              </p>
              <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: '#4A4643' }}>
                This section will contain the Theory of Change visualization showing how worldviews, outcomes,
                problems, and projects interconnect to drive change in the psychedelic ecosystem.
              </p>
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 max-w-xl mx-auto">
                <p className="text-sm font-semibold text-teal-800 mb-2">TODO: Create Theory of Change Components</p>
                <ul className="text-sm text-teal-700 text-left space-y-1">
                  <li>• WorldviewsSection.tsx</li>
                  <li>• OutcomesSection.tsx</li>
                  <li>• ProblemsSection.tsx</li>
                  <li>• TheoryProjectsSection.tsx</li>
                  <li>• Data models and API endpoints</li>
                </ul>
              </div>
            </div>
          )}

          {/* ABOUT CONTENT */}
          {activeTool === 'about' && (
            <div className="bg-white rounded-2xl shadow-lg border-2 p-12" style={{ borderColor: '#E6C8A1' }}>
              <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500 absolute top-0 left-0 right-0" />
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6" style={{ color: '#2B180A' }}>About These Tools</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{ color: '#317E6D' }}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ecosystem Map
                    </h3>
                    <p className="text-base leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                      Explore the interconnected network of organizations, projects, and programs shaping the future
                      of psychedelic research and therapy. Visualize the ecosystem through multiple lenses including
                      organizational roles, geographic distribution, and entity types.
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold">
                        {organizations.length} Organizations
                      </span>
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold">
                        {projects.length} Projects
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{ color: '#317E6D' }}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Theory of Change
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: '#4A4643' }}>
                      Understand the worldviews, outcomes, problems, and project interventions that drive meaningful
                      change in the psychedelic ecosystem. See how different perspectives and approaches interconnect
                      to create transformative impact.
                    </p>
                  </div>

                  <div className="border-t-2 pt-6" style={{ borderColor: '#E6C8A1' }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>Get Involved</h3>
                    <p className="text-base leading-relaxed mb-4" style={{ color: '#4A4643' }}>
                      Help us build a comprehensive map of the psychedelic ecosystem. Submit your organization,
                      project, or contribute to our theory of change framework.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={SUBMIT_ORG_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Submit Organization
                      </a>
                      <a
                        href={SUBMIT_PROJECT_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Submit Project
                      </a>
                    </div>
                  </div>
                </div>
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

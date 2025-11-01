'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FocusTrap from 'focus-trap-react';
import PSIHeader from '@/components/PSIHeader';
import ToolIntroductionV3 from '@/components/ToolIntroductionV3';
import InfoModal from '@/components/InfoModal';
import BetaWarningModal from '@/components/BetaWarningModal';
import GettingStarted from '@/components/modals/ecosystem-map/GettingStarted';
import ImportantInformation from '@/components/modals/ecosystem-map/ImportantInformation';
import HelpUsMakeAccurate from '@/components/modals/ecosystem-map/HelpUsMakeAccurate';
import FAQ from '@/components/modals/ecosystem-map/FAQ';
import SimpleBubbleView from '@/components/SimpleBubbleView';
import GeographicCompositionView from '@/components/GeographicCompositionView';
import TableView from '@/components/TableView';
import OrgDetailPanel from '@/components/OrgDetailPanel';
import ProjectsSection from '@/components/ProjectsSection';
import ProjectDetailPanel from '@/components/ProjectDetailPanel';
import TermTooltip from '@/components/TermTooltip';

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

function EcosystemMapContent() {
  const searchParams = useSearchParams();

  // Check if in embed mode - with null safety
  const isEmbedMode = searchParams?.get('embed') === 'true';
  const locationFilter = searchParams?.get('location') || undefined;
  const initialSection = (searchParams?.get('section') as 'organizations' | 'projects') || 'organizations';
  const initialOrgView = (searchParams?.get('view') as 'grouped' | 'geographic' | 'table') || 'grouped';
  const initialChartType = (searchParams?.get('chartType') as 'bubble' | 'bar') || 'bubble';
  const initialGroupBy = (searchParams?.get('groupBy') as 'ecosystemRole' | 'entityType' | 'organizationType' | 'state' | 'country') || 'ecosystemRole';
  const initialFilterType = searchParams?.get('filterType') || 'none';
  const initialFilterValue = searchParams?.get('filterValue') || 'all';

  const [activeSection, setActiveSection] = useState<'organizations' | 'projects'>(initialSection);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [orgView, setOrgView] = useState<'grouped' | 'geographic' | 'table'>(initialOrgView);
  const [projectView, setProjectView] = useState<'grouped' | 'geographic' | 'directory'>('grouped');

  // Chart visualization controls - if location filter is present, default to state filtering
  const [chartType, setChartType] = useState<'bubble' | 'bar'>(initialChartType);
  const [groupBy, setGroupBy] = useState<'ecosystemRole' | 'entityType' | 'organizationType' | 'state' | 'country'>(
    locationFilter ? 'state' : initialGroupBy
  );
  const [filterType, setFilterType] = useState<string>(
    locationFilter ? 'state' : initialFilterType
  );
  const [filterValue, setFilterValue] = useState<string>(
    locationFilter ? locationFilter.charAt(0).toUpperCase() + locationFilter.slice(1).toLowerCase() : initialFilterValue
  );

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Modal state
  const [showGettingStartedModal, setShowGettingStartedModal] = useState(false);
  const [showImportantInfoModal, setShowImportantInfoModal] = useState(false);
  const [showHelpUsModal, setShowHelpUsModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  // Airtable form URLs
  const SUBMIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7exiNQcO65VQvk/form';
  const SUBMIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form';
  const EDIT_ORG_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag7ssRGDlHJylwFr/form';
  const EDIT_PROJECT_FORM_URL = 'https://airtable.com/appQkt2yYzVKhRaXx/pag6Qb3syeGlCDUni/form';

  // Generate embed URL for current view
  const getEmbedUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://psychedelic-ecosystem-map.vercel.app';
    const params = new URLSearchParams();
    params.set('embed', 'true');
    params.set('section', activeSection);

    if (activeSection === 'organizations') {
      params.set('view', orgView);
      // Only add chartType, groupBy, and filters for grouped view (bubble/bar charts)
      if (orgView === 'grouped') {
        params.set('chartType', chartType);
        params.set('groupBy', groupBy);
        if (filterType !== 'none') {
          params.set('filterType', filterType);
          params.set('filterValue', filterValue);
        }
      }
    } else {
      params.set('view', projectView);
    }

    if (locationFilter) {
      params.set('location', locationFilter);
    }

    return `${baseUrl}/ecosystem-map?${params.toString()}`;
  };

  const getEmbedCode = () => {
    const url = getEmbedUrl();
    return `<iframe src="${url}" width="100%" height="600" style="border: none; border-radius: 8px;"></iframe>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

        let [orgsData, projectsData] = await Promise.all([
          orgsResponse.json(),
          projectsResponse.json()
        ]);

        // Apply location filter if specified
        if (locationFilter) {
          orgsData = orgsData.filter((org: Organization) =>
            org.state?.some(s => s.toLowerCase().includes(locationFilter.toLowerCase())) ||
            org.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            org.country?.some(c => c.toLowerCase().includes(locationFilter.toLowerCase()))
          );
          projectsData = projectsData.filter((proj: any) =>
            proj.geographicLocation?.some((loc: string) => loc.toLowerCase().includes(locationFilter.toLowerCase()))
          );
        }

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
  }, [locationFilter]);

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
      <div className="min-h-screen" style={{ backgroundColor: isEmbedMode ? 'transparent' : '#FBF3E7' }}>
        {!isEmbedMode && <PSIHeader />}
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-base font-medium" style={{ color: '#4A4643' }}>Loading Ecosystem Data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: isEmbedMode ? 'transparent' : '#FBF3E7' }}>
        {!isEmbedMode && <PSIHeader />}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4 px-4">
          <div className="w-24 h-24 mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#2B180A' }}>Something went wrong</h2>
          <p className="text-base max-w-md text-center" style={{ color: '#4A4643' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: isEmbedMode ? 'transparent' : '#FBF3E7' }}>
      {!isEmbedMode && <PSIHeader />}

      {!isEmbedMode && (
        <>
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

          {/* Introduction Section */}
          <ToolIntroductionV3
            title="Psychedelic Ecosystem Map"
            subtitle="Discover Who's Working in the Psychedelic Ecosystem"
            calloutText="764 organizations mapped and growing. This tool helps you find potential collaborators, understand where work is concentrated, and identify coordination opportunities across the field."
            bodyText={`The psychedelic ecosystem includes hundreds of organizations and projects working across research, policy, clinical practice, harm reduction, education, and community support. This map shows who's doing what, where they're located, and how to connect with their work.

All information comes from publicly available sources or direct submissions from organizations. Coverage is strongest in the United States; global representation is limited by publicly available information. This is not a comprehensive directory—it's a starting point that grows as organizations choose to participate. Inclusion does not constitute endorsement, quality assessment, or medical advice.

Organizations can claim and edit their profiles at any time. All content is for educational purposes only.`}
            links={[
              {
                text: "Submit Your Organization",
                onClick: () => window.open(SUBMIT_ORG_FORM_URL, '_blank')
              },
              {
                text: "Submit a Project",
                onClick: () => window.open(SUBMIT_PROJECT_FORM_URL, '_blank')
              }
            ]}
            modalLinks={[
              { text: "Getting Started", onClick: () => setShowGettingStartedModal(true) },
              { text: "Important Information", onClick: () => setShowImportantInfoModal(true) },
              { text: "Help Us Make This Accurate", onClick: () => setShowHelpUsModal(true) },
              { text: "FAQ", onClick: () => setShowFAQModal(true) }
            ]}
          />
        </>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className={isEmbedMode ? "w-full h-full" : "max-w-6xl mx-auto px-3 sm:px-4 lg:px-6"} style={isEmbedMode ? {} : { zoom: 0.85 }}>
          {/* Tab Container */}
          <div className={isEmbedMode ? "" : "bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border-2"} style={isEmbedMode ? {} : { borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.15), 0 4px 6px -2px rgba(49, 126, 109, 0.05)' }}>
            {/* Tab Navigation */}
            {!isEmbedMode && <div className="flex border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
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
            </div>}

            {/* Tab Content */}
            <div className={isEmbedMode ? "" : "p-10 min-h-screen"} style={isEmbedMode ? {} : { backgroundColor: '#FBF3E7' }}>
              {/* Organizations Section */}
              {activeSection === 'organizations' && (
                <div key="org-section" className={transitionDirection === 'left' ? 'animate-slideInFromLeft' : 'animate-slideInFromRight'}>
                  {isEmbedMode ? (
                    // Embed Mode: Show only the visualization
                    <div>
                      {orgView === 'grouped' && (
                        <SimpleBubbleView
                          organizations={organizations}
                          onOrgClick={setSelectedOrgId}
                          hideControls={true}
                          chartType={chartType}
                          onChartTypeChange={setChartType}
                          groupBy={groupBy}
                          onGroupByChange={setGroupBy}
                          filterType={filterType}
                          onFilterTypeChange={setFilterType}
                          filterValue={filterValue}
                          onFilterValueChange={setFilterValue}
                        />
                      )}
                      {orgView === 'geographic' && (
                        <GeographicCompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                      {orgView === 'table' && (
                        <TableView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                    </div>
                  ) : (
                    // Normal Mode: Show full UI with tabs and controls
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

                        <div className="flex gap-2">
                          {/* Embed Button */}
                          <button
                            onClick={() => setShowEmbedModal(true)}
                            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Embed
                          </button>

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
                    </div>

                    {/* View Content */}
                    <div className="p-8 bg-white">
                      {orgView === 'grouped' && (
                        <SimpleBubbleView
                          organizations={organizations}
                          onOrgClick={setSelectedOrgId}
                          chartType={chartType}
                          onChartTypeChange={setChartType}
                          groupBy={groupBy}
                          onGroupByChange={setGroupBy}
                          filterType={filterType}
                          onFilterTypeChange={setFilterType}
                          filterValue={filterValue}
                          onFilterValueChange={setFilterValue}
                        />
                      )}
                      {orgView === 'geographic' && (
                        <GeographicCompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                      {orgView === 'table' && (
                        <TableView organizations={organizations} onOrgClick={setSelectedOrgId} />
                      )}
                    </div>
                    </div>
                  )}
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

      {/* Embed Modal */}
      {showEmbedModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEmbedModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#2B180A' }}>Embed This View</h2>
                <p className="text-sm" style={{ color: '#4A4643' }}>Copy the code below to embed this visualization on your website</p>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: '#F7F0E8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
              >
                <svg className="w-6 h-6" style={{ color: '#2B180A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>Preview URL:</label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 font-mono text-sm break-all" style={{ color: '#4A4643' }}>
                  {getEmbedUrl()}
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>Embed Code:</label>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    {getEmbedCode()}
                  </pre>
                  <button
                    onClick={copyEmbedCode}
                    className="absolute top-3 right-3 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    {copiedEmbed ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-900">How to use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Copy the embed code above</li>
                  <li>Paste it into your website's HTML</li>
                  <li>The visualization will appear with your current filters and view settings</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beta Warning Modal */}
      <BetaWarningModal />

      {/* All Info Modals */}
      <InfoModal
        isOpen={showGettingStartedModal}
        onClose={() => setShowGettingStartedModal(false)}
        title="Getting Started"
      >
        <GettingStarted />
      </InfoModal>

      <InfoModal
        isOpen={showImportantInfoModal}
        onClose={() => setShowImportantInfoModal(false)}
        title="Important Information"
      >
        <ImportantInformation />
      </InfoModal>

      <InfoModal
        isOpen={showHelpUsModal}
        onClose={() => setShowHelpUsModal(false)}
        title="Help Us Make This Accurate"
      >
        <HelpUsMakeAccurate />
      </InfoModal>

      <InfoModal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        title="FAQ"
      >
        <FAQ />
      </InfoModal>

      {/* Enhanced Footer with All Links */}
      {!isEmbedMode && (
        <footer className="w-full border-t mt-20" style={{ backgroundColor: '#2B231E', borderColor: '#4A4643' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col gap-6">
              {/* Main Footer Links */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs sm:text-sm text-center md:text-left" style={{ color: '#A19D9B' }}>
                  © {new Date().getFullYear()} Psychedelic Safety Institute. All rights reserved.
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center text-xs sm:text-sm">
                  <button onClick={() => setShowGettingStartedModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                    Getting Started
                  </button>
                  <button onClick={() => setShowImportantInfoModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                    Important Information
                  </button>
                  <button onClick={() => setShowFAQModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                    FAQ
                  </button>
                  <a href="https://www.psychedelicsafety.institute" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                    About PSI
                  </a>
                  <a href="https://www.psychedelicsafety.institute/contact" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                    Contact
                  </a>
                </div>
              </div>

              {/* Help Us Make This Accurate Button */}
              <div className="text-center border-t pt-6" style={{ borderColor: '#4A4643' }}>
                <button
                  onClick={() => setShowHelpUsModal(true)}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A6B5E'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#317E6D'}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Help Us Make This Accurate
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function EcosystemMapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-base font-medium" style={{ color: '#4A4643' }}>Loading...</p>
        </div>
      </div>
    }>
      <EcosystemMapContent />
    </Suspense>
  );
}

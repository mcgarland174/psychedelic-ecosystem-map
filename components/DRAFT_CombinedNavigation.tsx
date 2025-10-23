'use client';

/**
 * DRAFT: Combined Navigation Header
 *
 * This is a draft component for combining Ecosystem Map and Theory of Change
 * into a unified navigation experience.
 *
 * DO NOT USE IN PRODUCTION YET - This is for design review only
 */

import { useState } from 'react';

type Tool = 'ecosystem' | 'theory' | 'about';
type EcosystemSection = 'organizations' | 'projects' | 'programs';
type TheorySection = 'worldviews' | 'outcomes' | 'problems' | 'toc-projects';

interface CombinedNavigationProps {
  orgCount?: number;
  projectCount?: number;
  onToolChange?: (tool: Tool) => void;
  onSectionChange?: (section: EcosystemSection | TheorySection) => void;
}

export default function CombinedNavigation({
  orgCount = 766,
  projectCount = 123,
  onToolChange,
  onSectionChange,
}: CombinedNavigationProps) {
  const [activeTool, setActiveTool] = useState<Tool>('ecosystem');
  const [ecosystemSection, setEcosystemSection] = useState<EcosystemSection>('organizations');
  const [theorySection, setTheorySection] = useState<TheorySection>('worldviews');

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    onToolChange?.(tool);
  };

  const handleEcosystemSectionChange = (section: EcosystemSection) => {
    setEcosystemSection(section);
    onSectionChange?.(section);
  };

  const handleTheorySectionChange = (section: TheorySection) => {
    setTheorySection(section);
    onSectionChange?.(section);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      {/* Decorative Top Bar */}
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

      {/* Hero Header */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F7F0E8 0%, #FFFFFF 100%)' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-0">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-slideUp" style={{ color: '#2B180A' }}>
              Psychedelic Ecosystem Tools
            </h1>
            <p className="text-base md:text-lg max-w-3xl mx-auto mb-6 animate-slideUp font-normal leading-relaxed" style={{ color: '#4A4643', animationDelay: '0.1s', lineHeight: '1.6' }}>
              Explore organizations, projects, and our theory of change shaping the future of psychedelic research and therapy
            </p>
          </div>

          {/* Main Tool Navigation */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-t-2xl shadow-xl border-2 border-b-0 overflow-hidden" style={{ borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.15)' }}>
              {/* Top-Level Tool Tabs */}
              <div className="flex border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
                <button
                  onClick={() => handleToolChange('ecosystem')}
                  className={`
                    flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px]
                    hover:scale-105 active:scale-95
                    ${activeTool === 'ecosystem'
                      ? 'bg-white border-b-4'
                      : 'hover:bg-white/50'
                    }
                  `}
                  style={{
                    transform: activeTool === 'ecosystem' ? 'translateY(0)' : undefined,
                    color: activeTool === 'ecosystem' ? '#317E6D' : '#2B180A99',
                    borderColor: activeTool === 'ecosystem' ? '#317E6D' : 'transparent'
                  }}
                  aria-label="Ecosystem Map tool"
                  aria-current={activeTool === 'ecosystem' ? 'page' : undefined}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex flex-col items-start">
                    <span className="font-bold">Ecosystem Map</span>
                    <span className="text-xs opacity-75">{orgCount} orgs, {projectCount} projects</span>
                  </span>
                </button>

                <button
                  onClick={() => handleToolChange('theory')}
                  className={`
                    flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px]
                    hover:scale-105 active:scale-95
                    ${activeTool === 'theory'
                      ? 'bg-white border-b-4'
                      : 'hover:bg-white/50'
                    }
                  `}
                  style={{
                    transform: activeTool === 'theory' ? 'translateY(0)' : undefined,
                    color: activeTool === 'theory' ? '#317E6D' : '#2B180A99',
                    borderColor: activeTool === 'theory' ? '#317E6D' : 'transparent'
                  }}
                  aria-label="Theory of Change tool"
                  aria-current={activeTool === 'theory' ? 'page' : undefined}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="font-bold">Theory of Change</span>
                </button>

                <button
                  onClick={() => handleToolChange('about')}
                  className={`
                    flex-1 px-6 py-4 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[60px]
                    hover:scale-105 active:scale-95
                    ${activeTool === 'about'
                      ? 'bg-white border-b-4'
                      : 'hover:bg-white/50'
                    }
                  `}
                  style={{
                    transform: activeTool === 'about' ? 'translateY(0)' : undefined,
                    color: activeTool === 'about' ? '#317E6D' : '#2B180A99',
                    borderColor: activeTool === 'about' ? '#317E6D' : 'transparent'
                  }}
                  aria-label="About these tools"
                  aria-current={activeTool === 'about' ? 'page' : undefined}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold">About</span>
                </button>
              </div>

              {/* Sub-Navigation for Ecosystem Map */}
              {activeTool === 'ecosystem' && (
                <div className="border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
                  <div className="flex items-center justify-between px-6 py-3">
                    <nav className="flex space-x-2" aria-label="Ecosystem sections">
                      <button
                        onClick={() => handleEcosystemSectionChange('organizations')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${ecosystemSection === 'organizations'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: ecosystemSection !== 'organizations' ? '#2B180A' : undefined }}
                        aria-current={ecosystemSection === 'organizations' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Organizations ({orgCount})
                      </button>

                      <button
                        onClick={() => handleEcosystemSectionChange('projects')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${ecosystemSection === 'projects'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: ecosystemSection !== 'projects' ? '#2B180A' : undefined }}
                        aria-current={ecosystemSection === 'projects' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Projects ({projectCount})
                      </button>

                      <button
                        onClick={() => handleEcosystemSectionChange('programs')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${ecosystemSection === 'programs'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: ecosystemSection !== 'programs' ? '#2B180A' : undefined }}
                        aria-current={ecosystemSection === 'programs' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Programs
                      </button>
                    </nav>

                    {/* Context-aware Submit Button */}
                    <a
                      href="#"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Submit {ecosystemSection === 'organizations' ? 'Organization' : ecosystemSection === 'projects' ? 'Project' : 'Program'}
                    </a>
                  </div>
                </div>
              )}

              {/* Sub-Navigation for Theory of Change */}
              {activeTool === 'theory' && (
                <div className="border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
                  <div className="flex items-center justify-between px-6 py-3">
                    <nav className="flex space-x-2" aria-label="Theory of Change sections">
                      <button
                        onClick={() => handleTheorySectionChange('worldviews')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${theorySection === 'worldviews'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: theorySection !== 'worldviews' ? '#2B180A' : undefined }}
                        aria-current={theorySection === 'worldviews' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Worldviews
                      </button>

                      <button
                        onClick={() => handleTheorySectionChange('outcomes')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${theorySection === 'outcomes'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: theorySection !== 'outcomes' ? '#2B180A' : undefined }}
                        aria-current={theorySection === 'outcomes' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Outcomes
                      </button>

                      <button
                        onClick={() => handleTheorySectionChange('problems')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${theorySection === 'problems'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: theorySection !== 'problems' ? '#2B180A' : undefined }}
                        aria-current={theorySection === 'problems' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Problems
                      </button>

                      <button
                        onClick={() => handleTheorySectionChange('toc-projects')}
                        className={`
                          px-5 py-2.5 rounded-xl font-semibold text-sm min-h-[44px]
                          transition-all duration-300 flex items-center gap-2
                          ${theorySection === 'toc-projects'
                            ? 'bg-teal-500 text-white shadow-md'
                            : 'hover:bg-white'
                          }
                        `}
                        style={{ color: theorySection !== 'toc-projects' ? '#2B180A' : undefined }}
                        aria-current={theorySection === 'toc-projects' ? 'page' : undefined}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Projects
                      </button>
                    </nav>

                    {/* Context-aware Submit Button */}
                    <a
                      href="#"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Submit {theorySection === 'worldviews' ? 'Worldview' : theorySection === 'outcomes' ? 'Outcome' : theorySection === 'problems' ? 'Problem' : 'Project'}
                    </a>
                  </div>
                </div>
              )}

              {/* No sub-navigation for About */}
              {activeTool === 'about' && (
                <div className="border-b-2 px-6 py-3" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
                  <p className="text-sm text-center" style={{ color: '#6B6764' }}>
                    Learn about our tools and methodology
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Placeholder */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border-2 p-8" style={{ borderColor: '#E6C8A1' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
              Content Area Placeholder
            </h2>
            <p style={{ color: '#4A4643' }}>
              Active Tool: <strong>{activeTool}</strong>
            </p>
            {activeTool === 'ecosystem' && (
              <p style={{ color: '#4A4643' }}>
                Active Section: <strong>{ecosystemSection}</strong>
              </p>
            )}
            {activeTool === 'theory' && (
              <p style={{ color: '#4A4643' }}>
                Active Section: <strong>{theorySection}</strong>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { AppWorldview, AppOutcome, AppProblemCategory, AppProblem, AppProject } from '@/lib/data-transformer';
import PSIHeader from '@/components/PSIHeader';
import ToolIntroductionV3 from '@/components/ToolIntroductionV3';
import InfoModal from '@/components/InfoModal';
import HowToUseAndMethodology from '@/components/modals/HowToUseAndMethodology';
import HelpUsImprove from '@/components/modals/HelpUsImprove';
import FAQ from '@/components/modals/FAQ';
import StoryMode from '@/components/TheoryOfChange/StoryMode';
import ChangePathways from '@/components/TheoryOfChange/ChangePathways';
import FrameworkExplorer from '@/components/TheoryOfChange/FrameworkExplorer';

interface ApiResponse {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problemCategories: AppProblemCategory[];
  problems: AppProblem[];
  projects: AppProject[];
}

export default function TheoryOfChangePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'story' | 'swimlanes' | 'explorer'>('story');

  // Modal state
  const [showHowToMethodologyModal, setShowHowToMethodologyModal] = useState(false);
  const [showHelpUsImproveModal, setShowHelpUsImproveModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  // Fetch data from unified API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching ToC data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
        <PSIHeader />
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-lg" style={{ color: '#4A4643' }}>Loading Theory of Change...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
        <PSIHeader />
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="text-center">
            <p className="text-red-600 text-lg">Failed to load data. Please refresh the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const calloutText = `Built from 159 interviews, refined by 140 field leaders. This framework emerged from what stakeholders told us was needed over two years of field research. See something to improve? The tool is designed for your input—suggest edits, propose additions, and help us refine it.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <PSIHeader />

      {/* Decorative Top Bar */}
      <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

      {/* Introduction Section */}
      <ToolIntroductionV3
        title="Theory of Change Explorer"
        subtitle="Mapping How Different Worldviews Lead to Different Outcomes"
        calloutText={calloutText}
        bodyText={`This tool connects what stakeholders believe should change in the psychedelic ecosystem (worldviews), what they want to achieve (outcomes), what problems stand in the way, and what projects address those problems. It's not a prescriptive roadmap—it's a descriptive map of how different actors see the path forward.

Built from 159 stakeholder interviews and refined through feedback from 140 field leaders at a coordination summit, this framework reveals the diversity of approaches shaping the field. Use it to find alignment, understand disagreements, and identify where your work fits in the broader ecosystem.

The framework includes 7 distinct worldviews, 38 field-validated outcomes, 48 validated problems, and 8 problem categories—all derived from systematic analysis of stakeholder perspectives.`}
        modalLinks={[
          { text: "How to Use & Methodology", onClick: () => setShowHowToMethodologyModal(true) },
          { text: "Help Us Improve This", onClick: () => setShowHelpUsImproveModal(true) },
          { text: "FAQ", onClick: () => setShowFAQModal(true) }
        ]}
      />

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all transform hover:scale-102 ${
              activeTab === 'story'
                ? 'text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            style={activeTab === 'story' ? { backgroundColor: '#317E6D' } : { color: '#4A4643' }}
          >
            Story Mode
          </button>
          <button
            onClick={() => setActiveTab('swimlanes')}
            className={`px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all transform hover:scale-102 ${
              activeTab === 'swimlanes'
                ? 'text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            style={activeTab === 'swimlanes' ? { backgroundColor: '#317E6D' } : { color: '#736C66' }}
            title="An interactive view that lets you trace connections from worldviews → outcomes → problems → projects to see how different perspectives lead to different solutions."
          >
            Change Pathways
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all transform hover:scale-102 ${
              activeTab === 'explorer'
                ? 'text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
            style={activeTab === 'explorer' ? { backgroundColor: '#CC8D37' } : { color: '#736C66' }}
          >
            Framework Explorer
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === 'story' && (
        <StoryMode
          worldviews={data.worldviews}
          outcomes={data.outcomes}
          problems={data.problems}
          problemCategories={data.problemCategories}
          projects={data.projects}
        />
      )}

      {activeTab === 'swimlanes' && (
        <ChangePathways
          worldviews={data.worldviews}
          outcomes={data.outcomes}
          problems={data.problems}
          problemCategories={data.problemCategories}
          projects={data.projects}
        />
      )}

      {activeTab === 'explorer' && (
        <FrameworkExplorer
          worldviews={data.worldviews}
          outcomes={data.outcomes}
          problems={data.problems}
          problemCategories={data.problemCategories}
          projects={data.projects}
        />
      )}

      {/* All Info Modals */}
      <InfoModal
        isOpen={showHowToMethodologyModal}
        onClose={() => setShowHowToMethodologyModal(false)}
        title="How to Use & Methodology"
      >
        <HowToUseAndMethodology />
      </InfoModal>

      <InfoModal
        isOpen={showHelpUsImproveModal}
        onClose={() => setShowHelpUsImproveModal(false)}
        title="Help Us Improve This Tool"
      >
        <HelpUsImprove />
      </InfoModal>

      <InfoModal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        title="FAQ"
      >
        <FAQ />
      </InfoModal>

      {/* Enhanced Footer with All Links */}
      <footer className="w-full border-t mt-20" style={{ backgroundColor: '#2B231E', borderColor: '#4A4643' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-6">
            {/* Main Footer Links */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs sm:text-sm text-center md:text-left" style={{ color: '#A19D9B' }}>
                © {new Date().getFullYear()} Psychedelic Safety Institute. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center text-xs sm:text-sm">
                <button onClick={() => setShowHowToMethodologyModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  How to Use & Methodology
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

            {/* Improve This Tool Button */}
            <div className="text-center border-t pt-6" style={{ borderColor: '#4A4643' }}>
              <button
                onClick={() => setShowHelpUsImproveModal(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A6B5E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#317E6D'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Improve This Tool
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

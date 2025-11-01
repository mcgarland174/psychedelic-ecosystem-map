'use client';

import { useEffect, useState } from 'react';
import PSIHeader from '@/components/PSIHeader';
import ToolIntroductionV3 from '@/components/ToolIntroductionV3';
import InfoModal from '@/components/InfoModal';
import BetaWarningModal from '@/components/BetaWarningModal';
import FrameworkExplorer from '@/components/TheoryOfChange/FrameworkExplorer';
import GettingStarted from '@/components/modals/strategic-elements/GettingStarted';
import Methodology from '@/components/modals/strategic-elements/Methodology';
import ImportantContext from '@/components/modals/strategic-elements/ImportantContext';
import FAQAndFeedback from '@/components/modals/strategic-elements/FAQAndFeedback';
import type { AppWorldview, AppOutcome, AppProblemCategory, AppProblem, AppProject } from '@/lib/data-transformer';

interface ApiResponse {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problemCategories: AppProblemCategory[];
  problems: AppProblem[];
  projects: AppProject[];
}

export default function FrameworkExplorerPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGettingStartedModal, setShowGettingStartedModal] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showImportantContextModal, setShowImportantContextModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching ToC data:', error);
        setError('Unable to load Strategic Elements data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
        <PSIHeader />
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-base font-medium" style={{ color: '#4A4643' }}>Loading Strategic Elements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
        <PSIHeader />
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

  const introText = `Understanding the psychedelic ecosystem requires recognizing that different stakeholders hold different perspectives, priorities, and visions for the future. The Strategic Elements Explorer helps you navigate this complexity by making explicit the diverse worldviews, shared outcomes, and common challenges that shape our field.

This framework emerged from asking stakeholders: What does success look like to you? What barriers stand in your way? What would you do with a magic wand? Their answers revealed both the diversity of perspectives and the areas of surprising alignment.`;

  const calloutText = `7 worldviews, 48 problems, 38 outcomes—all field-validated. These aren't boxes—they're tools for finding allies and coordination opportunities. Built from systematic analysis of 172 stakeholders across 13 dimensions. Shape them with us.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      <PSIHeader />
      <ToolIntroductionV3
        title="Strategic Elements Explorer"
        subtitle="Navigate the Diverse Perspectives and Shared Priorities Shaping the Field"
        calloutText={calloutText}
        calloutIcon="🗺️"
        bodyText={introText}
        links={[]}
        modalLinks={[
          { text: "Getting Started", onClick: () => setShowGettingStartedModal(true) },
          { text: "Methodology", onClick: () => setShowMethodologyModal(true) },
          { text: "Important Context", onClick: () => setShowImportantContextModal(true) },
          { text: "FAQ & Feedback", onClick: () => setShowFAQModal(true) }
        ]}
      />

      {/* Tool Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E6C8A1',
            boxShadow: '0 10px 25px -5px rgba(49, 126, 109, 0.15), 0 8px 10px -6px rgba(49, 126, 109, 0.1)'
          }}
        >
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-teal-600 to-teal-500" />

          <FrameworkExplorer
            worldviews={data.worldviews}
            outcomes={data.outcomes}
            problems={data.problems}
            problemCategories={data.problemCategories}
            projects={data.projects}
          />
        </div>
      </div>

      {/* Beta Warning Modal */}
      <BetaWarningModal />

      {/* Modals */}
      <InfoModal
        isOpen={showGettingStartedModal}
        onClose={() => setShowGettingStartedModal(false)}
        title="Getting Started"
      >
        <GettingStarted />
      </InfoModal>

      <InfoModal
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
        title="Methodology"
      >
        <Methodology />
      </InfoModal>

      <InfoModal
        isOpen={showImportantContextModal}
        onClose={() => setShowImportantContextModal(false)}
        title="Important Context"
      >
        <ImportantContext />
      </InfoModal>

      <InfoModal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        title="FAQ & Feedback"
      >
        <FAQAndFeedback />
      </InfoModal>

      {/* Enhanced Footer */}
      <footer className="w-full border-t mt-20" style={{ backgroundColor: '#2B231E', borderColor: '#4A4643' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs sm:text-sm text-center md:text-left" style={{ color: '#A19D9B' }}>
                © {new Date().getFullYear()} Psychedelic Safety Institute. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center text-xs sm:text-sm">
                <button onClick={() => setShowGettingStartedModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Getting Started
                </button>
                <button onClick={() => setShowMethodologyModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Methodology
                </button>
                <button onClick={() => setShowImportantContextModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Important Context
                </button>
                <button onClick={() => setShowFAQModal(true)} className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  FAQ & Feedback
                </button>
                <a href="https://www.psychedelicsafety.institute" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  About PSI
                </a>
                <a href="https://www.psychedelicsafety.institute/contact" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors whitespace-nowrap" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Contact
                </a>
              </div>
            </div>

            <div className="text-center border-t pt-6" style={{ borderColor: '#4A4643' }}>
              <button
                onClick={() => setShowFAQModal(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A6B5E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#317E6D'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Share Your Feedback
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

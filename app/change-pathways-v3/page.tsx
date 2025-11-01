'use client';

import { useEffect, useState } from 'react';
import PSIHeader from '@/components/PSIHeader';
import ToolIntroductionV3 from '@/components/ToolIntroductionV3';
import InfoModal from '@/components/InfoModal';
import TheoryOfChangeMethodologyMerged from '@/components/modals/TheoryOfChangeMethodologyMerged';
import TheoryOfChangeHowToV3 from '@/components/modals/TheoryOfChangeHowToV3';
import ImportantContext from '@/components/modals/ImportantContext';
import HelpUsImprove from '@/components/modals/HelpUsImprove';
import FAQ from '@/components/modals/FAQ';
import ChangePathways from '@/components/TheoryOfChange/ChangePathways';
import type { AppWorldview, AppOutcome, AppProblemCategory, AppProblem, AppProject } from '@/lib/data-transformer';
import './enhancements.css';

interface ApiResponse {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problemCategories: AppProblemCategory[];
  problems: AppProblem[];
  projects: AppProject[];
}

export default function ChangePathwaysPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showImportantContextModal, setShowImportantContextModal] = useState(false);
  const [showHelpUsImproveModal, setShowHelpUsImproveModal] = useState(false);
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
        setError('Unable to load Theory of Change Explorer data. Please try again.');
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
            <p className="text-base font-medium" style={{ color: '#4A4643' }}>Loading Theory of Change Explorer...</p>
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

  const introText = `Over two years, we engaged with stakeholders across the psychedelic ecosystem through 159 in-depth interviews, a national summit, and extensive field research to understand the challenges facing public health and safety. Through this collaborative process, we identified core strategic and coordination challenges that no single organization can solve alone.

The Theory of Change Explorer is a free, transparent tool that maps connections between different worldviews, outcomes, problems, and projects to help you understand how your work fits into the broader ecosystem and discover potential collaboration opportunities.`;

  const calloutText = `Built from 159 interviews, refined by 140 field leaders. This framework emerged from what stakeholders told us was needed over two years of field research. See something to improve? The tool is designed for your input—suggest edits, propose additions, and help us refine it.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <PSIHeader />
      <ToolIntroductionV3
        title="Theory of Change Explorer"
        subtitle="Supporting the Health of the Psychedelic Field and Users (V3 - Updated Content)"
        calloutText={calloutText}
        calloutIcon="📊"
        bodyText={introText}
        links={[]}
        modalLinks={[
          { text: "How to Use This Tool", onClick: () => setShowHowToModal(true) },
          { text: "How This Framework Was Developed", onClick: () => setShowMethodologyModal(true) },
          { text: "Important Context", onClick: () => setShowImportantContextModal(true) },
          { text: "Help Us Improve This", onClick: () => setShowHelpUsImproveModal(true) },
          { text: "Frequently Asked Questions", onClick: () => setShowFAQModal(true) }
        ]}
      />

      <ChangePathways
        worldviews={data.worldviews}
        outcomes={data.outcomes}
        problems={data.problems}
        problemCategories={data.problemCategories}
        projects={data.projects}
      />

      {/* Modals */}
      <InfoModal
        isOpen={showHowToModal}
        onClose={() => setShowHowToModal(false)}
        title="How to Use This Tool"
      >
        <TheoryOfChangeHowToV3 />
      </InfoModal>

      <InfoModal
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
        title="How This Framework Was Developed"
      >
        <TheoryOfChangeMethodologyMerged />
      </InfoModal>

      <InfoModal
        isOpen={showImportantContextModal}
        onClose={() => setShowImportantContextModal(false)}
        title="Important Context"
      >
        <ImportantContext />
      </InfoModal>

      <InfoModal
        isOpen={showHelpUsImproveModal}
        onClose={() => setShowHelpUsImproveModal(false)}
        title="Help Us Improve This"
      >
        <HelpUsImprove />
      </InfoModal>

      <InfoModal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        title="Frequently Asked Questions"
      >
        <FAQ />
      </InfoModal>

      {/* Enhanced Footer with All Links */}
      <footer className="w-full border-t mt-20" style={{ backgroundColor: '#2B231E', borderColor: '#4A4643' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {/* Main Footer Links */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm" style={{ color: '#A19D9B' }}>
                © {new Date().getFullYear()} Psychedelic Safety Institute. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-4 justify-center items-center text-sm">
                <button onClick={() => setShowHowToModal(true)} className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  How to Use
                </button>
                <button onClick={() => setShowMethodologyModal(true)} className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Methodology
                </button>
                <button onClick={() => setShowImportantContextModal(true)} className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Important Context
                </button>
                <button onClick={() => setShowFAQModal(true)} className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  FAQ
                </button>
                <a href="https://psychedelicsafetyinstitute.org" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  About PSI
                </a>
                <a href="https://psychedelicsafetyinstitute.org/contact" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                  Contact
                </a>
              </div>
            </div>

            {/* Improve This Tool Button */}
            <div className="text-center border-t pt-6" style={{ borderColor: '#4A4643' }}>
              <button
                onClick={() => setShowHelpUsImproveModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A6B5E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#317E6D'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

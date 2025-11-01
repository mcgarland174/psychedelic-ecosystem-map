'use client';

import { useEffect, useState } from 'react';
import PSIHeader from '@/components/PSIHeader';
import ToolIntroductionV2 from '@/components/ToolIntroductionV2';
import InfoModal from '@/components/InfoModal';
import TheoryOfChangeMethodology from '@/components/modals/TheoryOfChangeMethodology';
import TheoryOfChangeHowTo from '@/components/modals/TheoryOfChangeHowTo';
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
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);

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

  const introText = `Over two years, we engaged with stakeholders across the psychedelic ecosystem through 138 in-depth interviews, a national summit, and extensive field research to understand the challenges facing public health and safety. Through this collaborative process, we identified core strategic and coordination challenges that no single organization can solve alone.

This tool maps connections between different worldviews, outcomes, problems, and projects to help you understand how your work fits into the broader ecosystem and discover potential collaboration opportunities. This is a first iteration built from what the field told us was needed. All organizational and project information comes from publicly available sources or direct submissions. Organizations can claim and edit their profiles at any time.`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <PSIHeader />
      <ToolIntroductionV2
        title="Theory of Change Explorer (V2 - Improved)"
        subtitle="Supporting the Health of the Psychedelic Field and Users"
        bodyText={introText}
        links={[
          {
            text: "Learn more about our methodology",
            onClick: () => setShowMethodologyModal(true)
          },
          {
            text: "How to use this tool",
            onClick: () => setShowHowToModal(true)
          }
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
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
        title="Our Methodology"
      >
        <TheoryOfChangeMethodology />
      </InfoModal>

      <InfoModal
        isOpen={showHowToModal}
        onClose={() => setShowHowToModal(false)}
        title="How to Use This Tool"
      >
        <TheoryOfChangeHowTo />
      </InfoModal>

      {/* Simple Footer */}
      <footer className="w-full border-t mt-20" style={{ backgroundColor: '#2B231E', borderColor: '#4A4643' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#A19D9B' }}>
            <div>
              © {new Date().getFullYear()} Psychedelic Safety Institute. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="https://psychedelicsafetyinstitute.org" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                About PSI
              </a>
              <a href="https://psychedelicsafetyinstitute.org/contact" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                Contact
              </a>
              <button onClick={() => setShowMethodologyModal(true)} className="hover:underline transition-colors" style={{ color: '#A19D9B' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A19D9B'}>
                Methodology
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

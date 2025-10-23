'use client';

import { useEffect, useState } from 'react';
import type { AppWorldview, AppOutcome, AppProblemCategory, AppProblem, AppProject } from '@/lib/data-transformer';
import StoryMode from '@/components/TheoryOfChange/StoryMode';
import ChangePathways from '@/components/TheoryOfChange/ChangePathways';
import FrameworkExplorer from '@/components/TheoryOfChange/FrameworkExplorer';
import Tooltip from '@/components/TheoryOfChange/Tooltip';

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-lg" style={{ color: '#4A4643' }}>Loading Theory of Change...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBF3E7' }}>
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBF3E7' }}>
      {/* Header Section */}
      <div className="relative px-6 py-16 md:py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#2B180A' }}>
              Theory of Change
            </h1>
            <Tooltip
              content="A framework that maps how different approaches and activities lead to desired changes in society. It connects what we believe (worldviews) to what we want to achieve (outcomes) through concrete actions (projects)."
              iconSize={24}
            />
          </div>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: '#4A4643' }}>
            Mapping the worldviews, outcomes, and projects shaping the psychedelic ecosystem
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-7 py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-102 ${
                activeTab === 'story'
                  ? 'text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              style={activeTab === 'story' ? { backgroundColor: '#317E6D' } : { color: '#4A4643' }}
            >
              Story Mode
            </button>
            <div className="relative group">
              <button
                onClick={() => setActiveTab('swimlanes')}
                className={`px-7 py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-102 ${
                  activeTab === 'swimlanes'
                    ? 'text-white shadow-lg'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }`}
                style={activeTab === 'swimlanes' ? { backgroundColor: '#317E6D' } : { color: '#736C66' }}
                title="An interactive view that lets you trace connections from worldviews → outcomes → problems → projects to see how different perspectives lead to different solutions."
              >
                Change Pathways
              </button>
            </div>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-7 py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-102 ${
                activeTab === 'explorer'
                  ? 'text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              style={activeTab === 'explorer' ? { backgroundColor: '#CC8D37' } : { color: '#736C66' }}
            >
              Framework Explorer
            </button>
          </div>

          {/* Scroll indicator - only show in story mode */}
          {activeTab === 'story' && (
            <div className="pt-8 animate-bounce">
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-xs" style={{ color: '#6B6764' }}>Scroll to explore</p>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#6B6764' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          )}
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

      {/* Back to Ecosystem Map Link */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200"
          style={{ color: '#2B180A' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Ecosystem Map
        </a>
      </div>
    </div>
  );
}

/**
 * Theory of Change Application
 *
 * This is the main application component that displays the theory of change
 * visualization with three modes: Story, Change Pathways, and Project Explorer.
 *
 * Data is loaded from Airtable via the transformation layer.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Network, Database, Search, X, Plus, Info } from 'lucide-react';

// Import transformed data types
import type {
  AppWorldview,
  AppOutcome,
  AppProblemCategory,
  AppProblem,
  AppProject
} from '@/lib/data-transformer';

interface TheoryOfChangeAppProps {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problemCategories: AppProblemCategory[];
  problems: AppProblem[];
  projects: AppProject[];
}

export default function TheoryOfChangeApp({
  worldviews,
  outcomes,
  problemCategories,
  problems,
  projects
}: TheoryOfChangeAppProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'swimlanes' | 'explorer'>('story');
  const [selectedWorldviews, setSelectedWorldviews] = useState<string[]>([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [storySection, setStorySection] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailView, setDetailView] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const connectionsSvgRef = useRef<SVGSVGElement>(null);
  const worldviewRefs = useRef<Record<string, HTMLElement | null>>({});
  const outcomeRefs = useRef<Record<string, HTMLElement | null>>({});
  const problemRefs = useRef<Record<string, HTMLElement | null>>({});
  const projectRefs = useRef<Record<string, HTMLElement | null>>({});
  const storyRef = useRef<HTMLDivElement>(null);

  // Story mode scroll tracking
  useEffect(() => {
    if (activeTab !== 'story' || !storyRef.current) return;

    const handleScroll = () => {
      const scrollY = storyRef.current!.scrollTop;
      const sectionHeight = window.innerHeight * 0.8;
      const newSection = Math.floor(scrollY / sectionHeight);
      setStorySection(Math.min(newSection, 4));
    };

    storyRef.current.addEventListener('scroll', handleScroll);
    return () => storyRef.current?.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // Get relevant outcomes based on selected worldviews
  const getRelevantOutcomes = () => {
    if (selectedWorldviews.length === 0) return [];
    return outcomes.filter(outcome =>
      selectedWorldviews.some(wvId =>
        ['High', 'Medium'].includes(outcome.worldviewRelevance[wvId] || '')
      )
    );
  };

  // Get relevant problems based on selected outcomes
  const getRelevantProblems = () => {
    const relevantOutcomeIds = selectedOutcomes.length > 0
      ? selectedOutcomes
      : getRelevantOutcomes().map(o => o.id);

    return problems.filter(problem =>
      problem.affectedOutcomes.some(outcomeId => relevantOutcomeIds.includes(outcomeId))
    );
  };

  // Get relevant projects based on selected problems
  const getRelevantProjects = () => {
    const relevantProblemIds = selectedProblems.length > 0
      ? selectedProblems
      : getRelevantProblems().map(p => p.id);

    return projects.filter(project =>
      project.addressedProblems.some(probId => relevantProblemIds.includes(probId))
    );
  };

  // Get filtered projects for explorer view
  const getFilteredProjects = () => {
    let filtered = projects;

    if (selectedWorldviews.length > 0) {
      const relevantOutcomeIds = outcomes
        .filter(outcome =>
          selectedWorldviews.some(wvId =>
            ['High', 'Medium'].includes(outcome.worldviewRelevance[wvId] || '')
          )
        )
        .map(o => o.id);

      const relevantProblemIds = problems
        .filter(problem =>
          problem.affectedOutcomes.some(outcomeId => relevantOutcomeIds.includes(outcomeId))
        )
        .map(p => p.id);

      filtered = filtered.filter(project =>
        project.addressedProblems.some(probId => relevantProblemIds.includes(probId))
      );
    }

    if (selectedOutcomes.length > 0) {
      const relevantProblemIds = problems
        .filter(problem =>
          problem.affectedOutcomes.some(outcomeId => selectedOutcomes.includes(outcomeId))
        )
        .map(p => p.id);

      filtered = filtered.filter(project =>
        project.addressedProblems.some(probId => relevantProblemIds.includes(probId))
      );
    }

    if (selectedProblems.length > 0) {
      filtered = filtered.filter(project =>
        project.addressedProblems.some(probId => selectedProblems.includes(probId))
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.organizations.some(org => org.toLowerCase().includes(term)) ||
        project.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const toggleWorldview = (id: string) => {
    setSelectedWorldviews(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
    if (activeTab === 'swimlanes') {
      setSelectedOutcomes([]);
      setSelectedProblems([]);
    }
  };

  const toggleOutcome = (id: string) => {
    setSelectedOutcomes(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
    if (activeTab === 'swimlanes') {
      setSelectedProblems([]);
    }
  };

  const toggleProblem = (id: string) => {
    setSelectedProblems(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedWorldviews([]);
    setSelectedOutcomes([]);
    setSelectedProblems([]);
    setSearchTerm('');
  };

  const relevantOutcomes = getRelevantOutcomes();
  const relevantProblems = getRelevantProblems();
  const relevantProjects = getRelevantProjects();
  const filteredProjects = getFilteredProjects();

  const showProblems = selectedOutcomes.length > 0;
  const showProjects = selectedProblems.length > 0;

  const getWorldviewsForOutcome = (outcomeId: string) => {
    const outcome = outcomes.find(o => o.id === outcomeId);
    return worldviews.filter(wv =>
      outcome?.worldviewRelevance[wv.id] === 'High' ||
      outcome?.worldviewRelevance[wv.id] === 'Medium'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {activeTab === 'story' && (
        <div className="h-screen bg-slate-900 text-white overflow-hidden flex flex-col">
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('story')} className="px-3 py-1 rounded bg-blue-600 text-white">Story</button>
              <button onClick={() => setActiveTab('swimlanes')} className="px-3 py-1 rounded text-slate-300 hover:text-white">Change Pathways</button>
              <button onClick={() => setActiveTab('explorer')} className="px-3 py-1 rounded text-slate-300 hover:text-white">Explorer</button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFeedbackForm(true)} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <Info size={18} />Submit Feedback
              </button>
              <button onClick={() => setShowSubmitForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                <Plus size={18} />Submit Project
              </button>
            </div>
          </div>

          <div className="h-1 bg-slate-800">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${(storySection / 4) * 100}%` }} />
          </div>

          {/* Story mode content will continue in next message due to length */}
          <div className="text-center p-12">
            <p className="text-2xl">Story Mode - Coming Soon</p>
            <p className="text-slate-400 mt-4">This view will show the narrative flow through worldviews → outcomes → problems → projects</p>
          </div>
        </div>
      )}

      {/* Other tabs and modals will be added */}
      {activeTab !== 'story' && (
        <div className="p-12 text-center">
          <p className="text-2xl">Other views coming soon...</p>
        </div>
      )}
    </div>
  );
}

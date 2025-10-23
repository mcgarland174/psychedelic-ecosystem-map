'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, X, MousePointer, ArrowRight, Lightbulb, Eye, Target, AlertTriangle, Rocket, Sparkles } from 'lucide-react';
import type { AppWorldview, AppOutcome, AppProblem, AppProblemCategory, AppProject } from '@/lib/data-transformer';
import { TEAL, ORANGE_GOLD, PRIMARY, LIGHT_BACKGROUNDS, LIGHT_TEXT, getCategoryBadgeClasses, getCategoryColor } from '@/lib/brand-colors';
import WorldviewDetailModal from './Modals/WorldviewDetailModal';
import OutcomeDetailModal from './Modals/OutcomeDetailModal';
import ProblemDetailModal from './Modals/ProblemDetailModal';
import ProjectDetailModal from './Modals/ProjectDetailModal';

interface ChangePathwaysProps {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problems: AppProblem[];
  problemCategories: AppProblemCategory[];
  projects: AppProject[];
}

export default function ChangePathways({
  worldviews,
  outcomes,
  problems,
  problemCategories,
  projects,
}: ChangePathwaysProps) {
  const [selectedWorldviews, setSelectedWorldviews] = useState<string[]>([]);
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [relevanceFilter, setRelevanceFilter] = useState<string[]>(['High', 'Medium', 'Low']);
  const [selectedWorldview, setSelectedWorldview] = useState<AppWorldview | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<AppOutcome | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<AppProblem | null>(null);
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeHelpStep, setActiveHelpStep] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<{ type: 'worldview' | 'outcome' | 'problem' | 'project'; id: string } | null>(null);

  const connectionsSvgRef = useRef<SVGSVGElement | null>(null);
  const worldviewRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const outcomeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const problemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Refs for scrollable containers
  const worldviewColumnRef = useRef<HTMLDivElement | null>(null);
  const outcomeColumnRef = useRef<HTMLDivElement | null>(null);
  const problemColumnRef = useRef<HTMLDivElement | null>(null);
  const projectColumnRef = useRef<HTMLDivElement | null>(null);

  // Toggle functions
  const toggleWorldview = (id: string) => {
    setSelectedWorldviews(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleOutcome = (id: string) => {
    setSelectedOutcomes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProblem = (id: string) => {
    setSelectedProblems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Compute what should show
  const showOutcomes = selectedWorldviews.length > 0;
  const showProblems = selectedOutcomes.length > 0;
  const showProjects = selectedProblems.length > 0;

  // Toggle relevance filter
  const toggleRelevance = (level: string) => {
    setRelevanceFilter(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedWorldviews([]);
    setSelectedOutcomes([]);
    setSelectedProblems([]);
  };

  // Filter relevant items
  const relevantOutcomes = showOutcomes
    ? outcomes.filter(outcome => {
        // If no relevance filters selected, show all outcomes
        if (relevanceFilter.length === 0) {
          return true;
        }
        // Check if this outcome has the right relevance for any selected worldview
        return selectedWorldviews.some(wvId => {
          const relevance = outcome.worldviewRelevance[wvId];
          return relevance && relevanceFilter.includes(relevance);
        });
      })
    : [];

  const relevantProblems = showProblems
    ? problems.filter(problem => {
        // Show problems that affect any selected outcome
        return selectedOutcomes.some(outcomeId =>
          problem.affectedOutcomes?.includes(outcomeId)
        );
      })
    : [];

  const relevantProjects = showProjects
    ? projects.filter(project => {
        // Show projects that address any selected problem
        return selectedProblems.some(problemId =>
          project.addressedProblems?.includes(problemId)
        );
      })
    : [];

  // Determine grid columns with minimum widths to prevent text cutoff
  const gridCols = showProjects
    ? 'repeat(4, minmax(280px, 1fr))'
    : showProblems
    ? 'repeat(3, minmax(300px, 1fr))'
    : showOutcomes
    ? 'repeat(2, minmax(350px, 1fr))'
    : '1fr';

  // Function to draw all SVG connection lines
  const drawConnections = useRef(() => {
    if (!connectionsSvgRef.current) return;

    const svg = connectionsSvgRef.current;
    const parent = svg.parentElement;
    if (!parent) return;

    svg.setAttribute('width', parent.offsetWidth.toString());
    svg.setAttribute('height', parent.offsetHeight.toString());
    svg.innerHTML = '';

    const drawConnection = (
      fromEl: HTMLElement | null,
      toEl: HTMLElement | null,
      color: string,
      opacity: number = 0.3,
      fromId?: string,
      toId?: string,
      relevance?: 'High' | 'Medium'
    ) => {
      if (!fromEl || !toEl || !parent) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      const x1 = fromRect.right - parentRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - parentRect.top;
      const x2 = toRect.left - parentRect.left;
      const y2 = toRect.top + toRect.height / 2 - parentRect.top;

      const curve = (x2 - x1) / 2;

      // Check if this connection involves the hovered card
      const isHovered = hoveredCard && (
        (hoveredCard.id === fromId) || (hoveredCard.id === toId)
      );

      // Adjust stroke width based on relevance (for worldview->outcome connections)
      let strokeWidth = '3';
      if (relevance === 'High') {
        strokeWidth = '4';
      } else if (relevance === 'Medium') {
        strokeWidth = '2.5';
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`);
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', isHovered ? '5' : strokeWidth);
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', isHovered ? '0.9' : opacity.toString());
      path.style.transition = 'all 0.2s ease';
      svg.appendChild(path);
    };

    // Draw lines from worldviews to outcomes
    if (selectedWorldviews.length > 0) {
      selectedWorldviews.forEach(wvId => {
        const wv = worldviews.find(w => w.id === wvId);
        if (!wv) return;

        relevantOutcomes.forEach(outcome => {
          const relevance = outcome.worldviewRelevance[wvId];
          if (relevance === 'High' || relevance === 'Medium') {
            drawConnection(
              worldviewRefs.current[wvId],
              outcomeRefs.current[outcome.id],
              wv.color || '#6B7280',
              relevance === 'High' ? 0.7 : 0.5,
              wvId,
              outcome.id,
              relevance as 'High' | 'Medium'
            );
          }
        });
      });
    }

    // Draw lines from outcomes to problems
    if (selectedOutcomes.length > 0) {
      selectedOutcomes.forEach(outcomeId => {
        relevantProblems.forEach(problem => {
          if (problem.affectedOutcomes?.includes(outcomeId)) {
            drawConnection(
              outcomeRefs.current[outcomeId],
              problemRefs.current[problem.id],
              '#64748B',
              0.6,
              outcomeId,
              problem.id
            );
          }
        });
      });
    }

    // Draw lines from problems to projects
    if (selectedProblems.length > 0) {
      selectedProblems.forEach(problemId => {
        relevantProjects.forEach(project => {
          if (project.addressedProblems?.includes(problemId)) {
            drawConnection(
              problemRefs.current[problemId],
              projectRefs.current[project.id],
              '#10B981',
              0.6,
              problemId,
              project.id
            );
          }
        });
      });
    }
  });

  // Update drawConnections ref whenever dependencies change
  useEffect(() => {
    drawConnections.current = () => {
      if (!connectionsSvgRef.current) return;

      const svg = connectionsSvgRef.current;
      const parent = svg.parentElement;
      if (!parent) return;

      svg.setAttribute('width', parent.offsetWidth.toString());
      svg.setAttribute('height', parent.offsetHeight.toString());
      svg.innerHTML = '';

      const drawConnection = (
        fromEl: HTMLElement | null,
        toEl: HTMLElement | null,
        color: string,
        opacity: number = 0.3,
        fromId?: string,
        toId?: string,
        relevance?: 'High' | 'Medium'
      ) => {
        if (!fromEl || !toEl || !parent) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        const x1 = fromRect.right - parentRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - parentRect.top;
        const x2 = toRect.left - parentRect.left;
        const y2 = toRect.top + toRect.height / 2 - parentRect.top;

        const curve = (x2 - x1) / 2;

        // Check if this connection involves the hovered card
        const isHovered = hoveredCard && (
          (hoveredCard.id === fromId) || (hoveredCard.id === toId)
        );

        // Adjust stroke width based on relevance (for worldview->outcome connections)
        let strokeWidth = '3';
        if (relevance === 'High') {
          strokeWidth = '4';
        } else if (relevance === 'Medium') {
          strokeWidth = '2.5';
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', isHovered ? '5' : strokeWidth);
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', isHovered ? '0.9' : opacity.toString());
        path.style.transition = 'all 0.2s ease';
        svg.appendChild(path);
      };

      // Draw lines from worldviews to outcomes
      if (selectedWorldviews.length > 0) {
        selectedWorldviews.forEach(wvId => {
          const wv = worldviews.find(w => w.id === wvId);
          if (!wv) return;

          relevantOutcomes.forEach(outcome => {
            const relevance = outcome.worldviewRelevance[wvId];
            if (relevance === 'High' || relevance === 'Medium') {
              drawConnection(
                worldviewRefs.current[wvId],
                outcomeRefs.current[outcome.id],
                wv.color || '#6B7280',
                relevance === 'High' ? 0.7 : 0.5,
                wvId,
                outcome.id,
                relevance as 'High' | 'Medium'
              );
            }
          });
        });
      }

      // Draw lines from outcomes to problems
      if (selectedOutcomes.length > 0) {
        selectedOutcomes.forEach(outcomeId => {
          relevantProblems.forEach(problem => {
            if (problem.affectedOutcomes?.includes(outcomeId)) {
              drawConnection(
                outcomeRefs.current[outcomeId],
                problemRefs.current[problem.id],
                '#64748B',
                0.6,
                outcomeId,
                problem.id
              );
            }
          });
        });
      }

      // Draw lines from problems to projects
      if (selectedProblems.length > 0) {
        selectedProblems.forEach(problemId => {
          relevantProjects.forEach(project => {
            if (project.addressedProblems?.includes(problemId)) {
              drawConnection(
                problemRefs.current[problemId],
                projectRefs.current[project.id],
                '#10B981',
                0.6,
                problemId,
                project.id
              );
            }
          });
        });
      }
    };
  }, [selectedWorldviews, selectedOutcomes, selectedProblems, relevantOutcomes, relevantProblems, relevantProjects, worldviews, hoveredCard]);

  // Draw connections when dependencies change
  useEffect(() => {
    drawConnections.current();
  }, [selectedWorldviews, selectedOutcomes, selectedProblems, relevantOutcomes, relevantProblems, relevantProjects, worldviews, hoveredCard]);

  // Add scroll listeners to update connections on scroll
  useEffect(() => {
    const columns = [
      worldviewColumnRef.current,
      outcomeColumnRef.current,
      problemColumnRef.current,
      projectColumnRef.current
    ].filter(Boolean);

    let rafId: number | null = null;

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Schedule the redraw for the next frame
      rafId = requestAnimationFrame(() => {
        drawConnections.current();
        rafId = null;
      });
    };

    columns.forEach(column => {
      column?.addEventListener('scroll', handleScroll, { passive: true });
    });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      columns.forEach(column => {
        column?.removeEventListener('scroll', handleScroll);
      });
    };
  }, [showOutcomes, showProblems, showProjects]); // Re-attach listeners when columns appear

  return (
    <section className="min-h-screen px-4 py-20" style={{ backgroundColor: LIGHT_BACKGROUNDS.primary }}>
      {/* Help Bar */}
      <div className="w-full mx-auto px-[10%] mb-8">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full p-4 rounded-xl border-2 transition-all hover:shadow-lg group"
          style={{
            backgroundColor: TEAL.lightTeal + '26',
            borderColor: TEAL.teal,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: TEAL.teal }}
              >
                <HelpCircle size={20} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base" style={{ color: TEAL.darkTeal }}>
                  How to Use Change Pathways
                </h3>
                <p className="text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                  Click here to learn how to explore connections from worldviews to projects
                </p>
              </div>
            </div>
            <ArrowRight
              size={24}
              className="transition-transform group-hover:translate-x-1"
              style={{ color: TEAL.teal }}
            />
          </div>
        </button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${TEAL.lightTeal}40, #FFFFFF)`,
                borderTop: `4px solid ${TEAL.teal}`,
                borderBottom: `1px solid ${LIGHT_BACKGROUNDS.border}`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: TEAL.teal }}
                >
                  <Lightbulb size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: PRIMARY.deepBrown }}>
                    How to Use Change Pathways
                  </h2>
                  <p className="mt-1" style={{ color: LIGHT_TEXT.secondary }}>
                    Trace your path from worldview to solution
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = LIGHT_BACKGROUNDS.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = LIGHT_BACKGROUNDS.tertiary}
              >
                <X size={24} style={{ color: PRIMARY.deepBrown }} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              {/* Overview */}
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: PRIMARY.deepBrown }}>
                  Trace Your Path from Worldview to Solution
                </h3>
                <p className="leading-relaxed max-w-3xl mx-auto" style={{ color: LIGHT_TEXT.secondary }}>
                  Change Pathways helps you explore how different worldviews lead to different outcomes, problems, and projects.
                  Click any step below to learn more.
                </p>
              </div>

              {/* Horizontal Flow Diagram */}
              <div className="py-8">
                {/* Flow boxes */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {/* Step 1: Worldviews */}
                  <button
                    onClick={() => setActiveHelpStep(1)}
                    className={`relative p-6 rounded-xl border-4 transition-all cursor-pointer hover:shadow-xl ${
                      activeHelpStep === 1 ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: activeHelpStep === 1 ? TEAL.lightTeal + '40' : LIGHT_BACKGROUNDS.card,
                      borderColor: activeHelpStep === 1 ? TEAL.teal : LIGHT_BACKGROUNDS.border,
                      borderWidth: activeHelpStep === 1 ? '4px' : '2px',
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                        style={{ backgroundColor: TEAL.teal }}
                      >
                        1
                      </div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: TEAL.darkTeal }}>
                        Worldviews
                      </h4>
                      <p className="text-xs" style={{ color: LIGHT_TEXT.tertiary }}>
                        Select perspective
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute -right-5 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: TEAL.teal }}
                    >
                      <ArrowRight size={32} strokeWidth={3} />
                    </div>
                  </button>

                  {/* Step 2: Outcomes */}
                  <button
                    onClick={() => setActiveHelpStep(2)}
                    className={`relative p-6 rounded-xl border-4 transition-all cursor-pointer hover:shadow-xl ${
                      activeHelpStep === 2 ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: activeHelpStep === 2 ? TEAL.mediumTeal + '40' : LIGHT_BACKGROUNDS.card,
                      borderColor: activeHelpStep === 2 ? TEAL.mediumTeal : LIGHT_BACKGROUNDS.border,
                      borderWidth: activeHelpStep === 2 ? '4px' : '2px',
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                        style={{ backgroundColor: TEAL.mediumTeal }}
                      >
                        2
                      </div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: TEAL.darkTeal }}>
                        Outcomes
                      </h4>
                      <p className="text-xs" style={{ color: LIGHT_TEXT.tertiary }}>
                        See relevant goals
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute -right-5 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: TEAL.mediumTeal }}
                    >
                      <ArrowRight size={32} strokeWidth={3} />
                    </div>
                  </button>

                  {/* Step 3: Problems */}
                  <button
                    onClick={() => setActiveHelpStep(3)}
                    className={`relative p-6 rounded-xl border-4 transition-all cursor-pointer hover:shadow-xl ${
                      activeHelpStep === 3 ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: activeHelpStep === 3 ? ORANGE_GOLD.lightGold + '40' : LIGHT_BACKGROUNDS.card,
                      borderColor: activeHelpStep === 3 ? ORANGE_GOLD.gold : LIGHT_BACKGROUNDS.border,
                      borderWidth: activeHelpStep === 3 ? '4px' : '2px',
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                        style={{ backgroundColor: ORANGE_GOLD.gold }}
                      >
                        3
                      </div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: ORANGE_GOLD.darkBrown }}>
                        Problems
                      </h4>
                      <p className="text-xs" style={{ color: LIGHT_TEXT.tertiary }}>
                        Find barriers
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="absolute -right-5 top-1/2 -translate-y-1/2 z-10"
                      style={{ color: ORANGE_GOLD.gold }}
                    >
                      <ArrowRight size={32} strokeWidth={3} />
                    </div>
                  </button>

                  {/* Step 4: Projects */}
                  <button
                    onClick={() => setActiveHelpStep(4)}
                    className={`relative p-6 rounded-xl border-4 transition-all cursor-pointer hover:shadow-xl ${
                      activeHelpStep === 4 ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      backgroundColor: activeHelpStep === 4 ? PRIMARY.gold + '40' : LIGHT_BACKGROUNDS.card,
                      borderColor: activeHelpStep === 4 ? PRIMARY.gold : LIGHT_BACKGROUNDS.border,
                      borderWidth: activeHelpStep === 4 ? '4px' : '2px',
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                        style={{ backgroundColor: PRIMARY.gold }}
                      >
                        4
                      </div>
                      <h4 className="font-bold text-sm mb-1" style={{ color: ORANGE_GOLD.darkBrown }}>
                        Projects
                      </h4>
                      <p className="text-xs" style={{ color: LIGHT_TEXT.tertiary }}>
                        Discover solutions
                      </p>
                    </div>
                  </button>
                </div>

                {/* Detail Panel for Active Step */}
                <div
                  className="p-6 rounded-xl border-l-4 transition-all"
                  style={{
                    backgroundColor: activeHelpStep === 1 ? TEAL.lightTeal + '20'
                      : activeHelpStep === 2 ? TEAL.mediumTeal + '20'
                      : activeHelpStep === 3 ? ORANGE_GOLD.lightGold + '40'
                      : PRIMARY.gold + '20',
                    borderColor: activeHelpStep === 1 ? TEAL.teal
                      : activeHelpStep === 2 ? TEAL.mediumTeal
                      : activeHelpStep === 3 ? ORANGE_GOLD.gold
                      : PRIMARY.gold,
                  }}
                >
                  {/* Step 1 Details */}
                  {activeHelpStep === 1 && (
                    <div>
                      <h4 className="text-xl font-bold mb-3" style={{ color: TEAL.darkTeal }}>
                        Step 1: Start with a Worldview
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                        Click on a worldview card to select a fundamental perspective on how psychedelics should be used in society.
                        Each worldview represents a distinct philosophy with its own values and approach.
                      </p>
                      <div className="flex items-start gap-2 text-sm mb-3" style={{ color: TEAL.teal }}>
                        <MousePointer size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Try clicking: "Medical/Clinical" or "Indigenous/Traditional"</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                        <span style={{ color: TEAL.teal }}>•</span>
                        <span>You can select multiple worldviews to compare different perspectives</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Details */}
                  {activeHelpStep === 2 && (
                    <div>
                      <h4 className="text-xl font-bold mb-3" style={{ color: TEAL.darkTeal }}>
                        Step 2: See Relevant Outcomes
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                        After selecting a worldview, the second column reveals the 5-year outcomes most relevant to that perspective.
                        These are the measurable goals that align with your chosen worldview.
                      </p>
                      <div className="flex items-start gap-2 text-sm mb-3" style={{ color: TEAL.mediumTeal }}>
                        <ArrowRight size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Outcomes are filtered by "High" and "Medium" relevance to your worldview</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                        <span style={{ color: TEAL.mediumTeal }}>•</span>
                        <span>Select one or more outcomes to continue exploring</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Details */}
                  {activeHelpStep === 3 && (
                    <div>
                      <h4 className="text-xl font-bold mb-3" style={{ color: ORANGE_GOLD.darkBrown }}>
                        Step 3: Discover Blocking Problems
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                        The third column shows problems and barriers that are preventing your selected outcomes from being achieved.
                        Each problem is color-coded by category.
                      </p>
                      <div className="flex items-start gap-2 text-sm mb-3" style={{ color: ORANGE_GOLD.bronze }}>
                        <Info size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Click the info icon (ℹ️) on any card to see detailed information</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                        <span style={{ color: ORANGE_GOLD.gold }}>•</span>
                        <span>Problems show their urgency and feasibility scores to help prioritize</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Details */}
                  {activeHelpStep === 4 && (
                    <div>
                      <h4 className="text-xl font-bold mb-3" style={{ color: ORANGE_GOLD.darkBrown }}>
                        Step 4: Explore Active Projects
                      </h4>
                      <p className="mb-4 leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                        The final column displays real-world projects that are working to solve your selected problems.
                        Click on any project to see full details including organizations involved, status, and impact.
                      </p>
                      <div className="flex items-start gap-2 text-sm mb-3" style={{ color: PRIMARY.gold }}>
                        <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="font-medium">Projects show their current status: Active, Proposed, or Planning</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                        <span style={{ color: PRIMARY.gold }}>•</span>
                        <span>Click projects to learn about organizations, timelines, and how to get involved</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-xl" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary, border: `2px dashed ${LIGHT_BACKGROUNDS.border}` }}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: PRIMARY.deepBrown }}>
                  <Lightbulb size={20} style={{ color: PRIMARY.gold }} />
                  Pro Tips
                </h3>
                <ul className="space-y-2" style={{ color: LIGHT_TEXT.secondary }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: TEAL.teal }}>•</span>
                    <span>Select multiple items at each stage to see overlapping connections and discover synergies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: TEAL.teal }}>•</span>
                    <span>Visual connection lines show relationships between your selections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: TEAL.teal }}>•</span>
                    <span>Click the info (ℹ️) icon on any card to open a detailed modal with full information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: TEAL.teal }}>•</span>
                    <span>Watch the active filters at the top to track your current path through the framework</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: TEAL.teal }}>•</span>
                    <span>Modals link to each other - explore the ecosystem by clicking related items within any detail view</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 flex justify-end" style={{ borderTop: `1px solid ${LIGHT_BACKGROUNDS.border}` }}>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-3 rounded-xl font-bold transition-colors"
                style={{ backgroundColor: TEAL.teal, color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = TEAL.darkTeal}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = TEAL.teal}
              >
                Got It! Let's Explore
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${TEAL.lightTeal} ${LIGHT_BACKGROUNDS.tertiary};
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${LIGHT_BACKGROUNDS.tertiary};
          border-radius: 10px;
          margin: 4px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, ${TEAL.teal} 0%, ${TEAL.mediumTeal} 100%);
          border-radius: 10px;
          border: 2px solid ${LIGHT_BACKGROUNDS.tertiary};
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, ${TEAL.darkTeal} 0%, ${TEAL.teal} 100%);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes counterBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .animate-card {
          animation: fadeIn 0.3s ease-out;
        }

        .card-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-2px);
        }

        .column-slide-in {
          animation: slideInFromRight 0.4s ease-out;
        }

        .counter-update {
          animation: counterBounce 0.3s ease-out;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 10;
        }
      `}</style>
      <div className="w-full mx-auto px-[10%]">
        {/* Instructions when nothing selected - compact design */}
        {!showOutcomes && (
          <div className="mb-6 p-4 rounded-xl border-l-4 bg-white shadow-sm" style={{ borderColor: TEAL.teal }}>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: TEAL.lightTeal }}>
                <Eye size={24} style={{ color: TEAL.teal }} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1" style={{ color: TEAL.darkTeal }}>
                  Start Your Journey
                </h3>
                <p className="text-sm" style={{ color: LIGHT_TEXT.secondary }}>
                  Select a worldview below to explore relevant outcomes, problems, and projects
                </p>
              </div>
              <div className="flex-shrink-0">
                <Sparkles size={20} style={{ color: TEAL.teal }} className="animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Active filters banner */}
        {(selectedWorldviews.length > 0 || selectedOutcomes.length > 0 || selectedProblems.length > 0) && (
          <div className="mb-6 p-4 border-2 rounded-xl animate-slideIn" style={{ backgroundColor: TEAL.lightTeal + '26', borderColor: TEAL.teal }}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: TEAL.teal }} />
                <span className="font-bold text-sm" style={{ color: TEAL.darkTeal }}>Your Path:</span>
              </div>
              <button
                onClick={() => {
                  setSelectedWorldviews([]);
                  setSelectedOutcomes([]);
                  setSelectedProblems([]);
                }}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                style={{ backgroundColor: LIGHT_BACKGROUNDS.card, color: TEAL.darkTeal, border: `1px solid ${TEAL.lightTeal}` }}
              >
                Clear All
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {selectedWorldviews.map(wvId => {
                const wv = worldviews.find(w => w.id === wvId);
                if (!wv) return null;
                return (
                  <button
                    key={wvId}
                    onClick={() => toggleWorldview(wvId)}
                    className="group px-3 py-1.5 rounded-full text-white font-semibold shadow-sm transition-all hover:scale-105 hover:shadow-md flex items-center gap-1"
                    style={{ backgroundColor: wv.color || '#6B7280' }}
                    title={`${wv.name} - Click to remove`}
                  >
                    <span>{wv.shortName || wv.name}</span>
                    <X size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}

              {selectedWorldviews.length > 0 && selectedOutcomes.length > 0 && (
                <ArrowRight size={20} style={{ color: TEAL.teal }} strokeWidth={3} />
              )}

              {selectedOutcomes.map(oId => {
                const outcome = outcomes.find(o => o.id === oId);
                if (!outcome) return null;
                return (
                  <button
                    key={oId}
                    onClick={() => toggleOutcome(oId)}
                    className="group px-3 py-1.5 rounded-full text-white font-medium text-xs shadow-sm transition-all hover:scale-105 hover:shadow-md flex items-center gap-1"
                    style={{ backgroundColor: TEAL.mediumTeal }}
                    title={`${outcome.name} - Click to remove`}
                  >
                    <span>{outcome.name.length > 40 ? outcome.name.substring(0, 40) + '...' : outcome.name}</span>
                    <X size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}

              {selectedOutcomes.length > 0 && selectedProblems.length > 0 && (
                <ArrowRight size={20} style={{ color: ORANGE_GOLD.gold }} strokeWidth={3} />
              )}

              {selectedProblems.map(pId => {
                const problem = problems.find(p => p.id === pId);
                if (!problem) return null;
                return (
                  <button
                    key={pId}
                    onClick={() => toggleProblem(pId)}
                    className="group px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-sm transition-all hover:scale-105 hover:shadow-md flex items-center gap-1"
                    style={{ backgroundColor: ORANGE_GOLD.gold }}
                    title={`${problem.name} - Click to remove`}
                  >
                    <span>{problem.name.length > 40 ? problem.name.substring(0, 40) + '...' : problem.name}</span>
                    <X size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Swimlanes Grid */}
        <div
          className="grid gap-8 relative overflow-x-auto pb-4"
          style={{ gridTemplateColumns: gridCols }}
        >
          {/* SVG Connection Lines */}
          <svg
            ref={connectionsSvgRef}
            className="absolute top-0 left-0 pointer-events-none w-full h-full"
            style={{ zIndex: 0 }}
          />

          {/* Column 1: Worldviews (Always visible) */}
          <div className="space-y-3 relative" style={{ zIndex: 1 }}>
            <div className="sticky-header rounded-t-lg px-3 py-3 -mx-1 border-b-2" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary, borderColor: LIGHT_BACKGROUNDS.border }}>
              <div className="flex items-center gap-2">
                <Eye size={18} style={{ color: TEAL.teal }} />
                <h3 className="font-bold text-base uppercase tracking-wide" style={{ color: LIGHT_TEXT.primary }}>
                  Worldviews
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold counter-update" key={worldviews.length} style={{ backgroundColor: TEAL.teal, color: 'white' }}>
                  {worldviews.length}
                </span>
              </div>
              {selectedWorldviews.length === 0 && (
                <p className="text-xs mt-1 font-medium flex items-center gap-1" style={{ color: LIGHT_TEXT.secondary }}>
                  <Sparkles size={12} style={{ color: TEAL.teal }} />
                  Select worldviews to see their outcomes
                </p>
              )}
            </div>
            <div ref={worldviewColumnRef} className="space-y-3 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {worldviews.map(wv => {
                const isSelected = selectedWorldviews.includes(wv.id);
                const shouldDim = selectedWorldviews.length > 0 && !isSelected;

                return (
                <div key={wv.id} className="relative group" style={{
                  opacity: shouldDim ? 0.3 : 1,
                  transition: 'opacity 0.3s ease'
                }}>
                  <button
                    ref={el => worldviewRefs.current[wv.id] = el}
                    onClick={() => toggleWorldview(wv.id)}
                    onMouseEnter={() => setHoveredCard({ type: 'worldview', id: wv.id })}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`w-full text-left p-4 rounded-lg border-2 card-hover animate-card ${
                      isSelected
                        ? 'shadow-lg ring-2 ring-offset-2'
                        : 'border-transparent bg-white hover:shadow-md'
                    }`}
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: wv.color || '#6B7280',
                      borderTopColor: isSelected ? PRIMARY.deepBrown : 'transparent',
                      borderRightColor: isSelected ? PRIMARY.deepBrown : 'transparent',
                      borderBottomColor: isSelected ? PRIMARY.deepBrown : 'transparent',
                      boxShadow: isSelected
                        ? `0 10px 25px -5px ${wv.color}30`
                        : undefined,
                      ['--tw-ring-color' as any]: PRIMARY.deepBrown
                    }}
                  >
                    <div className="font-semibold text-sm pr-16 break-words" style={{ color: LIGHT_TEXT.primary }}>
                      {wv.shortName || wv.name}
                    </div>
                    <div className="text-xs mt-1 line-clamp-2 pr-16" style={{ color: LIGHT_TEXT.tertiary }}>
                      {wv.tagline}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorldview(wv);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full transition-all z-10 pointer-events-auto hover:opacity-80"
                    style={{
                      minHeight: '36px',
                      minWidth: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: TEAL.lightTeal
                    }}
                    title="Learn more"
                  >
                    <Info size={16} style={{ color: TEAL.darkTeal }} />
                  </button>
                </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Outcomes (Show when worldviews selected) */}
          {showOutcomes && (
            <div className="space-y-3 relative column-slide-in" style={{ zIndex: 1 }}>
              <div className="sticky-header rounded-t-lg px-3 py-3 -mx-1 border-b-2" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary, borderColor: LIGHT_BACKGROUNDS.border }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Target size={18} style={{ color: TEAL.mediumTeal }} />
                      <h3 className="font-bold text-base uppercase tracking-wide" style={{ color: LIGHT_TEXT.primary }}>
                        5-Year Outcomes
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold counter-update" key={relevantOutcomes.length} style={{ backgroundColor: TEAL.mediumTeal, color: 'white' }}>
                        {relevantOutcomes.length}
                      </span>
                    </div>
                    {selectedOutcomes.length === 0 && (
                      <p className="text-xs mt-1 font-medium flex items-center gap-1" style={{ color: LIGHT_TEXT.secondary }}>
                        <Sparkles size={12} style={{ color: TEAL.mediumTeal }} />
                        Select outcomes to see related problems
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      multiple
                      value={relevanceFilter}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setRelevanceFilter(selected);
                      }}
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium hover:border-slate-400 focus:outline-none focus:ring-2 cursor-pointer"
                      style={{ ['--tw-ring-color' as any]: TEAL.teal, height: '24px', appearance: 'none', paddingRight: '20px' }}
                      onClick={(e) => {
                        // Create a custom multi-select experience with checkboxes
                        const select = e.currentTarget;
                        const rect = select.getBoundingClientRect();
                        const dropdown = document.createElement('div');
                        dropdown.className = 'absolute top-full right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50 py-2 min-w-[160px]';
                        dropdown.innerHTML = `
                          <div class="px-3 py-1 text-xs font-semibold text-slate-600 border-b border-slate-200">Filter by Relevance</div>
                          ${['High', 'Medium', 'Low'].map(level => `
                            <label class="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">
                              <input type="checkbox" ${relevanceFilter.includes(level) ? 'checked' : ''}
                                     value="${level}" class="rounded text-teal-600 focus:ring-teal-500">
                              <span class="flex-1">${level}</span>
                              <span class="w-3 h-3 rounded-full ${
                                level === 'High' ? 'bg-green-600' :
                                level === 'Medium' ? 'bg-yellow-600' :
                                'bg-orange-600'
                              }"></span>
                            </label>
                          `).join('')}
                        `;

                        // Position and add dropdown
                        select.parentElement?.appendChild(dropdown);

                        // Handle checkbox changes
                        dropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                          checkbox.addEventListener('change', (ce) => {
                            const target = ce.target as HTMLInputElement;
                            toggleRelevance(target.value);
                          });
                        });

                        // Close on click outside
                        const closeDropdown = (ce: MouseEvent) => {
                          if (!dropdown.contains(ce.target as Node)) {
                            dropdown.remove();
                            document.removeEventListener('click', closeDropdown);
                          }
                        };
                        setTimeout(() => document.addEventListener('click', closeDropdown), 0);

                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <option value="" disabled>
                        {relevanceFilter.length === 0 ? 'All' : relevanceFilter.length === 3 ? 'All' : relevanceFilter.join(', ')}
                      </option>
                    </select>
                    <svg className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div ref={outcomeColumnRef} className="space-y-3 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                {relevantOutcomes.map(outcome => {
                  const isSelected = selectedOutcomes.includes(outcome.id);
                  const shouldDim = selectedOutcomes.length > 0 && !isSelected;

                  return (
                  <div key={outcome.id} className="relative group" style={{
                    opacity: shouldDim ? 0.3 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    <button
                      ref={el => outcomeRefs.current[outcome.id] = el}
                      onClick={() => toggleOutcome(outcome.id)}
                      onMouseEnter={() => setHoveredCard({ type: 'outcome', id: outcome.id })}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`w-full text-left p-4 rounded-lg border-2 card-hover animate-card ${
                        isSelected
                          ? 'shadow-lg ring-2 ring-offset-2'
                          : 'border-transparent bg-white hover:shadow-md'
                      }`}
                      style={isSelected ? {
                        borderColor: PRIMARY.deepBrown,
                        ['--tw-ring-color' as any]: PRIMARY.deepBrown
                      } : undefined}
                    >
                      <div className="font-semibold text-sm pr-16 break-words" style={{ color: LIGHT_TEXT.primary }}>
                        {outcome.name}
                      </div>
                      <div className="text-xs mt-1 line-clamp-2 pr-16" style={{ color: LIGHT_TEXT.secondary }}>
                        {outcome.shortDescription || outcome.description}
                      </div>
                      {selectedWorldviews.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {selectedWorldviews.map(wvId => {
                            const wv = worldviews.find(w => w.id === wvId);
                            if (!wv) return null;
                            const relevance = outcome.worldviewRelevance[wvId];
                            if (relevance === 'High' || relevance === 'Medium') {
                              return (
                                <span
                                  key={wvId}
                                  className="text-xs px-2 py-0.5 rounded font-medium"
                                  style={{
                                    backgroundColor: relevance === 'High' ? wv.color + '66' : wv.color + '33',
                                    color: wv.color || '#6B7280'
                                  }}
                                >
                                  {relevance}
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOutcome(outcome);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full transition-all z-10 hover:opacity-80"
                      style={{
                        minHeight: '36px',
                        minWidth: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: TEAL.lightTeal
                      }}
                      title="Learn more"
                    >
                      <Info size={16} style={{ color: TEAL.darkTeal }} />
                    </button>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Column 3: Problems (Show when outcomes selected) */}
          {showProblems && (
            <div className="space-y-3 relative column-slide-in" style={{ zIndex: 1 }}>
              <div className="sticky-header rounded-t-lg px-3 py-3 -mx-1 border-b-2" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary, borderColor: LIGHT_BACKGROUNDS.border }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} style={{ color: ORANGE_GOLD.gold }} />
                  <h3 className="font-bold text-base uppercase tracking-wide" style={{ color: LIGHT_TEXT.primary }}>
                    Problems & Barriers
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold counter-update" key={relevantProblems.length} style={{ backgroundColor: ORANGE_GOLD.gold, color: 'white' }}>
                    {relevantProblems.length}
                  </span>
                </div>
                {selectedProblems.length === 0 && relevantProblems.length > 0 && (
                  <p className="text-xs mt-1 font-medium flex items-center gap-1" style={{ color: LIGHT_TEXT.secondary }}>
                    <Sparkles size={12} style={{ color: ORANGE_GOLD.gold }} />
                    Select problems to see addressing projects
                  </p>
                )}
              </div>
              <div ref={problemColumnRef} className="space-y-3 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                {relevantProblems.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed" style={{ borderColor: LIGHT_BACKGROUNDS.border }}>
                    <p className="text-sm" style={{ color: LIGHT_TEXT.tertiary }}>No problems blocking selected outcomes</p>
                  </div>
                ) : (
                  relevantProblems.map(problem => {
                  const category = problemCategories.find(c =>
                    c.id === problem.category
                  );
                  const isSelected = selectedProblems.includes(problem.id);
                  const shouldDim = selectedProblems.length > 0 && !isSelected;

                  return (
                    <div key={problem.id} className="relative group" style={{
                      opacity: shouldDim ? 0.3 : 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <button
                        ref={el => problemRefs.current[problem.id] = el}
                        onClick={() => toggleProblem(problem.id)}
                        onMouseEnter={() => setHoveredCard({ type: 'problem', id: problem.id })}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`w-full text-left p-4 rounded-lg border-2 card-hover animate-card ${
                          isSelected
                            ? 'shadow-lg ring-2 ring-offset-2'
                            : 'border-transparent bg-white hover:shadow-md'
                        }`}
                        style={isSelected ? {
                          borderColor: PRIMARY.deepBrown,
                          ['--tw-ring-color' as any]: PRIMARY.deepBrown
                        } : undefined}
                      >
                        <div className="flex-1 min-w-0 pr-16">
                          <div className="font-semibold text-sm mb-2 break-words" style={{ color: LIGHT_TEXT.primary }}>
                            {problem.name}
                          </div>
                          {category && (
                            <span className={getCategoryBadgeClasses(category.problemCategoryName)}>
                              {category.problemCategoryName}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProblem(problem);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full transition-all z-10 hover:opacity-80"
                        style={{
                          minHeight: '36px',
                          minWidth: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: TEAL.lightTeal
                        }}
                        title="Learn more"
                      >
                        <Info size={16} style={{ color: TEAL.darkTeal }} />
                      </button>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          )}

          {/* Column 4: Projects (Show when problems selected) */}
          {showProjects && (
            <div className="space-y-3 relative column-slide-in" style={{ zIndex: 1 }}>
              <div className="sticky-header rounded-t-lg px-3 py-3 -mx-1 border-b-2" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary, borderColor: LIGHT_BACKGROUNDS.border }}>
                <div className="flex items-center gap-2">
                  <Rocket size={18} style={{ color: PRIMARY.gold }} />
                  <h3 className="font-bold text-base uppercase tracking-wide" style={{ color: LIGHT_TEXT.primary }}>
                    Current Projects
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold counter-update" key={relevantProjects.length} style={{ backgroundColor: PRIMARY.gold, color: 'white' }}>
                    {relevantProjects.length}
                  </span>
                </div>
              </div>
              <div ref={projectColumnRef} className="space-y-2 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                {relevantProjects.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed" style={{ borderColor: LIGHT_BACKGROUNDS.border }}>
                    <p className="text-sm" style={{ color: LIGHT_TEXT.tertiary }}>No projects addressing selected problems</p>
                  </div>
                ) : (
                  relevantProjects.map(project => {
                  const isConnected = selectedProblems.length === 0 ||
                    selectedProblems.some(probId =>
                      project.addressedProblems?.includes(probId)
                    );

                  return (
                    <button
                      key={project.id}
                      ref={el => projectRefs.current[project.id] = el as any}
                      onClick={() => setSelectedProject(project)}
                      onMouseEnter={() => setHoveredCard({ type: 'project', id: project.id })}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="w-full text-left p-3 rounded-lg border-2 border-transparent bg-white card-hover animate-card hover:shadow-md cursor-pointer"
                      style={{
                        opacity: !isConnected ? 0.3 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-sm flex-1" style={{ color: LIGHT_TEXT.primary }}>
                          {project.name}
                        </div>
                        {project.status && (
                          <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${
                            project.status === 'Active' || project.status === 'In Progress'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : project.status === 'Proposed' || project.status === 'Planning'
                              ? 'bg-blue-100 text-gray-800 border border-blue-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          }`}>
                            {project.status}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <div className="text-xs mt-2 line-clamp-2" style={{ color: LIGHT_TEXT.secondary }}>
                          {project.description}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modals */}
      {selectedWorldview && (
        <WorldviewDetailModal
          worldview={selectedWorldview}
          onClose={() => setSelectedWorldview(null)}
        />
      )}
      {selectedOutcome && (
        <OutcomeDetailModal
          outcome={selectedOutcome}
          worldviews={worldviews}
          problems={problems}
          onClose={() => setSelectedOutcome(null)}
          onProblemClick={(problem) => setSelectedProblem(problem)}
          onWorldviewClick={(worldview) => setSelectedWorldview(worldview)}
        />
      )}
      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          problemCategories={problemCategories}
          outcomes={outcomes}
          projects={projects}
          onClose={() => setSelectedProblem(null)}
          onProjectClick={(project) => {
            setSelectedProject(project);
            setSelectedProblem(null);
          }}
        />
      )}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          problems={problems}
          outcomes={outcomes}
          worldviews={worldviews}
          onClose={() => setSelectedProject(null)}
          onProblemClick={(problem) => {
            setSelectedProblem(problem);
            setSelectedProject(null);
          }}
          onOutcomeClick={(outcome) => {
            setSelectedOutcome(outcome);
            setSelectedProject(null);
          }}
          onWorldviewClick={(worldview) => {
            setSelectedWorldview(worldview);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Floating Reset All Button */}
      {(selectedWorldviews.length > 0 || selectedOutcomes.length > 0 || selectedProblems.length > 0) && (
        <button
          onClick={clearAllSelections}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2"
          style={{ backgroundColor: ORANGE_GOLD.amber }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = ORANGE_GOLD.bronze}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ORANGE_GOLD.amber}
          title="Clear all selections and start over"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All
        </button>
      )}
    </section>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { AppWorldview, AppOutcome, AppProblem, AppProblemCategory, AppProject } from '@/lib/data-transformer';
import WorldviewDetailModal from './Modals/WorldviewDetailModal';
import OutcomeDetailModal from './Modals/OutcomeDetailModal';
import ProblemDetailModal from './Modals/ProblemDetailModal';
import ProjectDetailModal from './Modals/ProjectDetailModal';
import {
  getProposeWorldviewUrl,
  getProposeOutcomeUrl,
  getProposeeProblemUrl,
  getSubmitProjectUrl
} from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, LIGHT_TEXT, NEUTRALS, PRIMARY, TEAL } from '@/lib/brand-colors';
import Tooltip from './Tooltip';

interface StoryModeProps {
  worldviews: AppWorldview[];
  outcomes: AppOutcome[];
  problems: AppProblem[];
  problemCategories: AppProblemCategory[];
  projects: AppProject[];
}

export default function StoryMode({
  worldviews,
  outcomes,
  problems,
  problemCategories,
  projects,
}: StoryModeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedWorldview, setSelectedWorldview] = useState<AppWorldview | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<AppOutcome | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<AppProblem | null>(null);
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Extract unique organizations from projects
  const organizations = useMemo(() => {
    const orgNames = new Set<string>();
    projects.forEach(p => {
      p.organizations?.forEach(org => orgNames.add(org));
    });
    return Array.from(orgNames).sort().map(name => ({ id: name, name }));
  }, [projects]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight = contentRef.current.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group worldviews by cluster
  const clusters = Array.from(new Set(worldviews.map(wv => wv.cluster))).filter((c): c is string => typeof c === 'string' && c.length > 0);
  const worldviewsByCluster = clusters.map((clusterName) => {
    const clusterWorldviews = worldviews.filter((wv) => wv.cluster === clusterName);
    const clusterDefinition = clusterWorldviews[0]?.clusterDefinition || '';
    return {
      cluster: {
        name: clusterName,
        id: clusterName.toLowerCase(),
        clusterDefinition
      },
      worldviews: clusterWorldviews,
    };
  });

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50" style={{ backgroundColor: LIGHT_BACKGROUNDS.tertiary }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${scrollProgress}%`, backgroundColor: '#317E6D' }}
        />
      </div>

      <div ref={contentRef} className="relative">
        {/* Section 1: Worldviews */}
        <section className="min-h-screen px-6 py-20" style={{ backgroundColor: LIGHT_BACKGROUNDS.primary }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold" style={{ color: PRIMARY.deepBrown }}>
                  Seven Worldviews
                </h2>
                <Tooltip
                  content="A worldview is a fundamental perspective or philosophy about how psychedelics should be used and integrated into society. Each represents a distinct approach with its own values and methods."
                  iconSize={20}
                />
              </div>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                Different perspectives on how psychedelics can help heal individuals and society
              </p>
              <div className="mt-6">
                <a
                  href={getProposeWorldviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Propose New Worldview
                </a>
              </div>
            </div>

            {/* Cluster groups */}
            <div className="space-y-16">
              {worldviewsByCluster.map(({ cluster, worldviews: clusterWorldviews }) => (
                <div key={cluster.id} className="animate-slideUp">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: TEAL.teal }}>
                    {cluster.name}
                  </h3>
                  {cluster.clusterDefinition && (
                    <p className="mb-8 max-w-4xl" style={{ color: LIGHT_TEXT.secondary }}>
                      {cluster.clusterDefinition}
                    </p>
                  )}

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clusterWorldviews.map((worldview) => (
                      <button
                        key={worldview.id}
                        onClick={() => setSelectedWorldview(worldview)}
                        className="group relative rounded-2xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl"
                        style={{
                          backgroundColor: LIGHT_BACKGROUNDS.card,
                          borderTop: `4px solid ${worldview.color || '#6B7280'}`,
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                            style={{
                              backgroundColor: worldview.color || '#6B7280',
                            }}
                          >
                            {worldview.shortName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors" style={{ color: PRIMARY.deepBrown }}>
                              {worldview.shortName || worldview.name}
                            </h4>
                            {worldview.tagline && (
                              <p className="text-sm line-clamp-2" style={{ color: LIGHT_TEXT.secondary }}>
                                {worldview.tagline}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Click indicator */}
                        <div className="mt-4 flex items-center gap-2 text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Learn more</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Outcomes */}
        <section className="min-h-screen px-6 py-20" style={{
          backgroundColor: LIGHT_BACKGROUNDS.secondary
        }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold" style={{ color: PRIMARY.deepBrown }}>
                  5-Year Outcome Goals
                </h2>
                <Tooltip
                  content="Specific, measurable goals the ecosystem is working toward over the next 5 years. These are the positive changes we want to see in the world."
                  iconSize={20}
                />
              </div>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                What we hope to achieve together across the psychedelic ecosystem
              </p>
              <div className="mt-6">
                <a
                  href={getProposeOutcomeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Propose New Outcome
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {outcomes.map((outcome) => (
                <button
                  key={outcome.id}
                  onClick={() => setSelectedOutcome(outcome)}
                  className="group rounded-2xl p-8 text-left transition-all hover:scale-105 hover:shadow-xl border hover:border-teal-500"
                  style={{
                    backgroundColor: LIGHT_BACKGROUNDS.card,
                    borderColor: NEUTRALS.border
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-400 font-bold">{outcome.outcomeId}</span>
                    </div>
                    <h4 className="text-xl font-bold group-hover:text-teal-400 transition-colors flex-1" style={{ color: PRIMARY.deepBrown }}>
                      {outcome.name}
                    </h4>
                  </div>

                  {outcome.shortDescription && (
                    <p className="mb-4 line-clamp-3" style={{ color: LIGHT_TEXT.secondary }}>
                      {outcome.shortDescription}
                    </p>
                  )}

                  {/* Click indicator */}
                  <div className="flex items-center gap-2 text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Problems */}
        <section className="min-h-screen px-6 py-20" style={{ backgroundColor: LIGHT_BACKGROUNDS.secondary }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold" style={{ color: PRIMARY.deepBrown }}>
                  Problems to Solve
                </h2>
                <Tooltip
                  content="Specific obstacles, challenges, or gaps that prevent us from achieving our outcome goals. Projects aim to address these problems."
                  iconSize={20}
                />
              </div>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                Key challenges blocking progress toward our shared outcomes
              </p>
              <div className="mt-6">
                <a
                  href={getProposeeProblemUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Propose New Problem
                </a>
              </div>
            </div>

            <div className="space-y-12">
              {problemCategories.map((category) => {
                const categoryProblems = problems.filter((p) =>
                  p.category === category.id
                );

                if (categoryProblems.length === 0) return null;

                return (
                  <div key={category.id} className="animate-slideUp">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: '#F97316' }}>
                      {category.problemCategoryName}
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryProblems.map((problem) => {
                        const projectCount = projects.filter(proj =>
                          proj.addressedProblems?.includes(problem.id)
                        ).length;

                        return (
                          <button
                            key={problem.id}
                            onClick={() => setSelectedProblem(problem)}
                            className="group rounded-xl p-5 text-left transition-all hover:scale-105 border hover:border-orange-500"
                            style={{
                              backgroundColor: LIGHT_BACKGROUNDS.card,
                              borderColor: NEUTRALS.border
                            }}
                          >
                            <h4 className="text-base font-bold mb-2 group-hover:text-orange-400 transition-colors line-clamp-2" style={{ color: PRIMARY.deepBrown }}>
                              {problem.name}
                            </h4>

                            {problem.description && (
                              <p className="text-sm mb-3 line-clamp-2" style={{ color: LIGHT_TEXT.secondary }}>
                                {problem.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-medium ${
                                  projectCount > 0 ? 'text-yellow-500' : 'text-slate-500'
                                }`}
                              >
                                {projectCount > 0
                                  ? `${projectCount} project${projectCount === 1 ? '' : 's'} addressing`
                                  : 'No projects yet'}
                              </span>

                              <div className="flex items-center gap-1 text-orange-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>View</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 4: Projects */}
        <section className="min-h-screen px-6 py-20" style={{
          backgroundColor: LIGHT_BACKGROUNDS.primary
        }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-4xl md:text-5xl font-bold" style={{ color: PRIMARY.deepBrown }}>
                  Projects in Action
                </h2>
                <Tooltip
                  content="Active initiatives, programs, or efforts by organizations working to solve specific problems and achieve outcomes."
                  iconSize={20}
                />
              </div>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: LIGHT_TEXT.secondary }}>
                Real initiatives addressing these challenges across the ecosystem
              </p>
              <div className="mt-6">
                <a
                  href={getSubmitProjectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-all hover:scale-105"
                  style={{ backgroundColor: '#E58D9B' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit New Project
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.addressedProblems && p.addressedProblems.length > 0)
                .slice(0, 12) // Show first 12 for story mode
                .map((project) => {
                  const projectProblems = problems.filter((prob) =>
                    project.addressedProblems?.includes(prob.id)
                  );

                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group rounded-2xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl border"
                      style={{
                        backgroundColor: LIGHT_BACKGROUNDS.card,
                        borderColor: NEUTRALS.border
                      }}
                    >
                      <h4 className="text-lg font-bold mb-3 transition-colors line-clamp-2" style={{ color: PRIMARY.deepBrown }}>
                        {project.name}
                      </h4>

                      {project.description && (
                        <p className="text-sm mb-4 line-clamp-3" style={{ color: LIGHT_TEXT.secondary }}>
                          {project.description}
                        </p>
                      )}

                      {projectProblems.length > 0 && (
                        <div className="space-y-1 mb-4">
                          <p className="text-xs font-medium uppercase" style={{ color: NEUTRALS.tertiary }}>Addressing:</p>
                          <div className="flex flex-wrap gap-2">
                            {projectProblems.slice(0, 3).map((prob) => (
                              <span
                                key={prob.id}
                                className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-medium"
                                title={prob.name}
                              >
                                {prob.name.length > 30 ? prob.name.substring(0, 30) + '...' : prob.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Click indicator */}
                      <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#E58D9B' }}>
                        <span>View project</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg" style={{ color: LIGHT_TEXT.secondary }}>
                Explore all {projects.filter((p) => p.addressedProblems && p.addressedProblems.length > 0).length} projects
                in the <span className="font-bold" style={{ color: '#E58D9B' }}>Project Explorer</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
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
          onProblemClick={(problem) => {
            setSelectedOutcome(null);
            setSelectedProblem(problem);
          }}
          onWorldviewClick={(worldview) => {
            setSelectedOutcome(null);
            setSelectedWorldview(worldview);
          }}
        />
      )}

      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          projects={projects}
          outcomes={outcomes}
          problemCategories={problemCategories}
          onClose={() => setSelectedProblem(null)}
          onProjectClick={(project) => {
            setSelectedProblem(null);
            setSelectedProject(project);
          }}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          problems={problems}
          organizations={organizations}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

'use client';

import type { AppProblem, AppProject, AppOutcome, AppProblemCategory } from '@/lib/data-transformer';
import { useEffect } from 'react';
import { getEditProblemUrl } from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, NEUTRALS, PRIMARY } from '@/lib/brand-colors';

interface ProblemDetailModalProps {
  problem: AppProblem;
  projects: AppProject[];
  outcomes: AppOutcome[];
  problemCategories: AppProblemCategory[];
  onClose: () => void;
  onProjectClick: (project: AppProject) => void;
}

export default function ProblemDetailModal({
  problem,
  projects,
  outcomes,
  problemCategories,
  onClose,
  onProjectClick,
}: ProblemDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Find category
  const category = problemCategories.find((cat) =>
    cat.id === problem.category
  );

  // Find related projects
  const relatedProjects = projects.filter((proj) =>
    proj.addressedProblems?.includes(problem.id)
  );

  // Find affected outcomes
  const affectedOutcomes = outcomes.filter((outcome) =>
    problem.affectedOutcomes?.includes(outcome.outcomeId)
  );

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-8 py-6 border-t-4" style={{
          background: `linear-gradient(90deg, rgba(233, 157, 51, 0.15) 0%, #FFFFFF 100%)`,
          borderTopColor: '#E99D33',
          borderBottom: '1px solid #E6C8A1'
        }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#2B180A' }}>{problem.name}</h2>
              {category && (
                <div className="px-3 py-1 rounded-lg inline-block" style={{ backgroundColor: '#F7F0E8' }}>
                  <span className="text-sm font-medium" style={{ color: '#4A4643' }}>{category.problemCategoryName}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              style={{ backgroundColor: '#F7F0E8' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
            >
              <svg className="w-6 h-6" style={{ color: '#2B180A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Description */}
          {problem.description && (
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B180A' }}>Problem Description</h3>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: '#4A4643' }}>
                {problem.description}
              </p>
            </div>
          )}

          {/* Affected Outcomes */}
          {affectedOutcomes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
                Blocks These Outcomes ({affectedOutcomes.length})
              </h3>
              <div className="grid gap-3">
                {affectedOutcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-1 bg-teal-500/20 rounded text-teal-400 text-sm font-bold flex-shrink-0">
                        {outcome.outcomeId}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1" style={{ color: '#2B180A' }}>{outcome.name}</h4>
                        {outcome.shortDescription && (
                          <p className="text-sm" style={{ color: '#4A4643' }}>{outcome.shortDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Addressing This Problem */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
              Projects Addressing This Problem ({relatedProjects.length})
            </h3>

            {relatedProjects.length === 0 ? (
              <div className="rounded-lg p-6 text-center" style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}>
                <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#6B6764' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mb-2" style={{ color: '#4A4643' }}>No projects addressing this problem yet</p>
                <p className="text-sm" style={{ color: '#6B6764' }}>This is an opportunity for new initiatives!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {relatedProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onProjectClick(project)}
                    className="group rounded-lg p-4 text-left transition-all"
                    style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#CC8D37';
                      e.currentTarget.style.backgroundColor = '#FAE6CC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E6C8A1';
                      e.currentTarget.style.backgroundColor = '#F7F0E8';
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold mb-1 transition-colors" style={{ color: '#2B180A' }} onMouseEnter={(e) => e.currentTarget.style.color = '#EFB566'} onMouseLeave={(e) => e.currentTarget.style.color = '#2B180A'}>
                          {project.name}
                        </h4>
                        {project.description && (
                          <p className="text-sm line-clamp-2" style={{ color: '#4A4643' }}>
                            {project.description}
                          </p>
                        )}
                        {project.status && (
                          <div className="mt-2">
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#FFFFFF', color: '#4A4643' }}>
                              Status: {project.status}
                            </span>
                          </div>
                        )}
                      </div>
                      <svg className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#EFB566' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-between items-center" style={{ borderTop: '1px solid #E6C8A1' }}>
          <a
            href={getEditProblemUrl(problem)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#F7F0E8', color: '#2B180A' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Suggest Edit
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 text-white rounded-xl font-bold transition-colors"
            style={{
              backgroundColor: '#E99D33'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E48400'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E99D33'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

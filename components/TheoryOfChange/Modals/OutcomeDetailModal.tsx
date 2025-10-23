'use client';

import type { AppOutcome, AppWorldview, AppProblem } from '@/lib/data-transformer';
import { useEffect } from 'react';
import { getEditOutcomeUrl } from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, NEUTRALS, PRIMARY } from '@/lib/brand-colors';

interface OutcomeDetailModalProps {
  outcome: AppOutcome;
  worldviews: AppWorldview[];
  problems: AppProblem[];
  onClose: () => void;
  onProblemClick: (problem: AppProblem) => void;
  onWorldviewClick?: (worldview: AppWorldview) => void;
}

export default function OutcomeDetailModal({
  outcome,
  worldviews,
  problems,
  onClose,
  onProblemClick,
  onWorldviewClick,
}: OutcomeDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Find related problems
  const relatedProblems = problems.filter((problem) =>
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
        <div
          className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, #A855F715, #FFFFFF)`,
            borderTop: `4px solid #A855F7`,
            borderBottom: '1px solid #E6C8A1',
          }}
        >
          <div className="flex items-center gap-4 flex-1">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#2B180A' }}>{outcome.name}</h2>
              {outcome.shortDescription && (
                <p className="mt-1" style={{ color: '#4A4643' }}>{outcome.shortDescription}</p>
              )}
            </div>
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

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Full Description */}
          {outcome.description && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}>
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 flex-shrink-0" style={{ color: '#4A4643' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#2B180A' }}>Overview</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#4A4643' }}>
                    {outcome.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Indicators */}
          {outcome.successIndicators && (
            <div className="bg-teal-400/10 p-6 rounded-xl border border-teal-400/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-500 mb-2">Success Indicators</h3>
                  <ul className="leading-relaxed space-y-2 list-disc list-inside" style={{ color: '#2B180A' }}>
                    {outcome.successIndicators.split('\n').filter(line => line.trim()).map((indicator, idx) => (
                      <li key={idx}>
                        {indicator.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Worldview Relevance */}
          {outcome.worldviewRelevance && Object.keys(outcome.worldviewRelevance).length > 0 && (
            <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-500 mb-3">Worldview Relevance</h3>

                  {/* High Priority Worldviews */}
                  {worldviews.filter(wv => outcome.worldviewRelevance[wv.id] === 'High').length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2" style={{ color: '#2B180A' }}>High Priority:</p>
                      <div className="flex flex-wrap gap-2">
                        {worldviews.filter(wv => outcome.worldviewRelevance[wv.id] === 'High').map((wv) => (
                          <button
                            key={wv.id}
                            onClick={() => onWorldviewClick?.(wv)}
                            className="px-3 py-1.5 bg-teal-500/30 hover:bg-teal-500/50 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-pointer"
                            style={{ borderLeft: `4px solid ${wv.color}`, color: '#2B180A' }}
                          >
                            {wv.shortName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medium Priority Worldviews */}
                  {worldviews.filter(wv => outcome.worldviewRelevance[wv.id] === 'Medium').length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: '#2B180A' }}>Medium Priority:</p>
                      <div className="flex flex-wrap gap-2">
                        {worldviews.filter(wv => outcome.worldviewRelevance[wv.id] === 'Medium').map((wv) => (
                          <button
                            key={wv.id}
                            onClick={() => onWorldviewClick?.(wv)}
                            className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/40 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-pointer"
                            style={{ borderLeft: `4px solid ${wv.color}`, color: '#2B180A' }}
                          >
                            {wv.shortName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Related Worldviews Context */}
          {outcome.relatedWorldviews && (
            <div className="bg-cyan-500/10 p-6 rounded-xl border border-cyan-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cyan-500 mb-2">Worldview Context</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {outcome.relatedWorldviews}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Problems Blocking This Outcome */}
          {relatedProblems.length > 0 && (
            <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-500 mb-3">
                    Problems Blocking This Outcome ({relatedProblems.length})
                  </h3>
                  <div className="grid gap-3">
                    {relatedProblems.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => onProblemClick(problem)}
                        className="group rounded-lg p-4 text-left transition-all border border-amber-500/30 hover:border-amber-400"
                        style={{ backgroundColor: '#F7F0E8' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-bold group-hover:text-amber-500 transition-colors mb-1" style={{ color: '#2B180A' }}>
                              {problem.name}
                            </h4>
                            {problem.description && (
                              <p className="text-sm line-clamp-2" style={{ color: '#4A4643' }}>
                                {problem.description}
                              </p>
                            )}
                          </div>
                          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-between items-center" style={{ borderTop: '1px solid #E6C8A1' }}>
          <a
            href={getEditOutcomeUrl(outcome)}
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
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

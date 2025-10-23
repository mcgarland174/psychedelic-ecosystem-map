'use client';

import type { AppProject, AppProblem, AppOutcome, AppWorldview } from '@/lib/data-transformer';
import { useEffect } from 'react';
import { getEditProjectUrl } from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, NEUTRALS, PRIMARY } from '@/lib/brand-colors';

interface ProjectDetailModalProps {
  project: AppProject;
  problems: AppProblem[];
  outcomes?: AppOutcome[];
  worldviews?: AppWorldview[];
  organizations?: Array<{ id: string; name: string }>;
  onClose: () => void;
  onProblemClick?: (problem: AppProblem) => void;
  onOutcomeClick?: (outcome: AppOutcome) => void;
  onWorldviewClick?: (worldview: AppWorldview) => void;
}

export default function ProjectDetailModal({
  project,
  problems,
  outcomes,
  worldviews,
  organizations,
  onClose,
  onProblemClick,
  onOutcomeClick,
  onWorldviewClick,
}: ProjectDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Find addressed problems
  const addressedProblems = problems.filter((prob) =>
    project.addressedProblems?.includes(prob.id)
  );

  // Get associated organizations (now just an array of names)
  const associatedOrgs = project.organizations || [];

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
          background: `linear-gradient(90deg, rgba(204, 141, 55, 0.15) 0%, #FFFFFF 100%)`,
          borderTopColor: '#CC8D37',
          borderBottom: '1px solid #E6C8A1'
        }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#2B180A' }}>{project.name}</h2>
              <div className="flex flex-wrap gap-2">
                {project.status && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium" style={{
                    backgroundColor: '#CC8D3733',
                    color: '#EFB566'
                  }}>
                    {project.status}
                  </span>
                )}
                {project.typeOfProject && project.typeOfProject.length > 0 && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: '#F7F0E8', color: '#4A4643' }}>
                    {project.typeOfProject[0]}
                  </span>
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
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Description */}
          {project.description && (
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2B180A' }}>Description</h3>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: '#4A4643' }}>
                {project.description}
              </p>
            </div>
          )}

          {/* Problems Addressed */}
          {addressedProblems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
                Problems Addressed ({addressedProblems.length})
              </h3>
              <div className="grid gap-3">
                {addressedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1" style={{ color: '#2B180A' }}>{problem.name}</h4>
                        {problem.description && (
                          <p className="text-sm line-clamp-2" style={{ color: '#4A4643' }}>{problem.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Organizations */}
          {associatedOrgs.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
                Associated Organizations ({associatedOrgs.length})
              </h3>
              <div className="grid gap-3">
                {associatedOrgs.map((orgName, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}
                  >
                    <h4 className="font-bold" style={{ color: '#2B180A' }}>
                      {orgName}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Expected Impact */}
            {project.expectedImpact && (
              <div>
                <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#6B6764' }}>Expected Impact</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#4A4643' }}>
                  {project.expectedImpact}
                </p>
              </div>
            )}

            {/* Geographic Location */}
            {project.geographicLocation && project.geographicLocation.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#6B6764' }}>Location</h3>
                <p className="text-sm" style={{ color: '#4A4643' }}>
                  {project.geographicLocation.join(', ')}
                </p>
              </div>
            )}

            {/* Website */}
            {project.website && (
              <div>
                <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#6B6764' }}>Website</h3>
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 text-sm underline"
                >
                  {project.website}
                </a>
              </div>
            )}

            {/* Funding Status */}
            {project.activelyFundraising && (
              <div>
                <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#6B6764' }}>Fundraising</h3>
                <p className="text-sm" style={{ color: '#4A4643' }}>{project.activelyFundraising}</p>
                {project.amountSeeking && (
                  <p className="text-sm mt-1" style={{ color: '#6B6764' }}>
                    Seeking: ${project.amountSeeking.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-between items-center" style={{ borderTop: '1px solid #E6C8A1' }}>
          <div className="flex gap-3">
            <a
              href={getEditProjectUrl(project)}
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
              Request Edit
            </a>
            <a
              href={`/?project=${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View in Map
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 text-white rounded-xl font-bold transition-colors"
            style={{
              backgroundColor: '#CC8D37'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B66A00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#CC8D37'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

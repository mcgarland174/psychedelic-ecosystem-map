'use client';

import { useMemo } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  priorityArea?: string;
  typeOfProject?: string[];
  geographicLocation?: string[];
  status?: string;
  associatedOrganizations?: string[];
  peopleInvolved?: string[];
  teamLead?: string[];
  activelyFundraising?: string;
  amountRaisedToDate?: number;
  amountSeeking?: number;
  expectedAnnualRevenue?: string;
  willGenerateRevenue?: string;
  projectStartDate?: string;
  expectedCompletionDate?: string;
  sustainabilityTimeline?: string[];
  currentProgress?: string;
  describeCurrentProgress?: string;
  projectMilestones?: string;
  expectedImpact?: string;
  website?: string;
  projectFunders?: string;
}

interface Organization {
  id: string;
  name: string;
  organizationType?: string[];
  city?: string;
  state?: string[];
  country?: string[];
}

interface ProjectDetailPanelProps {
  projectId: string | null;
  projects: Project[];
  organizations: Organization[];
  onClose: () => void;
  onOrgClick?: (orgId: string) => void;
  editFormUrl?: string;
}

export default function ProjectDetailPanel({ projectId, projects, organizations, onClose, onOrgClick, editFormUrl }: ProjectDetailPanelProps) {
  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId) || null;
  }, [projects, projectId]);

  const projectOrgs = useMemo(() => {
    if (!project || !project.associatedOrganizations) return [];
    return organizations.filter((org) =>
      project.associatedOrganizations?.includes(org.id) ||
      project.associatedOrganizations?.includes(org.name)
    );
  }, [project, organizations]);

  if (!projectId || !project) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-full flex flex-col animate-slideUp" style={{ boxShadow: '0 25px 50px -12px rgba(49, 126, 109, 0.25), 0 10px 25px -5px rgba(49, 126, 109, 0.1)' }}>
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 id="project-detail-title" className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#FBF3E7' }}>Project Details</h2>
            <h3 className="text-3xl font-bold text-white leading-tight">{project.name}</h3>
          </div>
          <div className="flex items-center gap-3">
            {/* Request Edit Button */}
            {editFormUrl && (
              <a
                href={`${editFormUrl}?prefill_Project=${encodeURIComponent(project.name)}&prefill_ID=${encodeURIComponent(project.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-bold text-sm transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Request Edit
              </a>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors hover:scale-110 transform min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close project details dialog"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {project ? (
        <div className="p-6 space-y-6 overflow-y-auto" style={{ background: 'linear-gradient(to bottom right, #FBF3E7, #F7F0E8)' }}>

          {project.description && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Description
              </label>
              <p className="text-base whitespace-pre-wrap bg-white p-4 rounded-xl border-2 shadow-sm" style={{ color: '#2B180A', borderColor: '#E6C8A1', lineHeight: '1.6' }}>{project.description}</p>
            </div>
          )}

          {project.priorityArea && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Priority Area
              </label>
              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-full text-sm font-medium shadow-sm">
                {project.priorityArea}
              </span>
            </div>
          )}

          {project.typeOfProject && project.typeOfProject.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Type of Project
              </label>
              <div className="flex flex-wrap gap-2">
                {project.typeOfProject.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#FBF3E7', color: '#2B180A' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.geographicLocation && project.geographicLocation.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Geographic Location
              </label>
              <div className="flex flex-wrap gap-2">
                {project.geographicLocation.map((location, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.status && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Status
              </label>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                {project.status}
              </span>
            </div>
          )}

          {project.currentProgress && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Current Progress
              </label>
              <p className="text-base font-normal" style={{ color: '#2B180A', lineHeight: '1.6' }}>{project.currentProgress}</p>
            </div>
          )}

          {project.describeCurrentProgress && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Progress Details
              </label>
              <p className="text-base whitespace-pre-wrap font-normal" style={{ color: '#2B180A', lineHeight: '1.6' }}>{project.describeCurrentProgress}</p>
            </div>
          )}

          {project.website && (
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: '#2B180A' }}>
                Website
              </label>
              <a
                href={project.website.startsWith('http') ? project.website : `https://${project.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline break-all"
              >
                {project.website}
              </a>
            </div>
          )}

          {project.associatedOrganizations && project.associatedOrganizations.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#2B180A' }}>
                Associated Organizations ({project.associatedOrganizations.length})
              </label>
              <div className="grid grid-cols-1 gap-3">
                {project.associatedOrganizations.map((orgIdOrName, idx) => {
                  // Find the organization by ID or name
                  const org = projectOrgs.find(o => o.id === orgIdOrName || o.name === orgIdOrName);

                  if (!org) {
                    return (
                      <div
                        key={idx}
                        className="rounded-lg p-4 opacity-50"
                        style={{ backgroundColor: '#FBF3E7', borderColor: '#E6C8A1', borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        <p className="text-sm" style={{ color: '#6B6764' }}>Organization not found: {orgIdOrName}</p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (onOrgClick) {
                          onOrgClick(org.id);
                          onClose();
                        }
                      }}
                      className="bg-white border-2 rounded-lg p-4 hover:shadow-md transition-all text-left group"
                      style={{ borderColor: '#E6C8A1' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D4A574'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E6C8A1'}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold group-hover:text-teal-700 transition-colors" style={{ color: '#2B180A' }}>
                            {org.name}
                          </h4>
                          {org.organizationType && org.organizationType.length > 0 && (
                            <p className="text-sm mt-1" style={{ color: '#6B6764' }}>
                              {org.organizationType.join(', ')}
                            </p>
                          )}
                          {org.city && (
                            <p className="text-xs mt-1" style={{ color: '#6B6764' }}>
                              {org.city}{org.state && org.state.length > 0 ? `, ${org.state[0]}` : ''}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors flex-shrink-0 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: '#6B6764' }}>Project not found</p>
      )}
    </div>
  );
}

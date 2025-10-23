'use client';

import { useMemo } from 'react';

interface Organization {
  id: string;
  name: string;
  organizationType?: string[];
  entityType?: string;
  ecosystemRole?: string[];
  website?: string;
  city?: string;
  state?: string[];
  country?: string[];
  descriptionOfActivities?: string;
  projects?: string[];
  areaOfFocus?: string[];
  substanceOfFocus?: string[];
  populationServed?: string[];
  verified?: boolean;
}

interface Project {
  id: string;
  name: string;
  priorityArea?: string;
  status?: string;
}

interface OrgDetailPanelProps {
  orgId: string | null;
  organizations: Organization[];
  projects: Project[];
  onClose: () => void;
  onProjectClick?: (projectId: string) => void;
  editFormUrl?: string;
}

export default function OrgDetailPanel({ orgId, organizations, projects, onClose, onProjectClick, editFormUrl }: OrgDetailPanelProps) {
  const org = useMemo(() => {
    return organizations.find((o) => o.id === orgId) || null;
  }, [organizations, orgId]);

  const orgProjects = useMemo(() => {
    if (!org || !org.projects) return [];
    return projects.filter((p) => org.projects?.includes(p.id));
  }, [org, projects]);

  if (!orgId || !org) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-full flex flex-col animate-slideUp" style={{ boxShadow: '0 25px 50px -12px rgba(49, 126, 109, 0.25), 0 10px 25px -5px rgba(49, 126, 109, 0.1)' }}>
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 id="org-detail-title" className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#FBF3E7' }}>Organization Details</h2>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-white leading-tight">{org.name}</h3>
              {/* Verification Badge */}
              {org.verified && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30" title="Verified Organization">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-semibold">Verified</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Request Edit Button */}
            {editFormUrl && (
              <a
                href={`${editFormUrl}?prefill_Organization=${encodeURIComponent(org.name)}&prefill_ID=${encodeURIComponent(org.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-bold text-sm transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
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
              aria-label="Close organization details dialog"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {org ? (
        <div className="p-6 space-y-6 overflow-y-auto" style={{ background: 'linear-gradient(to bottom right, #FBF3E7, #F7F0E8)' }}>

          {org.ecosystemRole && org.ecosystemRole.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Ecosystem Role
              </label>
              <div className="flex flex-wrap gap-2">
                {org.ecosystemRole.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full text-sm font-medium shadow-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.organizationType && org.organizationType.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Organization Type
              </label>
              <div className="flex flex-wrap gap-2">
                {org.organizationType.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-sm font-medium border-2"
                    style={{ backgroundColor: '#F4CE99', color: '#2B180A', borderColor: '#E6C8A1' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.entityType && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Entity Type
              </label>
              <p className="text-base font-normal" style={{ color: '#4A4643', lineHeight: '1.6' }}>{org.entityType}</p>
            </div>
          )}

          {(org.city || (org.state && org.state.length > 0) || (org.country && org.country.length > 0)) && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Location
              </label>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-base font-normal" style={{ color: '#4A4643', lineHeight: '1.6' }}>
                  {[
                    org.city,
                    org.state?.[0],
                    org.country?.[0]
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          {org.website && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Website
              </label>
              <a
                href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold break-all transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {org.website}
              </a>
            </div>
          )}

          {org.descriptionOfActivities && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Description of Activities
              </label>
              <p className="text-base whitespace-pre-wrap bg-white p-4 rounded-xl border-2" style={{ color: '#4A4643', borderColor: '#E6C8A1', lineHeight: '1.6' }}>{org.descriptionOfActivities}</p>
            </div>
          )}

          {org.areaOfFocus && org.areaOfFocus.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Area of Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {org.areaOfFocus.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-teal-500 text-white rounded-full text-sm font-medium shadow-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.substanceOfFocus && org.substanceOfFocus.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Substance of Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {org.substanceOfFocus.map((substance, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                    style={{ backgroundColor: '#EFB566', color: '#2B180A' }}
                  >
                    {substance}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.populationServed && org.populationServed.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Population Served
              </label>
              <div className="flex flex-wrap gap-2">
                {org.populationServed.map((pop, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-sm font-medium shadow-sm"
                  >
                    {pop}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.projects && org.projects.length > 0 && (
            <div>
              <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#2B180A' }}>
                Related Projects ({org.projects.length})
              </label>
              <div className="grid grid-cols-1 gap-3">
                {org.projects.map((projectIdOrName, idx) => {
                  // Find the project by ID or name
                  const project = orgProjects.find(p => p.id === projectIdOrName || p.name === projectIdOrName);

                  if (!project) {
                    return (
                      <div
                        key={idx}
                        className="border-2 rounded-xl p-3 opacity-50"
                        style={{ backgroundColor: '#F7F0E8', borderColor: '#E6C8A1' }}
                      >
                        <p className="text-sm" style={{ color: '#6B6764' }}>Project not found: {projectIdOrName}</p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (onProjectClick) {
                          onProjectClick(project.id);
                          onClose();
                        }
                      }}
                      className="bg-white border-2 hover:border-teal-500 rounded-xl p-4 hover:shadow-lg transition-all text-left group hover:scale-105"
                      style={{ borderColor: '#E6C8A1', boxShadow: '0 0 0 0 rgba(49, 126, 109, 0)' }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(49, 126, 109, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 rgba(49, 126, 109, 0)'}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold group-hover:text-teal-600 transition-colors" style={{ color: '#2B180A' }}>
                            {project.name}
                          </h4>
                          {project.priorityArea && (
                            <p className="text-xs mt-1 font-medium" style={{ color: '#6B6764' }}>
                              {project.priorityArea}
                            </p>
                          )}
                          {project.status && (
                            <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: '#F4CE99', color: '#2B180A', borderColor: '#E6C8A1' }}>
                              {project.status}
                            </span>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
        <p className="text-gray-600">Organization not found</p>
      )}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  organizationType?: string[];
  entityType?: string;
  website?: string;
  city?: string;
  state?: string[];
  country?: string[];
}

interface CardViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

const ROLE_COLORS: Record<string, string> = {
  'Funder': 'bg-blue-100 text-blue-800 border-blue-200',
  'Media': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Government & Policy': 'bg-teal-100 text-teal-800 border-teal-200',
  'Academic & Research': 'bg-green-100 text-green-800 border-green-200',
  'Training & Credentialing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Clinical Services': 'bg-orange-100 text-orange-800 border-orange-200',
  'Community & Peer Support': 'bg-red-100 text-red-800 border-red-200',
  'Spiritual / Religious': 'bg-pink-100 text-pink-800 border-pink-200',
  'Advocacy': 'bg-purple-100 text-purple-800 border-purple-200',
  'Technology & Data Systems': 'bg-gray-100 text-gray-800 border-gray-200',
  'Industry & Supply Chain': 'bg-sky-100 text-sky-800 border-sky-200',
  'Cultural & Indigenous': 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export default function CardView({ organizations, onOrgClick }: CardViewProps) {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const groupedOrgs = useMemo(() => {
    const filtered = organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups = new Map<string, Organization[]>();

    filtered.forEach(org => {
      const roles = org.ecosystemRole || ['Other / Unaffiliated'];
      roles.forEach(role => {
        if (!groups.has(role)) {
          groups.set(role, []);
        }
        groups.get(role)!.push(org);
      });
    });

    // Sort groups by size
    return Array.from(groups.entries())
      .sort((a, b) => b[1].length - a[1].length);
  }, [organizations, searchTerm]);

  const toggleRole = (role: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(role)) {
      newExpanded.delete(role);
    } else {
      newExpanded.add(role);
    }
    setExpandedRoles(newExpanded);
  };

  const expandAll = () => {
    setExpandedRoles(new Set(groupedOrgs.map(([role]) => role)));
  };

  const collapseAll = () => {
    setExpandedRoles(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organizations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md border border-blue-300"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Grouped Cards */}
      <div className="space-y-4">
        {groupedOrgs.map(([role, orgs]) => {
          const isExpanded = expandedRoles.has(role);
          const colorClass = ROLE_COLORS[role] || 'bg-gray-100 text-gray-800 border-gray-200';

          return (
            <div key={role} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Role Header */}
              <button
                onClick={() => toggleRole(role)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
                    {role}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {orgs.length} {orgs.length === 1 ? 'organization' : 'organizations'}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Organization Cards */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orgs.map(org => (
                      <div
                        key={org.id}
                        onClick={() => onOrgClick?.(org.id)}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {org.name}
                        </h3>

                        {org.organizationType && org.organizationType.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-600">
                              {org.organizationType[0]}
                            </span>
                          </div>
                        )}

                        {(org.city || org.state?.[0]) && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs">
                              {[org.city, org.state?.[0]].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}

                        {org.website && (
                          <div className="flex items-center gap-1 text-sm">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <a
                              href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-blue-600 hover:underline truncate"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

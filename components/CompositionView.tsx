'use client';

import { useMemo, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  entityType?: string;
  organizationType?: string[];
  city?: string;
  state?: string[];
  country?: string[];
}

interface CompositionViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

const ROLE_COLORS: Record<string, string> = {
  'Academic & Research': '#10B981',
  'Clinical Services': '#F59E0B',
  'Funder': '#3B82F6',
  'Training & Credentialing': '#EAB308',
  'Community & Peer Support': '#EF4444',
  'Advocacy': '#A855F7',
  'Media': '#06B6D4',
  'Government & Policy': '#14B8A6',
  'Spiritual / Religious': '#EC4899',
  'Technology & Data Systems': '#6B7280',
  'Industry & Supply Chain': '#0EA5E9',
  'Cultural & Indigenous': '#6366F1',
};

export default function CompositionView({ organizations, onOrgClick }: CompositionViewProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const roleData = useMemo(() => {
    const roleCount = new Map<string, Set<string>>();

    organizations.forEach(org => {
      const roles = org.ecosystemRole || ['Other / Unaffiliated'];
      roles.forEach(role => {
        if (!roleCount.has(role)) {
          roleCount.set(role, new Set());
        }
        roleCount.get(role)!.add(org.id);
      });
    });

    return Array.from(roleCount.entries())
      .map(([role, orgIds]) => ({
        role,
        count: orgIds.size,
        percentage: (orgIds.size / organizations.length) * 100,
        orgIds: Array.from(orgIds),
      }))
      .sort((a, b) => b.count - a.count);
  }, [organizations]);

  const entityTypeData = useMemo(() => {
    const typeCount = new Map<string, number>();

    organizations.forEach(org => {
      const type = org.entityType || 'Unknown';
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    return Array.from(typeCount.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / organizations.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [organizations]);

  const multiRoleOrgs = useMemo(() => {
    const multiRole = organizations.filter(org =>
      org.ecosystemRole && org.ecosystemRole.length > 1
    );

    const threeOrMore = multiRole.filter(org => org.ecosystemRole!.length >= 3);
    const twoRoles = multiRole.filter(org => org.ecosystemRole!.length === 2);

    return {
      threeOrMore,
      twoRoles,
      total: multiRole.length,
    };
  }, [organizations]);

  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      if (selectedRole && !org.ecosystemRole?.includes(selectedRole)) {
        return false;
      }
      if (selectedEntityType && org.entityType !== selectedEntityType) {
        return false;
      }
      return true;
    });
  }, [organizations, selectedRole, selectedEntityType]);

  const maxCount = roleData[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* Ecosystem Role Composition */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Ecosystem Composition by Role</h3>
          {selectedRole && (
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-3">
          {roleData.map(({ role, count, percentage, orgIds }) => {
            const previewOrgs = organizations.filter(org => org.ecosystemRole?.includes(role)).slice(0, 3);
            const remainingCount = count - 3;

            return (
              <div key={role} className="group relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{role}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setSelectedEntityType(null);
                    setShowModal(true);
                  }}
                  onMouseEnter={() => setHoveredRole(role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className="w-full text-left relative"
                >
                  <div className="relative h-8 bg-gray-100 rounded overflow-hidden hover:bg-gray-200 transition-colors hover:ring-2 hover:ring-blue-400">
                    <div
                      className="h-full transition-all duration-500 flex items-center px-3"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: ROLE_COLORS[role] || '#9CA3AF',
                      }}
                    >
                      <span className="text-xs text-white font-medium truncate">
                        {role}
                      </span>
                    </div>
                  </div>

                  {/* Hover Preview Tooltip */}
                  {hoveredRole === role && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-50 min-w-[300px] max-w-[400px]">
                      <div className="text-xs font-semibold text-gray-900 mb-2">
                        {role} ({count} organizations)
                      </div>
                      <div className="space-y-1">
                        {previewOrgs.map(org => (
                          <div key={org.id} className="text-xs text-gray-700">
                            • {org.name}
                          </div>
                        ))}
                        {remainingCount > 0 && (
                          <div className="text-xs text-blue-600 font-medium mt-1">
                            ... and {remainingCount} more
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        Click to see all
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Click any bar to filter organizations by role
          </p>
        </div>
      </div>

      {/* Entity Type & Multi-Role Orgs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Entity Type Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Entity Type</h3>
            {selectedEntityType && (
              <button
                onClick={() => setSelectedEntityType(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {entityTypeData.map(({ type, count, percentage }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedEntityType(type);
                  setSelectedRole(null);
                  setShowModal(true);
                }}
                className="w-full text-left hover:bg-gray-50 p-3 rounded-lg border border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{type}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Role Organizations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Multi-Role Organizations</h3>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">3+ Roles</span>
                <span className="text-2xl font-bold text-blue-600">
                  {multiRoleOrgs.threeOrMore.length}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {((multiRoleOrgs.threeOrMore.length / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">2 Roles</span>
                <span className="text-2xl font-bold text-green-600">
                  {multiRoleOrgs.twoRoles.length}
                </span>
              </div>
              <p className="text-xs text-green-700">
                {((multiRoleOrgs.twoRoles.length / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Single Role</span>
                <span className="text-2xl font-bold text-gray-600">
                  {organizations.length - multiRoleOrgs.total}
                </span>
              </div>
              <p className="text-xs text-gray-700">
                {(((organizations.length - multiRoleOrgs.total) / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Filtered Organizations */}
      {showModal && (selectedRole || selectedEntityType) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowModal(false);
            setSelectedRole(null);
            setSelectedEntityType(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRole && selectedEntityType
                    ? `${selectedRole} - ${selectedEntityType}`
                    : selectedRole || selectedEntityType}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRole(null);
                  setSelectedEntityType(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredOrgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onOrgClick?.(org.id);
                      setShowModal(false);
                    }}
                    className="text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                      {org.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {[org.city, org.state?.[0]].filter(Boolean).join(', ') || 'Location not specified'}
                    </div>
                    {org.ecosystemRole && org.ecosystemRole.length > 1 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {org.ecosystemRole.slice(0, 2).map((role, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: ROLE_COLORS[role] || '#9CA3AF',
                              color: 'white',
                            }}
                          >
                            {role.split(' ')[0]}
                          </span>
                        ))}
                        {org.ecosystemRole.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                            +{org.ecosystemRole.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {filteredOrgs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No organizations found matching these filters.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Click any organization to view details
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRole(null);
                    setSelectedEntityType(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

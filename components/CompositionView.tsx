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

// Warm Earth Tones palette for roles - alternating teals and golds
const ROLE_COLORS: Record<string, string> = {
  'Academic & Research': '#317E6D',      // teal
  'Clinical Services': '#CC8D37',        // gold
  'Funder': '#1F5F51',                   // forestTeal
  'Training & Credentialing': '#E99D33', // amber
  'Community & Peer Support': '#9DCDC3', // lightTeal
  'Advocacy': '#EFB566',                 // lightGold
  'Media': '#48A5CC',                    // skyBlue (accent)
  'Government & Policy': '#133931',      // darkTeal
  'Spiritual / Religious': '#F4CE99',    // paleGold
  'Technology & Data Systems': '#2E6D6E',// tealBlue
  'Industry & Supply Chain': '#B66A00',  // bronze
  'Cultural & Indigenous': '#E48400',    // brightOrange
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
      <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#E6C8A1' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#2B180A' }}>
            Ecosystem Composition by Role
          </h3>
          {selectedRole && (
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-teal-600 hover:text-teal-800 font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-3">
          {roleData.map(({ role, count, percentage }) => {
            const previewOrgs = organizations.filter(org => org.ecosystemRole?.includes(role)).slice(0, 3);
            const remainingCount = count - 3;

            return (
              <div key={role} className="group relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: '#4A4643' }}>{role}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: '#6B6764' }}>{percentage.toFixed(1)}%</span>
                    <span className="text-sm font-semibold w-12 text-right" style={{ color: '#2B180A' }}>
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
                  <div className="relative h-10 rounded-lg overflow-hidden transition-all hover:shadow-md" style={{ background: 'linear-gradient(135deg, #FBF3E7 0%, #F7F0E8 100%)' }}>
                    <div
                      className="h-full transition-all duration-500 flex items-center px-3 relative"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        background: `linear-gradient(90deg, ${ROLE_COLORS[role] || '#9CA3AF'}E6, ${ROLE_COLORS[role] || '#9CA3AF'}CC)`,
                        boxShadow: `inset 0 -2px 0 0 rgba(0,0,0,0.1), 0 2px 8px ${ROLE_COLORS[role] || '#9CA3AF'}40`
                      }}
                    >
                      <span className="text-xs text-white font-semibold truncate" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                        {role}
                      </span>
                    </div>
                  </div>

                  {/* Hover Preview Tooltip */}
                  {hoveredRole === role && (
                    <div className="absolute left-0 top-full mt-2 bg-white border-2 rounded-lg shadow-xl p-3 z-50 min-w-[300px] max-w-[400px]" style={{ borderColor: '#E6C8A1' }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: '#2B180A' }}>
                        {role} ({count} organizations)
                      </div>
                      <div className="space-y-1">
                        {previewOrgs.map(org => (
                          <div key={org.id} className="text-xs" style={{ color: '#4A4643' }}>
                            • {org.name}
                          </div>
                        ))}
                        {remainingCount > 0 && (
                          <div className="text-xs text-teal-600 font-medium mt-1">
                            ... and {remainingCount} more
                          </div>
                        )}
                      </div>
                      <div className="text-xs mt-2 pt-2 border-t" style={{ color: '#6B6764', borderColor: '#E6C8A1' }}>
                        Click to see all
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E6C8A1' }}>
          <p className="text-sm" style={{ color: '#6B6764' }}>
            Click any bar to filter organizations by role
          </p>
        </div>
      </div>

      {/* Entity Type & Multi-Role Orgs */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Entity Type Breakdown */}
        <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#E6C8A1' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: '#2B180A' }}>
              Entity Type
            </h3>
            {selectedEntityType && (
              <button
                onClick={() => setSelectedEntityType(null)}
                className="text-sm text-teal-600 hover:text-teal-800 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {entityTypeData.map(({ type, count, percentage }, index) => {
              const barColor = index % 2 === 0 ? '#317E6D' : '#CC8D37'; // Alternate teal and gold
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedEntityType(type);
                    setSelectedRole(null);
                    setShowModal(true);
                  }}
                  className="w-full text-left hover:bg-teal-50 p-3 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{ borderColor: '#E6C8A1' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: '#2B180A' }}>{type}</span>
                    <span className="text-sm font-semibold" style={{ color: '#2B180A' }}>{count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #FBF3E7 0%, #F7F0E8 100%)' }}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${barColor}E6, ${barColor}CC)`,
                          boxShadow: `0 1px 3px ${barColor}40`
                        }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right" style={{ color: '#6B6764' }}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Role Organizations */}
        <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#E6C8A1' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#2B180A' }}>
            Multi-Role Organizations
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border-2" style={{ background: 'linear-gradient(135deg, #317E6D15 0%, #317E6D08 100%)', borderColor: '#317E6D50' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#133931' }}>3+ Roles</span>
                <span className="text-2xl font-bold text-teal-600">
                  {multiRoleOrgs.threeOrMore.length}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#1F5F51' }}>
                {((multiRoleOrgs.threeOrMore.length / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>

            <div className="rounded-lg p-4 border-2" style={{ background: 'linear-gradient(135deg, #CC8D3715 0%, #CC8D3708 100%)', borderColor: '#CC8D3750' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#894F00' }}>2 Roles</span>
                <span className="text-2xl font-bold" style={{ color: '#CC8D37' }}>
                  {multiRoleOrgs.twoRoles.length}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#B66A00' }}>
                {((multiRoleOrgs.twoRoles.length / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>

            <div className="rounded-lg p-4 border-2" style={{ background: 'linear-gradient(135deg, #FBF3E7 0%, #F7F0E8 100%)', borderColor: '#E6C8A1' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#2B180A' }}>Single Role</span>
                <span className="text-2xl font-bold" style={{ color: '#4A4643' }}>
                  {organizations.length - multiRoleOrgs.total}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#6B6764' }}>
                {(((organizations.length - multiRoleOrgs.total) / organizations.length) * 100).toFixed(1)}% of organizations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Filtered Organizations */}
      {showModal && (selectedRole || selectedEntityType) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowModal(false);
            setSelectedRole(null);
            setSelectedEntityType(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-2" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(135deg, #FBF3E7 0%, #FFFFFF 100%)' }}>
              <div>
                <h3 className="text-xl font-bold" style={{ color: '#2B180A' }}>
                  {selectedRole && selectedEntityType
                    ? `${selectedRole} - ${selectedEntityType}`
                    : selectedRole || selectedEntityType}
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B6764' }}>
                  {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRole(null);
                  setSelectedEntityType(null);
                }}
                className="text-gray-400 hover:text-teal-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6" style={{ background: 'linear-gradient(135deg, #FBF3E7 0%, #F7F0E8 100%)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredOrgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onOrgClick?.(org.id);
                      setShowModal(false);
                    }}
                    className="text-left bg-white hover:bg-teal-50 border-2 rounded-lg p-4 transition-all hover:shadow-md hover:scale-105"
                    style={{ borderColor: '#E6C8A1' }}
                  >
                    <div className="font-medium text-sm mb-2 line-clamp-2" style={{ color: '#2B180A' }}>
                      {org.name}
                    </div>
                    <div className="text-xs mb-2" style={{ color: '#6B6764' }}>
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
            <div className="border-t-2 p-4" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: '#4A4643' }}>
                  Click any organization to view details
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRole(null);
                    setSelectedEntityType(null);
                  }}
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold hover:scale-105"
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

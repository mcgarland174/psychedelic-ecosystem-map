'use client';

import { useMemo, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  state?: string[];
  country?: string[];
  city?: string;
}

interface GeographicCompositionViewProps {
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

export default function GeographicCompositionView({ organizations, onOrgClick }: GeographicCompositionViewProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{role: string, state: string} | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{role: string, state: string} | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stateData = useMemo(() => {
    const stateCount = new Map<string, Set<string>>();

    organizations.forEach(org => {
      const states = org.state || ['Unknown'];
      states.forEach(state => {
        if (!stateCount.has(state)) {
          stateCount.set(state, new Set());
        }
        stateCount.get(state)!.add(org.id);
      });
    });

    return Array.from(stateCount.entries())
      .map(([state, orgIds]) => ({
        state,
        count: orgIds.size,
        percentage: (orgIds.size / organizations.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 states
  }, [organizations]);

  const stateComposition = useMemo(() => {
    const topStates = stateData.slice(0, 10).map(d => d.state);

    return topStates.map(state => {
      const roleCount = new Map<string, number>();
      let total = 0;

      organizations.forEach(org => {
        if (org.state?.includes(state)) {
          const roles = org.ecosystemRole || ['Other'];
          roles.forEach(role => {
            roleCount.set(role, (roleCount.get(role) || 0) + 1);
            total++;
          });
        }
      });

      const roles = Array.from(roleCount.entries())
        .map(([role, count]) => ({
          role,
          count,
          percentage: (count / total) * 100,
        }))
        .sort((a, b) => b.count - a.count);

      return {
        state,
        total,
        roles,
      };
    });
  }, [organizations, stateData]);

  // Heatmap data: Role x State matrix
  const heatmapData = useMemo(() => {
    const topStates = stateData.slice(0, 10).map(d => d.state);
    const allRoles = Array.from(new Set(
      organizations.flatMap(org => org.ecosystemRole || [])
    )).sort();

    const matrix: Record<string, Record<string, number>> = {};

    allRoles.forEach(role => {
      matrix[role] = {};
      topStates.forEach(state => {
        matrix[role][state] = 0;
      });
    });

    organizations.forEach(org => {
      const states = org.state || [];
      const roles = org.ecosystemRole || [];

      states.forEach(state => {
        if (topStates.includes(state)) {
          roles.forEach(role => {
            if (matrix[role] && matrix[role][state] !== undefined) {
              matrix[role][state]++;
            }
          });
        }
      });
    });

    // Find max count for scaling
    let maxCount = 0;
    Object.values(matrix).forEach(stateData => {
      Object.values(stateData).forEach(count => {
        if (count > maxCount) maxCount = count;
      });
    });

    return { matrix, roles: allRoles.slice(0, 12), states: topStates, maxCount };
  }, [organizations, stateData]);

  const filteredOrgs = useMemo(() => {
    if (selectedHeatmapCell) {
      return organizations.filter(org =>
        org.ecosystemRole?.includes(selectedHeatmapCell.role) &&
        org.state?.includes(selectedHeatmapCell.state)
      );
    }
    if (!selectedState) return [];
    return organizations.filter(org => org.state?.includes(selectedState));
  }, [organizations, selectedState, selectedHeatmapCell]);

  const getHeatmapColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-gray-50';
    const intensity = Math.ceil((count / maxCount) * 5);
    const colors = ['bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'];
    return colors[intensity - 1] || colors[0];
  };

  const getHeatmapTextColor = (count: number, maxCount: number) => {
    if (count === 0) return 'text-gray-400';
    const intensity = Math.ceil((count / maxCount) * 5);
    return intensity >= 4 ? 'text-white' : 'text-gray-900';
  };

  return (
    <div className="space-y-6">
      {/* Heatmap: Role x State */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Role × State Heatmap
          </h3>
          {selectedHeatmapCell && (
            <button
              onClick={() => {
                setSelectedHeatmapCell(null);
                setShowModal(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Click any cell to see organizations in that role and state
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-700 sticky left-0 z-10">
                  Role / State
                </th>
                {heatmapData.states.map(state => (
                  <th
                    key={state}
                    className="border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 min-w-[80px]"
                  >
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.roles.map(role => (
                <tr key={role}>
                  <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-900 sticky left-0 z-10 whitespace-nowrap">
                    {role}
                  </td>
                  {heatmapData.states.map(state => {
                    const count = heatmapData.matrix[role]?.[state] || 0;
                    const isSelected = selectedHeatmapCell?.role === role && selectedHeatmapCell?.state === state;
                    const isHovered = hoveredCell?.role === role && hoveredCell?.state === state;
                    const previewOrgs = organizations.filter(org =>
                      org.ecosystemRole?.includes(role) && org.state?.includes(state)
                    ).slice(0, 3);
                    const remainingCount = count - 3;

                    return (
                      <td
                        key={`${role}-${state}`}
                        onMouseEnter={() => {
                          if (count > 0) {
                            setHoveredCell({ role, state });
                          }
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => {
                          if (count > 0) {
                            setSelectedHeatmapCell({ role, state });
                            setSelectedState(null);
                            setShowModal(true);
                          }
                        }}
                        className={`border border-gray-300 px-3 py-2 text-center text-xs font-semibold transition-all relative ${
                          count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
                        } ${isSelected ? 'ring-2 ring-blue-600' : ''} ${getHeatmapColor(count, heatmapData.maxCount)} ${getHeatmapTextColor(count, heatmapData.maxCount)}`}
                      >
                        {count > 0 ? count : '—'}

                        {/* Hover Preview Tooltip */}
                        {isHovered && count > 0 && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-50 min-w-[300px] max-w-[400px]">
                            <div className="text-xs font-semibold text-gray-900 mb-2">
                              {role} in {state} ({count} organization{count !== 1 ? 's' : ''})
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
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <span className="font-medium">Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-blue-100 border border-gray-300"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-blue-400 border border-gray-300"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-blue-800 border border-gray-300"></div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Composition by Top States */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Ecosystem Composition by Top States
        </h3>

        <div className="space-y-6">
          {stateComposition.map(({ state, total, roles }) => (
            <div key={state}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{state}</span>
                <span className="text-sm text-gray-600">{total} organizations</span>
              </div>

              {/* Stacked bar */}
              <div className="relative h-10 bg-gray-100 rounded overflow-hidden mb-2">
                <div className="flex h-full">
                  {roles.map(({ role, percentage }, idx) => (
                    <div
                      key={`${state}-${role}-${idx}`}
                      className="group/segment relative"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: ROLE_COLORS[role] || '#9CA3AF',
                      }}
                      title={`${role}: ${percentage.toFixed(1)}%`}
                    >
                      {percentage > 8 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium px-1 truncate">
                          {role.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend for this state */}
              <div className="flex flex-wrap gap-2">
                {roles.slice(0, 5).map(({ role, count }) => (
                  <div key={role} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: ROLE_COLORS[role] || '#9CA3AF' }}
                    />
                    <span className="text-xs text-gray-600">
                      {role.split(' ')[0]}: {count}
                    </span>
                  </div>
                ))}
                {roles.length > 5 && (
                  <span className="text-xs text-gray-500">+{roles.length - 5} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Filtered Organizations */}
      {showModal && (selectedState || selectedHeatmapCell) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowModal(false);
            setSelectedState(null);
            setSelectedHeatmapCell(null);
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
                  {selectedHeatmapCell
                    ? `${selectedHeatmapCell.role} in ${selectedHeatmapCell.state}`
                    : `Organizations in ${selectedState}`
                  }
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedState(null);
                  setSelectedHeatmapCell(null);
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
                      {org.city || 'Location not specified'}
                    </div>
                    {org.ecosystemRole && org.ecosystemRole.length > 0 && (
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
                  <p className="text-gray-500">No organizations found in this category.</p>
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
                    setSelectedState(null);
                    setSelectedHeatmapCell(null);
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

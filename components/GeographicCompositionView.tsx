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

// Import brand-aligned colors
import { ECOSYSTEM_COLORS } from '@/lib/designTokens';

const ROLE_COLORS: Record<string, string> = ECOSYSTEM_COLORS;

export default function GeographicCompositionView({ organizations, onOrgClick }: GeographicCompositionViewProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{role: string, state: string} | null>(null);
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
    // Using brand colors for heatmap gradient
    const colors = ['bg-[#FBF3E7]', 'bg-[#9DCDC3]', 'bg-[#317E6D]', 'bg-[#1F5F51]', 'bg-[#133931]'];
    return colors[intensity - 1] || colors[0];
  };

  const getHeatmapTextColor = (count: number, maxCount: number) => {
    if (count === 0) return 'text-gray-400';
    const intensity = Math.ceil((count / maxCount) * 5);
    return intensity >= 2 ? 'text-white' : 'text-gray-900';
  };

  const getHeatmapGlow = (count: number, maxCount: number) => {
    if (count === 0) return '';
    const intensity = Math.ceil((count / maxCount) * 5);
    return intensity >= 4 ? 'shadow-lg shadow-[#317E6D]/30' : '';
  };

  return (
    <div className="space-y-6 px-8">
      {/* Role × State Heatmap */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#E6C8A1]">
        <div className="h-2 bg-gradient-to-r from-[#317E6D] to-[#317E6D] rounded-t-2xl" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#317E6D] to-[#317E6D] bg-clip-text text-transparent">
              Role × State Heatmap
            </h3>
            {selectedHeatmapCell && (
              <button
                onClick={() => {
                  setSelectedHeatmapCell(null);
                  setShowModal(false);
                }}
                className="text-sm text-[#CC8D37] hover:text-[#317E6D] font-semibold transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Click any cell to see organizations in that role and state
          </p>

        <div className="overflow-x-auto rounded-xl border-2 border-[#E6C8A1] relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[#E6C8A1] bg-gradient-to-br from-[#FBF3E7] to-[#F4CE99] px-3 py-2 text-left text-xs font-bold text-[#000000] sticky left-0 z-20">
                  Role / State
                </th>
                {heatmapData.states.map(state => (
                  <th
                    key={state}
                    className="border border-[#E6C8A1] bg-gradient-to-br from-[#FBF3E7] to-[#F4CE99] px-3 py-2 text-xs font-bold text-[#000000] min-w-[80px]"
                  >
                    {state}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.roles.map(role => (
                <tr key={role}>
                  <td className="border border-[#E6C8A1] bg-gradient-to-br from-[#FBF3E7] to-[#F4CE99] px-3 py-2 text-xs font-semibold text-[#000000] sticky left-0 z-20 whitespace-nowrap">
                    {role}
                  </td>
                  {heatmapData.states.map(state => {
                    const count = heatmapData.matrix[role]?.[state] || 0;
                    const isSelected = selectedHeatmapCell?.role === role && selectedHeatmapCell?.state === state;

                    return (
                      <td
                        key={`${role}-${state}`}
                        onClick={() => {
                          if (count > 0) {
                            setSelectedHeatmapCell({ role, state });
                            setSelectedState(null);
                            setShowModal(true);
                          }
                        }}
                        className={`border border-[#E6C8A1] px-3 py-2 text-center text-xs font-bold transition-all ${
                          count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-[#CC8D37] hover:scale-105' : ''
                        } ${isSelected ? 'ring-2 ring-[#317E6D]' : ''} ${getHeatmapColor(count, heatmapData.maxCount)} ${getHeatmapTextColor(count, heatmapData.maxCount)} ${getHeatmapGlow(count, heatmapData.maxCount)}`}
                      >
                        {count > 0 ? count : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-[#E6C8A1] flex items-center gap-4 text-xs text-gray-700">
          <span className="font-bold text-[#000000]">Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#FBF3E7] border-2 border-[#E6C8A1] rounded"></div>
            <span className="font-medium">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#317E6D] border-2 border-[#E6C8A1] rounded shadow-sm"></div>
            <span className="font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#1F5F51] border-2 border-[#E6C8A1] rounded shadow-lg shadow-[#317E6D]/30"></div>
            <span className="font-medium">High</span>
          </div>
        </div>
        </div>
      </div>

      {/* Modal for Filtered Organizations */}
      {showModal && (selectedState || selectedHeatmapCell) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => {
            setShowModal(false);
            setSelectedState(null);
            setSelectedHeatmapCell(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#317E6D] to-[#317E6D] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedHeatmapCell
                      ? `${selectedHeatmapCell.role} in ${selectedHeatmapCell.state}`
                      : `Organizations in ${selectedState}`
                    }
                  </h3>
                  <p className="text-sm text-[#FBF3E7] mt-1">
                    {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedState(null);
                    setSelectedHeatmapCell(null);
                  }}
                  className="text-white/80 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-[#FBF3E7]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onOrgClick?.(org.id);
                      setShowModal(false);
                    }}
                    className="text-left bg-white hover:bg-[#FBF3E7] border-2 border-[#E6C8A1] hover:border-[#CC8D37] rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-[#CC8D37]/20 hover:scale-105"
                  >
                    <div className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
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
                            className="inline-block px-2 py-0.5 text-xs rounded-full font-medium shadow-sm"
                            style={{
                              backgroundColor: ROLE_COLORS[role] || '#9CA3AF',
                              color: 'white',
                            }}
                          >
                            {role.split(' ')[0]}
                          </span>
                        ))}
                        {org.ecosystemRole.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#FBF3E7] text-[#000000] font-medium">
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
            <div className="border-t border-[#E6C8A1] p-4 bg-gradient-to-r from-[#FBF3E7] to-[#F4CE99]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 font-medium">
                  Click any organization to view details
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedState(null);
                    setSelectedHeatmapCell(null);
                  }}
                  className="px-6 py-2.5 bg-[#CC8D37] text-white rounded-xl hover:shadow-lg hover:shadow-[#CC8D37]/50 transition-all text-sm font-semibold hover:scale-105"
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

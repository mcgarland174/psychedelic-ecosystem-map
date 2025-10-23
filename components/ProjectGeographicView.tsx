'use client';

import { useMemo, useState } from 'react';

interface Project {
  id: string;
  name: string;
  priorityArea?: string;
  geographicLocation?: string[];
  status?: string;
}

interface ProjectGeographicViewProps {
  projects: Project[];
  onProjectClick?: (projectId: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  'Data & Infrastructure': '#10B981',
  'Field Development & Funding': '#F59E0B',
  'Indigenous Relations & Cultural Equity': '#A855F7',
  'Organizational & Industry Ethics': '#EAB308',
  'Policy & Advocacy': '#EF4444',
  'Practitioner Standards & Workforce': '#3B82F6',
  'Public Education & Communications': '#EC4899',
  'Public Safety & Emergency Response': '#06B6D4',
};

export default function ProjectGeographicView({ projects, onProjectClick }: ProjectGeographicViewProps) {
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{priorityArea: string, location: string} | null>(null);
  const [showModal, setShowModal] = useState(false);

  const locationData = useMemo(() => {
    const locationCount = new Map<string, Set<string>>();

    projects.forEach(project => {
      const locations = project.geographicLocation || ['Unknown'];
      locations.forEach(location => {
        if (!locationCount.has(location)) {
          locationCount.set(location, new Set());
        }
        locationCount.get(location)!.add(project.id);
      });
    });

    return Array.from(locationCount.entries())
      .map(([location, projectIds]) => ({
        location,
        count: projectIds.size,
        percentage: (projectIds.size / projects.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 locations
  }, [projects]);

  // Heatmap data: Priority Area × Location matrix
  const heatmapData = useMemo(() => {
    const topLocations = locationData.slice(0, 10).map(d => d.location);
    const allPriorityAreas = Array.from(new Set(
      projects.map(p => p.priorityArea).filter(Boolean)
    )).sort();

    const matrix: Record<string, Record<string, number>> = {};

    allPriorityAreas.forEach(area => {
      matrix[area] = {};
      topLocations.forEach(location => {
        matrix[area][location] = 0;
      });
    });

    projects.forEach(project => {
      const locations = project.geographicLocation || [];
      const area = project.priorityArea;

      if (area) {
        locations.forEach(location => {
          if (topLocations.includes(location)) {
            if (matrix[area] && matrix[area][location] !== undefined) {
              matrix[area][location]++;
            }
          }
        });
      }
    });

    // Find max count for scaling
    let maxCount = 0;
    Object.values(matrix).forEach(locationData => {
      Object.values(locationData).forEach(count => {
        if (count > maxCount) maxCount = count;
      });
    });

    return { matrix, priorityAreas: allPriorityAreas, locations: topLocations, maxCount };
  }, [projects, locationData]);

  const filteredProjects = useMemo(() => {
    if (!selectedHeatmapCell) return [];
    return projects.filter(project =>
      project.priorityArea === selectedHeatmapCell.priorityArea &&
      project.geographicLocation?.includes(selectedHeatmapCell.location)
    );
  }, [projects, selectedHeatmapCell]);

  const getHeatmapColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-gray-50';
    const intensity = Math.ceil((count / maxCount) * 5);
    // Using brand colors for heatmap gradient
    const colors = ['bg-[#F5EBDD]', 'bg-[#47A8E0]', 'bg-[#007F6E]', 'bg-[#003B73]', 'bg-[#003B73]'];
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
    return intensity >= 4 ? 'shadow-lg shadow-[#007F6E]/30' : '';
  };

  return (
    <div className="space-y-6 px-8">
      {/* Priority Area × Location Heatmap */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#E9D5B8]">
        <div className="h-2 bg-gradient-to-r from-[#003B73] to-[#007F6E] rounded-t-2xl" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#007F6E] to-[#003B73] bg-clip-text text-transparent">
              Priority Area × Location Heatmap
            </h3>
            {selectedHeatmapCell && (
              <button
                onClick={() => {
                  setSelectedHeatmapCell(null);
                  setShowModal(false);
                }}
                className="text-sm text-[#E6543E] hover:text-[#007F6E] font-semibold transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Click any cell to see projects in that priority area and location
          </p>

        <div className="overflow-x-auto rounded-xl border-2 border-[#E9D5B8] relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-[#E9D5B8] bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] px-3 py-2 text-left text-xs font-bold text-[#000000] sticky left-0 z-20">
                  Priority Area / Location
                </th>
                {heatmapData.locations.map(location => (
                  <th
                    key={location}
                    className="border border-[#E9D5B8] bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] px-3 py-2 text-xs font-bold text-[#000000] min-w-[80px]"
                  >
                    {location}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.priorityAreas.map(priorityArea => (
                <tr key={priorityArea}>
                  <td className="border border-[#E9D5B8] bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] px-3 py-2 text-xs font-semibold text-[#000000] sticky left-0 z-20 whitespace-nowrap">
                    {priorityArea}
                  </td>
                  {heatmapData.locations.map(location => {
                    const count = heatmapData.matrix[priorityArea]?.[location] || 0;
                    const isSelected = selectedHeatmapCell?.priorityArea === priorityArea && selectedHeatmapCell?.location === location;

                    return (
                      <td
                        key={`${priorityArea}-${location}`}
                        onClick={() => {
                          if (count > 0) {
                            setSelectedHeatmapCell({ priorityArea, location });
                            setShowModal(true);
                          }
                        }}
                        className={`border border-[#E9D5B8] px-3 py-2 text-center text-xs font-bold transition-all ${
                          count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-[#E6543E] hover:scale-105' : ''
                        } ${isSelected ? 'ring-2 ring-[#007F6E]' : ''} ${getHeatmapColor(count, heatmapData.maxCount)} ${getHeatmapTextColor(count, heatmapData.maxCount)} ${getHeatmapGlow(count, heatmapData.maxCount)}`}
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
        <div className="mt-6 pt-4 border-t border-[#E9D5B8] flex items-center gap-4 text-xs text-gray-700">
          <span className="font-bold text-[#000000]">Intensity:</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#F5EBDD] border-2 border-[#E9D5B8] rounded"></div>
            <span className="font-medium">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#007F6E] border-2 border-[#E9D5B8] rounded shadow-sm"></div>
            <span className="font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-5 bg-[#003B73] border-2 border-[#E9D5B8] rounded shadow-lg shadow-[#007F6E]/30"></div>
            <span className="font-medium">High</span>
          </div>
        </div>
        </div>
      </div>

      {/* Modal for Filtered Projects */}
      {showModal && selectedHeatmapCell && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => {
            setShowModal(false);
            setSelectedHeatmapCell(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#003B73] to-[#007F6E] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedHeatmapCell.priorityArea} in {selectedHeatmapCell.location}
                  </h3>
                  <p className="text-sm text-[#F5EBDD] mt-1">
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
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
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-[#F5EBDD]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onProjectClick?.(project.id);
                      setShowModal(false);
                    }}
                    className="text-left bg-white hover:bg-[#F5EBDD] border-2 border-[#E9D5B8] hover:border-[#E6543E] rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-[#E6543E]/20 hover:scale-105"
                  >
                    <div className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                      {project.name}
                    </div>
                    {project.status && (
                      <div className="text-xs text-gray-600 mb-2">
                        Status: {project.status}
                      </div>
                    )}
                    {project.priorityArea && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span
                          className="inline-block px-2 py-0.5 text-xs rounded-full font-medium shadow-sm"
                          style={{
                            backgroundColor: PRIORITY_COLORS[project.priorityArea] || '#9CA3AF',
                            color: 'white',
                          }}
                        >
                          {project.priorityArea.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects found in this category.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E9D5B8] p-4 bg-gradient-to-r from-[#F5EBDD] to-[#F7DCC3]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 font-medium">
                  Click any project to view details
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedHeatmapCell(null);
                  }}
                  className="px-6 py-2.5 bg-[#E6543E] text-white rounded-xl hover:shadow-lg hover:shadow-[#E6543E]/50 transition-all text-sm font-semibold hover:scale-105"
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

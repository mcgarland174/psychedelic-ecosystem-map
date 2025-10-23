'use client';

import { useState, useMemo } from 'react';
import ProgramBubbleView from './ProgramBubbleView';

interface Program {
  id: string;
  name: string;
  programType?: string;
  programLength?: string;
  stateProvince?: string[];
  price?: number;
  programDescription?: string;
}

interface ProgramsSectionProps {
  programs: Program[];
  onProgramClick?: (programId: string) => void;
}

export default function ProgramsSection({ programs, onProgramClick }: ProgramsSectionProps) {
  const [activeView, setActiveView] = useState<'grouped' | 'geographic' | 'directory'>('grouped');
  const [groupBy, setGroupBy] = useState<'programType' | 'programLength' | 'stateProvince' | 'priceRange'>('programType');
  const [filterType, setFilterType] = useState<string>('none');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to get price range
  const getPriceRange = (price?: number): string => {
    if (price === undefined || price === null) return 'Unknown';
    if (price === 0) return 'Free';
    if (price <= 500) return '$1-500';
    if (price <= 2000) return '$501-2000';
    return '$2000+';
  };

  // Get filter options
  const filterOptions = useMemo(() => {
    const options = new Set<string>();

    switch (filterType) {
      case 'programType':
        programs.forEach(program => {
          if (program.programType) options.add(program.programType);
        });
        break;
      case 'programLength':
        programs.forEach(program => {
          if (program.programLength) options.add(program.programLength);
        });
        break;
      case 'stateProvince':
        programs.forEach(program => {
          program.stateProvince?.forEach(state => options.add(state));
        });
        break;
      case 'priceRange':
        programs.forEach(program => {
          options.add(getPriceRange(program.price));
        });
        break;
    }

    return Array.from(options).sort();
  }, [programs, filterType]);

  // Apply filters
  const filteredPrograms = useMemo(() => {
    if (filterType === 'none' || filterValue === 'all') {
      return programs;
    }

    return programs.filter(program => {
      switch (filterType) {
        case 'programType':
          return program.programType === filterValue;
        case 'programLength':
          return program.programLength === filterValue;
        case 'stateProvince':
          return program.stateProvince?.includes(filterValue);
        case 'priceRange':
          return getPriceRange(program.price) === filterValue;
        default:
          return true;
      }
    });
  }, [programs, filterType, filterValue]);

  // Search filtered programs
  const searchFilteredPrograms = useMemo(() => {
    return filteredPrograms.filter(program => {
      if (searchTerm && !program.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filteredPrograms, searchTerm]);

  // Geographic data
  const geographicData = useMemo(() => {
    const locationCount = new Map<string, { programType: Map<string, number>; total: number }>();

    filteredPrograms.forEach(program => {
      const locations = program.stateProvince || ['Unknown'];
      const type = program.programType || 'Other';

      locations.forEach(location => {
        if (!locationCount.has(location)) {
          locationCount.set(location, { programType: new Map(), total: 0 });
        }
        const data = locationCount.get(location)!;
        data.programType.set(type, (data.programType.get(type) || 0) + 1);
        data.total++;
      });
    });

    return Array.from(locationCount.entries())
      .map(([location, data]) => ({
        location,
        total: data.total,
        breakdown: Array.from(data.programType.entries()).map(([type, count]) => ({ type, count }))
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredPrograms]);

  return (
    <div>
      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Views">
            <button
              onClick={() => setActiveView('grouped')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'grouped'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                Grouped
              </div>
            </button>
            <button
              onClick={() => setActiveView('geographic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'geographic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Geographic
              </div>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'directory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Directory
              </div>
            </button>
          </nav>
        </div>

        {/* View Content */}
        <div className="p-6">
          {/* Grouped View */}
          {activeView === 'grouped' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Group By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group By
                    </label>
                    <select
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="programType">Program Type</option>
                      <option value="programLength">Program Length</option>
                      <option value="stateProvince">State/Province</option>
                      <option value="priceRange">Price Range</option>
                    </select>
                  </div>

                  {/* Filter By (Type) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter By
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setFilterValue('all');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="none">No Filter</option>
                      <option value="programType">Program Type</option>
                      <option value="programLength">Program Length</option>
                      <option value="stateProvince">State/Province</option>
                      <option value="priceRange">Price Range</option>
                    </select>
                  </div>

                  {/* Filter Value */}
                  {filterType !== 'none' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Value
                      </label>
                      <select
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All</option>
                        {filterOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredPrograms.length}</span> programs
                    {filterType !== 'none' && filterValue !== 'all' && (
                      <span className="ml-2 text-gray-500">
                        • Filtered by: <span className="font-semibold">{filterValue}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* D3 Bubble Visualization */}
              <ProgramBubbleView
                programs={filteredPrograms}
                groupBy={groupBy}
                onProgramClick={onProgramClick}
              />
            </div>
          )}

          {/* Geographic View */}
          {activeView === 'geographic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Programs by Geographic Location</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {geographicData.map(location => (
                  <div key={location.location} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{location.location}</h4>
                      <span className="text-2xl font-bold text-purple-600">{location.total}</span>
                    </div>

                    {/* Program Type Breakdown */}
                    <div className="space-y-2">
                      {location.breakdown.map(({ type, count }) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{type}</span>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-1">
                        {location.breakdown.map(({ type, count }) => {
                          const percentage = (count / location.total) * 100;
                          return (
                            <div
                              key={type}
                              className="h-2 rounded bg-purple-500"
                              style={{ width: `${percentage}%` }}
                              title={`${type}: ${count}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {geographicData.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No geographic data available
                </div>
              )}
            </div>
          )}

          {/* Directory View */}
          {activeView === 'directory' && (
            <div className="space-y-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search programs..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Program Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Length</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchFilteredPrograms.map(program => (
                        <tr
                          key={program.id}
                          onClick={() => onProgramClick?.(program.id)}
                          className="hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{program.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{program.programType || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{program.programLength || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{program.stateProvince?.join(', ') || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {program.price !== undefined ? (program.price === 0 ? 'Free' : `$${program.price.toLocaleString()}`) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

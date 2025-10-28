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
  descriptionOfActivities?: string;
  projects?: string[];
  areaOfFocus?: string[];
  substanceOfFocus?: string[];
  populationServed?: string[];
  verified?: boolean;
}

interface TableViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

type SortField = 'name' | 'role' | 'location' | 'type';
type SortDirection = 'asc' | 'desc';

export default function TableView({ organizations, onOrgClick }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<string>('none');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filterOptions = useMemo(() => {
    const options = new Set<string>();

    switch (filterType) {
      case 'ecosystemRole':
        organizations.forEach(org => {
          org.ecosystemRole?.forEach(role => options.add(role));
        });
        break;
      case 'organizationType':
        organizations.forEach(org => {
          org.organizationType?.forEach(type => options.add(type));
        });
        break;
      case 'state':
        organizations.forEach(org => {
          org.state?.forEach(state => options.add(state));
        });
        break;
      case 'country':
        organizations.forEach(org => {
          org.country?.forEach(country => options.add(country));
        });
        break;
    }

    return Array.from(options).sort();
  }, [organizations, filterType]);

  const filteredAndSortedOrgs = useMemo(() => {
    const filtered = organizations.filter(org => {
      // Search filter
      if (searchTerm && !org.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply filter based on type
      if (filterType !== 'none' && filterValue !== 'all') {
        switch (filterType) {
          case 'ecosystemRole':
            if (!org.ecosystemRole?.includes(filterValue)) return false;
            break;
          case 'organizationType':
            if (!org.organizationType?.includes(filterValue)) return false;
            break;
          case 'state':
            if (!org.state?.includes(filterValue)) return false;
            break;
          case 'country':
            if (!org.country?.includes(filterValue)) return false;
            break;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'role':
          aValue = a.ecosystemRole?.[0] || '';
          bValue = b.ecosystemRole?.[0] || '';
          break;
        case 'location':
          aValue = [a.city, a.state?.[0], a.country?.[0]].filter(Boolean).join(', ');
          bValue = [b.city, b.state?.[0], b.country?.[0]].filter(Boolean).join(', ');
          break;
        case 'type':
          aValue = a.organizationType?.[0] || '';
          bValue = b.organizationType?.[0] || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [organizations, searchTerm, sortField, sortDirection, filterType, filterValue]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-[#007F6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-[#007F6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-[#F5EBDD] overflow-auto p-6 space-y-4"
    : "space-y-4 px-8";

  return (
    <div className={containerClasses}>
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md border-2 border-[#E9D5B8] p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter By
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterValue('all');
                  }}
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                >
                  <option value="none">No Filter</option>
                  <option value="ecosystemRole">Ecosystem Role</option>
                  <option value="organizationType">Organization Type</option>
                  <option value="state">State/Province</option>
                  <option value="country">Country</option>
                </select>
              </div>
            </div>

            {filterType !== 'none' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select {filterType === 'ecosystemRole' ? 'Role' :
                          filterType === 'organizationType' ? 'Org Type' :
                          filterType === 'state' ? 'State/Province' : 'Country'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {(filterType === 'state' || filterType === 'country') ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    )}
                  </div>
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73] appearance-none bg-white font-semibold text-gray-900"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                  >
                    <option value="all">All</option>
                    {filterOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E9D5B8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-900">
                Showing <span className="font-bold text-[#007F6E]">{filteredAndSortedOrgs.length}</span> of <span className="font-bold text-[#007F6E]">{organizations.length}</span> organizations
              </span>
              {(searchTerm || (filterType !== 'none' && filterValue !== 'all')) && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-[#E6543E] to-[#A33D2C] text-white text-sm font-bold rounded-full shadow-sm animate-fadeIn">
                  Filtered
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-4 py-2 bg-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#003B73]/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                {isFullscreen ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Fullscreen
                  </>
                )}
              </button>
              {(searchTerm || (filterType !== 'none' && filterValue !== 'all')) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('none');
                    setFilterValue('all');
                  }}
                  className="px-4 py-2 bg-[#E6543E] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6543E]/50 transition-all hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#E9D5B8] overflow-hidden">
        {filteredAndSortedOrgs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#003B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {searchTerm || (filterType !== 'none' && filterValue !== 'all')
                ? "No organizations match your current filters. Try adjusting your search criteria."
                : "No organizations available to display."
              }
            </p>
            {(searchTerm || (filterType !== 'none' && filterValue !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('none');
                  setFilterValue('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#007F6E] to-[#003B73] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#007F6E]/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E9D5B8]">
              <thead className="bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider cursor-pointer hover:bg-[#F7DCC3] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Organization</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider cursor-pointer hover:bg-[#F7DCC3] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Ecosystem Role</span>
                    <SortIcon field="role" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider cursor-pointer hover:bg-[#F7DCC3] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Type</span>
                    <SortIcon field="type" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('location')}
                  className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider cursor-pointer hover:bg-[#F7DCC3] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>Location</span>
                    <SortIcon field="location" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Entity Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Area of Focus
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Substance
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Population
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#000000] uppercase tracking-wider">
                  Projects
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E9D5B8]">
              {filteredAndSortedOrgs.map(org => (
                <tr
                  key={org.id}
                  onClick={() => onOrgClick?.(org.id)}
                  className="hover:bg-[#F5EBDD] cursor-pointer transition-all hover:shadow-md"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="font-medium" style={{ color: '#2B180A' }}>{org.name}</div>
                      {org.verified && (
                        <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" title="Verified Organization">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {org.ecosystemRole?.slice(0, 2).map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-[#F5EBDD] to-[#F7DCC3] text-[#000000] rounded-full border border-[#E9D5B8]"
                        >
                          {role}
                        </span>
                      ))}
                      {org.ecosystemRole && org.ecosystemRole.length > 2 && (
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-[#F5EBDD] text-[#000000] rounded-full border border-[#E9D5B8]">
                          +{org.ecosystemRole.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {org.organizationType?.[0] || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {[org.city, org.state?.[0], org.country?.[0]].filter(Boolean).join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {org.website && (
                      <a
                        href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#E6543E] hover:text-[#007F6E] text-sm font-semibold transition-colors"
                      >
                        Link →
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.entityType || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {org.areaOfFocus?.join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {org.substanceOfFocus?.join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {org.populationServed?.join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-900 truncate">
                      {org.descriptionOfActivities || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.projects?.length || 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

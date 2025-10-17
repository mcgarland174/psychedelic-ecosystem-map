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
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    organizations.forEach(org => {
      org.ecosystemRole?.forEach(role => roles.add(role));
    });
    return Array.from(roles).sort();
  }, [organizations]);

  const allCountries = useMemo(() => {
    const countries = new Set<string>();
    organizations.forEach(org => {
      org.country?.forEach(country => countries.add(country));
    });
    return Array.from(countries).sort();
  }, [organizations]);

  const filteredAndSortedOrgs = useMemo(() => {
    let filtered = organizations.filter(org => {
      // Search filter
      if (searchTerm && !org.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Role filter
      if (filterRole !== 'all' && !org.ecosystemRole?.includes(filterRole)) {
        return false;
      }

      // Country filter
      if (filterCountry !== 'all' && !org.country?.includes(filterCountry)) {
        return false;
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
  }, [organizations, searchTerm, sortField, sortDirection, filterRole, filterCountry]);

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
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ecosystem Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              {allRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {allCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredAndSortedOrgs.length} of {organizations.length} organizations</span>
          {(searchTerm || filterRole !== 'all' || filterCountry !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterCountry('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span>Organization</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span>Ecosystem Role</span>
                    <SortIcon field="role" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span>Type</span>
                    <SortIcon field="type" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('location')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <span>Location</span>
                    <SortIcon field="location" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Website
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrgs.map(org => (
                <tr
                  key={org.id}
                  onClick={() => onOrgClick?.(org.id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{org.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {org.ecosystemRole?.slice(0, 2).map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                      {org.ecosystemRole && org.ecosystemRole.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
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
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Link
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

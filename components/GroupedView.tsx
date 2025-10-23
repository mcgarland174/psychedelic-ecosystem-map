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

interface GroupedViewProps {
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

type GroupingField = 'ecosystemRole' | 'entityType' | 'organizationType' | 'state' | 'country';

export default function GroupedView({ organizations, onOrgClick }: GroupedViewProps) {
  const [groupBy, setGroupBy] = useState<GroupingField>('ecosystemRole');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterOrgType, setFilterOrgType] = useState<string>('all');

  // Get unique values for filters
  const regions = useMemo(() => {
    const allRegions = new Set<string>();
    organizations.forEach(org => {
      org.state?.forEach(state => allRegions.add(state));
    });
    return Array.from(allRegions).sort();
  }, [organizations]);

  const entityTypes = useMemo(() => {
    const types = new Set<string>();
    organizations.forEach(org => {
      if (org.entityType) types.add(org.entityType);
    });
    return Array.from(types).sort();
  }, [organizations]);

  const orgTypes = useMemo(() => {
    const types = new Set<string>();
    organizations.forEach(org => {
      org.organizationType?.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, [organizations]);

  // Apply filters
  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      if (filterRegion !== 'all' && !org.state?.includes(filterRegion)) {
        return false;
      }
      if (filterEntityType !== 'all' && org.entityType !== filterEntityType) {
        return false;
      }
      if (filterOrgType !== 'all' && !org.organizationType?.includes(filterOrgType)) {
        return false;
      }
      return true;
    });
  }, [organizations, filterRegion, filterEntityType, filterOrgType]);

  // Group organizations
  const groupedOrgs = useMemo(() => {
    const groups = new Map<string, Organization[]>();

    filteredOrgs.forEach(org => {
      let groupKeys: string[] = [];

      switch (groupBy) {
        case 'ecosystemRole':
          groupKeys = org.ecosystemRole || ['Other / Unaffiliated'];
          break;
        case 'entityType':
          groupKeys = [org.entityType || 'Unknown'];
          break;
        case 'organizationType':
          groupKeys = org.organizationType || ['Unknown'];
          break;
        case 'state':
          groupKeys = org.state || ['Unknown'];
          break;
        case 'country':
          groupKeys = org.country || ['Unknown'];
          break;
      }

      groupKeys.forEach(key => {
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(org);
      });
    });

    // Sort groups by size (descending)
    return Array.from(groups.entries())
      .map(([key, orgs]) => ({ key, orgs }))
      .sort((a, b) => b.orgs.length - a.orgs.length);
  }, [filteredOrgs, groupBy]);

  const getGroupColor = (key: string) => {
    if (groupBy === 'ecosystemRole') {
      return ROLE_COLORS[key] || '#9CA3AF';
    }
    // Generate a color based on the hash of the key
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Group By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupingField)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ecosystemRole">Ecosystem Role</option>
              <option value="entityType">Entity Type</option>
              <option value="organizationType">Organization Type</option>
              <option value="state">State/Province</option>
              <option value="country">Country</option>
            </select>
          </div>

          {/* Filter: Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Region
            </label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Filter: Entity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Entity Type
            </label>
            <select
              value={filterEntityType}
              onChange={(e) => setFilterEntityType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Entity Types</option>
              {entityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Filter: Org Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Org Type
            </label>
            <select
              value={filterOrgType}
              onChange={(e) => setFilterOrgType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Org Types</option>
              {orgTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredOrgs.length}</span> organizations in{' '}
            <span className="font-semibold">{groupedOrgs.length}</span> groups
          </p>
        </div>
      </div>

      {/* Grouped Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedOrgs.map(({ key, orgs }) => (
          <div
            key={key}
            className="bg-white rounded-lg border-2 shadow-sm overflow-hidden transition-all hover:shadow-lg"
            style={{ borderColor: getGroupColor(key) }}
          >
            {/* Group Header */}
            <div
              className="px-4 py-3 border-b-2"
              style={{
                backgroundColor: `${getGroupColor(key)}15`,
                borderColor: getGroupColor(key),
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="font-bold text-lg truncate"
                  style={{ color: getGroupColor(key) }}
                >
                  {key}
                </h3>
                <span
                  className="text-sm font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: getGroupColor(key),
                    color: 'white',
                  }}
                >
                  {orgs.length}
                </span>
              </div>
            </div>

            {/* Organization List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {orgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => onOrgClick?.(org.id)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 group-hover:text-blue-600 font-medium line-clamp-2">
                        {org.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    {org.city && (
                      <div className="text-xs text-gray-500 mt-1">
                        {org.city}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {groupedOrgs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">
            No organizations match the selected filters
          </p>
          <button
            onClick={() => {
              setFilterRegion('all');
              setFilterEntityType('all');
              setFilterOrgType('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

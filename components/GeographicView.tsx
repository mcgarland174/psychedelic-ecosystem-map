'use client';

import { useMemo, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  city?: string;
  state?: string[];
  country?: string[];
}

interface GeographicViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

export default function GeographicView({ organizations, onOrgClick }: GeographicViewProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const geographicData = useMemo(() => {
    const countryMap = new Map<string, Map<string, Organization[]>>();

    organizations.forEach(org => {
      const countries = org.country || ['Unknown'];
      const states = org.state || ['Unknown'];

      countries.forEach(country => {
        if (!countryMap.has(country)) {
          countryMap.set(country, new Map());
        }
        const stateMap = countryMap.get(country)!;

        states.forEach(state => {
          if (!stateMap.has(state)) {
            stateMap.set(state, []);
          }
          stateMap.get(state)!.push(org);
        });
      });
    });

    return countryMap;
  }, [organizations]);

  const filteredData = useMemo(() => {
    if (selectedCountry === 'all') {
      return Array.from(geographicData.entries()).sort((a, b) => {
        const aTotal = Array.from(a[1].values()).reduce((sum, orgs) => sum + orgs.length, 0);
        const bTotal = Array.from(b[1].values()).reduce((sum, orgs) => sum + orgs.length, 0);
        return bTotal - aTotal;
      });
    }

    const countryData = geographicData.get(selectedCountry);
    if (!countryData) return [];

    if (selectedState === 'all') {
      return [[selectedCountry, countryData]] as [string, Map<string, Organization[]>][];
    }

    const stateOrgs = countryData.get(selectedState);
    if (!stateOrgs) return [];

    const filteredMap = new Map<string, Organization[]>();
    filteredMap.set(selectedState, stateOrgs);
    return [[selectedCountry, new Map([[selectedState, stateOrgs]])]] as [string, Map<string, Organization[]>][];
  }, [geographicData, selectedCountry, selectedState]);

  const countries = useMemo(() => {
    return Array.from(geographicData.keys()).sort();
  }, [geographicData]);

  const states = useMemo(() => {
    if (selectedCountry === 'all') return [];
    const countryData = geographicData.get(selectedCountry);
    return countryData ? Array.from(countryData.keys()).sort() : [];
  }, [geographicData, selectedCountry]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState('all');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State / Province
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={selectedCountry === 'all'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All States/Provinces</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="space-y-4">
        {filteredData.map(([country, stateMap]) => {
          const totalOrgs = Array.from(stateMap.values()).reduce((sum, orgs) => sum + orgs.length, 0);
          const stateEntries = Array.from(stateMap.entries()).sort((a, b) => b[1].length - a[1].length);

          return (
            <div key={country} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Country Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{country}</h3>
                  <span className="text-sm font-semibold text-blue-600">
                    {totalOrgs} {totalOrgs === 1 ? 'organization' : 'organizations'}
                  </span>
                </div>
              </div>

              {/* States/Provinces */}
              <div className="divide-y divide-gray-200">
                {stateEntries.map(([state, orgs]) => (
                  <div key={`${country}-${state}`} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {state}
                      </h4>
                      <span className="text-sm font-medium text-gray-600">
                        {orgs.length} {orgs.length === 1 ? 'org' : 'orgs'}
                      </span>
                    </div>

                    {/* Organizations List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {orgs.map(org => (
                        <div
                          key={org.id}
                          onClick={() => onOrgClick?.(org.id)}
                          className="bg-gray-50 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 cursor-pointer transition-all"
                        >
                          <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {org.name}
                          </div>
                          {org.city && (
                            <div className="text-xs text-gray-600">{org.city}</div>
                          )}
                          {org.ecosystemRole && org.ecosystemRole.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {org.ecosystemRole.slice(0, 2).map((role, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                  {role.length > 15 ? role.substring(0, 15) + '...' : role}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

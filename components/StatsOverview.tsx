'use client';

import { useMemo } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  state?: string[];
  country?: string[];
  organizationType?: string[];
}

interface StatsOverviewProps {
  organizations: Organization[];
}

export default function StatsOverview({ organizations }: StatsOverviewProps) {
  const stats = useMemo(() => {
    const roleCount = new Map<string, number>();
    const stateCount = new Map<string, number>();
    const countryCount = new Map<string, number>();
    const typeCount = new Map<string, number>();

    organizations.forEach(org => {
      // Count roles
      org.ecosystemRole?.forEach(role => {
        roleCount.set(role, (roleCount.get(role) || 0) + 1);
      });

      // Count states
      org.state?.forEach(state => {
        stateCount.set(state, (stateCount.get(state) || 0) + 1);
      });

      // Count countries
      org.country?.forEach(country => {
        countryCount.set(country, (countryCount.get(country) || 0) + 1);
      });

      // Count org types
      org.organizationType?.forEach(type => {
        typeCount.set(type, (typeCount.get(type) || 0) + 1);
      });
    });

    // Get top roles
    const topRoles = Array.from(roleCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Get top states
    const topStates = Array.from(stateCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalOrgs: organizations.length,
      totalRoles: roleCount.size,
      totalStates: stateCount.size,
      totalCountries: countryCount.size,
      totalTypes: typeCount.size,
      topRoles,
      topStates,
    };
  }, [organizations]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Ecosystem Overview</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalOrgs}</div>
          <div className="text-sm text-gray-600">Organizations</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.totalRoles}</div>
          <div className="text-sm text-gray-600">Ecosystem Roles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalStates}</div>
          <div className="text-sm text-gray-600">States/Provinces</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.totalCountries}</div>
          <div className="text-sm text-gray-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">{stats.totalTypes}</div>
          <div className="text-sm text-gray-600">Org Types</div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Roles */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Ecosystem Roles</h3>
          <div className="space-y-2">
            {stats.topRoles.map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 flex-1">{role}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalOrgs) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top States */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top States/Provinces</h3>
          <div className="space-y-2">
            {stats.topStates.map(([state, count]) => (
              <div key={state} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 flex-1">{state}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalOrgs) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

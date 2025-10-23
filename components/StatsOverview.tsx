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

      // Count org types
      org.organizationType?.forEach(type => {
        typeCount.set(type, (typeCount.get(type) || 0) + 1);
      });
    });

    return {
      totalOrgs: organizations.length,
      totalRoles: roleCount.size,
      totalStates: stateCount.size,
      totalTypes: typeCount.size,
    };
  }, [organizations]);

  return (
    <div className="mb-8">
      {/* Executive Dashboard Style Stats */}
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        {/* Feature Card - Larger, spans 2 columns */}
        <div className="md:col-span-2 group relative overflow-hidden rounded-2xl p-8
                      bg-gradient-to-br from-[#007F6E] to-[#003B73]
                      hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border-2 border-[#E9D5B8]">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                        transition-transform duration-1000 bg-gradient-to-r
                        from-transparent via-white/20 to-transparent" />

          <div className="relative z-10">
            <div className="text-6xl font-black text-white mb-2 animate-slideUp">
              {stats.totalOrgs}
            </div>
            <div className="text-white/90 text-lg font-semibold mb-3">Total Organizations</div>
            <div className="flex items-center text-white/80">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm">Ecosystem growth</span>
            </div>
          </div>
        </div>

        {/* Regular Cards with brand colors */}
        <div className="rounded-2xl p-6 bg-[#47A8E0] shadow-lg border-2 border-[#E9D5B8]
                      hover:shadow-xl transition-all duration-300
                      hover:scale-105 cursor-pointer group">
          <div className="relative">
            <div className="text-4xl font-bold text-white mb-2">{stats.totalRoles}</div>
            <div className="text-white/90 text-sm font-semibold">Ecosystem Roles</div>
            <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-[#F4B63A] shadow-lg border-2 border-[#E9D5B8]
                      hover:shadow-xl transition-all duration-300
                      hover:scale-105 cursor-pointer group">
          <div className="relative">
            <div className="text-4xl font-bold text-[#000000] mb-2">{stats.totalStates}</div>
            <div className="text-[#000000]/80 text-sm font-semibold">States/Provinces</div>
            <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-[#A33D2C] shadow-lg border-2 border-[#E9D5B8]
                      hover:shadow-xl transition-all duration-300
                      hover:scale-105 cursor-pointer group">
          <div className="relative">
            <div className="text-4xl font-bold text-white mb-2">{stats.totalTypes}</div>
            <div className="text-white/90 text-sm font-semibold">Org Types</div>
            <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';

interface Project {
  id: string;
  name: string;
  priorityArea?: string;
  typeOfProject?: string[];
  geographicLocation?: string[];
  status?: string;
}

interface ProjectStatsOverviewProps {
  projects: Project[];
}

export default function ProjectStatsOverview({ projects }: ProjectStatsOverviewProps) {
  const stats = useMemo(() => {
    const priorityAreas = new Set<string>();
    const projectTypes = new Set<string>();

    projects.forEach(project => {
      if (project.priorityArea) priorityAreas.add(project.priorityArea);
      project.typeOfProject?.forEach(type => projectTypes.add(type));
    });

    return {
      total: projects.length,
      priorityAreas: priorityAreas.size,
      projectTypes: projectTypes.size,
    };
  }, [projects]);

  return (
    <div className="mb-8">
      {/* Executive Dashboard Style Stats */}
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        {/* Feature Card - Larger, spans 2 columns */}
        <div className="md:col-span-2 group relative overflow-hidden rounded-2xl p-8
                      bg-gradient-to-br from-[#003B73] to-[#007F6E]
                      hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg border-2 border-[#E9D5B8]">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                        transition-transform duration-1000 bg-gradient-to-r
                        from-transparent via-white/20 to-transparent" />

          <div className="relative z-10">
            <div className="text-6xl font-black text-white mb-2 animate-slideUp">
              {stats.total}
            </div>
            <div className="text-white/90 text-lg font-semibold mb-3">Total Projects</div>
            <div className="flex items-center text-white/80">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Active initiatives</span>
            </div>
          </div>
        </div>

        {/* Regular Cards with brand colors */}
        <div className="rounded-2xl p-6 bg-[#F7DCC3] shadow-lg border-2 border-[#E9D5B8]
                      hover:shadow-xl transition-all duration-300
                      hover:scale-105 cursor-pointer group">
          <div className="relative">
            <div className="text-4xl font-bold text-[#000000] mb-2">{stats.priorityAreas}</div>
            <div className="text-[#000000]/80 text-sm font-semibold">Priority Areas</div>
            <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-[#E6543E] shadow-lg border-2 border-[#E9D5B8]
                      hover:shadow-xl transition-all duration-300
                      hover:scale-105 cursor-pointer group">
          <div className="relative">
            <div className="text-4xl font-bold text-white mb-2">{stats.projectTypes}</div>
            <div className="text-white/90 text-sm font-semibold">Project Types</div>
            <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

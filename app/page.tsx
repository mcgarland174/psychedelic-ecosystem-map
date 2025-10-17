'use client';

import { useState, useEffect } from 'react';
import StatsOverview from '@/components/StatsOverview';
import CompositionView from '@/components/CompositionView';
import GeographicCompositionView from '@/components/GeographicCompositionView';
import TableView from '@/components/TableView';
import OrgDetailPanel from '@/components/OrgDetailPanel';

interface Organization {
  id: string;
  name: string;
  organizationType?: string[];
  entityType?: string;
  ecosystemRole?: string[];
  website?: string;
  city?: string;
  state?: string[];
  country?: string[];
  affiliatedPeople?: string[];
  orgToOrgAffiliations?: string[];
}

export default function Home() {
  const [activeView, setActiveView] = useState<'composition' | 'geographic' | 'table'>('composition');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const response = await fetch('/api/organizations');
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrgs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ecosystem data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Psychedelic Ecosystem Map
          </h1>
          <p className="text-gray-600 mt-2">
            Explore organizations, projects, and programs in the psychedelic space
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Overview */}
          <StatsOverview organizations={organizations} />

          {/* View Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Views">
                <button
                  onClick={() => setActiveView('composition')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeView === 'composition'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Composition
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
                  onClick={() => setActiveView('table')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeView === 'table'
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
              {activeView === 'composition' && (
                <CompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />
              )}
              {activeView === 'geographic' && (
                <GeographicCompositionView organizations={organizations} onOrgClick={setSelectedOrgId} />
              )}
              {activeView === 'table' && (
                <TableView organizations={organizations} onOrgClick={setSelectedOrgId} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Organization Detail Modal */}
      {selectedOrgId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <OrgDetailPanel
              orgId={selectedOrgId}
              onClose={() => setSelectedOrgId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

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
}

interface OrgDetailPanelProps {
  orgId: string | null;
  onClose: () => void;
}

export default function OrgDetailPanel({ orgId, onClose }: OrgDetailPanelProps) {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setOrg(null);
      return;
    }

    async function fetchOrg() {
      setLoading(true);
      try {
        const response = await fetch('/api/organizations');
        if (!response.ok) throw new Error('Failed to fetch organizations');

        const orgs = await response.json();
        const foundOrg = orgs.find((o: Organization) => o.id === orgId);
        setOrg(foundOrg || null);
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrg();
  }, [orgId]);

  if (!orgId) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">Organization Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : org ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{org.name}</h3>
          </div>

          {org.ecosystemRole && org.ecosystemRole.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ecosystem Role
              </label>
              <div className="flex flex-wrap gap-2">
                {org.ecosystemRole.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.organizationType && org.organizationType.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Organization Type
              </label>
              <div className="flex flex-wrap gap-2">
                {org.organizationType.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {org.entityType && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Entity Type
              </label>
              <p className="text-gray-900">{org.entityType}</p>
            </div>
          )}

          {(org.city || (org.state && org.state.length > 0) || (org.country && org.country.length > 0)) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <p className="text-gray-900">
                {[
                  org.city,
                  org.state?.[0],
                  org.country?.[0]
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {org.website && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Website
              </label>
              <a
                href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {org.website}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Organization not found</p>
      )}
    </div>
  );
}

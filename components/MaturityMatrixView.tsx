'use client';

import { useMemo, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  entityType?: string;
  organizationType?: string[];
}

interface MaturityMatrixViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

type Quadrant = 'established-infrastructure' | 'emerging-infrastructure' | 'established-delivery' | 'emerging-delivery';

const ROLE_CLASSIFICATION: Record<string, { delivery: boolean; emerging: boolean }> = {
  'Academic & Research': { delivery: false, emerging: false },
  'Funder': { delivery: false, emerging: false },
  'Training & Credentialing': { delivery: false, emerging: false },
  'Clinical Services': { delivery: true, emerging: false },
  'Advocacy': { delivery: true, emerging: false },
  'Media': { delivery: true, emerging: false },
  'Government & Policy': { delivery: true, emerging: false },
  'Community & Peer Support': { delivery: true, emerging: true },
  'Cultural & Indigenous': { delivery: true, emerging: true },
  'Technology & Data Systems': { delivery: false, emerging: true },
  'Industry & Supply Chain': { delivery: false, emerging: true },
  'Spiritual / Religious': { delivery: true, emerging: true },
};

export default function MaturityMatrixView({ organizations, onOrgClick }: MaturityMatrixViewProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | null>(null);

  const quadrantData = useMemo(() => {
    const quadrants = {
      'established-infrastructure': [] as Organization[],
      'emerging-infrastructure': [] as Organization[],
      'established-delivery': [] as Organization[],
      'emerging-delivery': [] as Organization[],
    };

    organizations.forEach(org => {
      const roles = org.ecosystemRole || [];
      const entityType = org.entityType || 'Unknown';

      // Determine if organization is emerging based on entity type
      const isEmerging = entityType === 'Informal/unregistered' || entityType === 'Religious organization';

      // Determine if organization is infrastructure or delivery based on primary role
      const primaryRole = roles[0];
      const classification = ROLE_CLASSIFICATION[primaryRole || ''] || { delivery: false, emerging: false };

      const isDelivery = classification.delivery;
      const isRoleEmerging = classification.emerging;

      // Combine entity type and role classification
      const finalEmerging = isEmerging || isRoleEmerging;

      if (isDelivery && finalEmerging) {
        quadrants['emerging-delivery'].push(org);
      } else if (isDelivery && !finalEmerging) {
        quadrants['established-delivery'].push(org);
      } else if (!isDelivery && finalEmerging) {
        quadrants['emerging-infrastructure'].push(org);
      } else {
        quadrants['established-infrastructure'].push(org);
      }
    });

    return quadrants;
  }, [organizations]);

  const filteredOrgs = selectedQuadrant ? quadrantData[selectedQuadrant] : [];

  const getQuadrantColor = (quadrant: Quadrant) => {
    const colors = {
      'established-infrastructure': 'bg-blue-500',
      'emerging-infrastructure': 'bg-purple-500',
      'established-delivery': 'bg-green-500',
      'emerging-delivery': 'bg-orange-500',
    };
    return colors[quadrant];
  };

  const getQuadrantBgColor = (quadrant: Quadrant) => {
    const colors = {
      'established-infrastructure': 'bg-blue-50 border-blue-200',
      'emerging-infrastructure': 'bg-purple-50 border-purple-200',
      'established-delivery': 'bg-green-50 border-green-200',
      'emerging-delivery': 'bg-orange-50 border-orange-200',
    };
    return colors[quadrant];
  };

  return (
    <div className="space-y-6">
      {/* Matrix Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Ecosystem Maturity Matrix</h3>
        <p className="text-sm text-blue-800 mb-3">
          This matrix shows the balance of your ecosystem across two dimensions:
        </p>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li><strong>Infrastructure vs Delivery:</strong> Organizations that support the ecosystem (research, funding, training) vs those providing direct services (clinical, community, advocacy)</li>
          <li><strong>Established vs Emerging:</strong> Formal organizations (nonprofits, for-profits, government) vs informal/grassroots initiatives</li>
        </ul>
      </div>

      {/* 2x2 Matrix */}
      <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
        <div className="grid grid-cols-2 gap-4 aspect-square max-w-4xl mx-auto">
          {/* Top Left: Emerging Infrastructure */}
          <button
            onClick={() => setSelectedQuadrant('emerging-infrastructure')}
            className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
              selectedQuadrant === 'emerging-infrastructure' ? 'ring-4 ring-purple-300' : ''
            } ${getQuadrantBgColor('emerging-infrastructure')}`}
          >
            <div className="flex flex-col h-full">
              <div className={`text-xs font-semibold text-purple-700 mb-2 px-2 py-1 ${getQuadrantColor('emerging-infrastructure')} bg-opacity-20 rounded inline-block self-start`}>
                EMERGING
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Emerging Infrastructure
              </h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                New platforms, tech tools, and innovative support systems
              </p>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {quadrantData['emerging-infrastructure'].length}
                </div>
                <div className="text-xs text-purple-700">organizations</div>
              </div>
            </div>
          </button>

          {/* Top Right: Established Infrastructure */}
          <button
            onClick={() => setSelectedQuadrant('established-infrastructure')}
            className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
              selectedQuadrant === 'established-infrastructure' ? 'ring-4 ring-blue-300' : ''
            } ${getQuadrantBgColor('established-infrastructure')}`}
          >
            <div className="flex flex-col h-full">
              <div className={`text-xs font-semibold text-blue-700 mb-2 px-2 py-1 ${getQuadrantColor('established-infrastructure')} bg-opacity-20 rounded inline-block self-start`}>
                ESTABLISHED
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Established Infrastructure
              </h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                Universities, foundations, training programs, research institutes
              </p>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {quadrantData['established-infrastructure'].length}
                </div>
                <div className="text-xs text-blue-700">organizations</div>
              </div>
            </div>
          </button>

          {/* Bottom Left: Emerging Delivery */}
          <button
            onClick={() => setSelectedQuadrant('emerging-delivery')}
            className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
              selectedQuadrant === 'emerging-delivery' ? 'ring-4 ring-orange-300' : ''
            } ${getQuadrantBgColor('emerging-delivery')}`}
          >
            <div className="flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Emerging Delivery
              </h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                Grassroots groups, community support, informal practitioners
              </p>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {quadrantData['emerging-delivery'].length}
                </div>
                <div className="text-xs text-orange-700">organizations</div>
              </div>
              <div className={`text-xs font-semibold text-orange-700 mt-4 px-2 py-1 ${getQuadrantColor('emerging-delivery')} bg-opacity-20 rounded inline-block self-start`}>
                DELIVERY
              </div>
            </div>
          </button>

          {/* Bottom Right: Established Delivery */}
          <button
            onClick={() => setSelectedQuadrant('established-delivery')}
            className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
              selectedQuadrant === 'established-delivery' ? 'ring-4 ring-green-300' : ''
            } ${getQuadrantBgColor('established-delivery')}`}
          >
            <div className="flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Established Delivery
              </h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                Clinics, advocacy orgs, media outlets, government agencies
              </p>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {quadrantData['established-delivery'].length}
                </div>
                <div className="text-xs text-green-700">organizations</div>
              </div>
            </div>
          </button>
        </div>

        {/* Axis Labels */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600 max-w-4xl mx-auto">
          <span className="font-medium">← Infrastructure</span>
          <span className="font-medium">Service Delivery →</span>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Ecosystem Balance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Infrastructure Organizations:</span>
                <span className="font-semibold">
                  {quadrantData['established-infrastructure'].length + quadrantData['emerging-infrastructure'].length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Organizations:</span>
                <span className="font-semibold">
                  {quadrantData['established-delivery'].length + quadrantData['emerging-delivery'].length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Maturity Distribution</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Established Organizations:</span>
                <span className="font-semibold">
                  {quadrantData['established-infrastructure'].length + quadrantData['established-delivery'].length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emerging Organizations:</span>
                <span className="font-semibold">
                  {quadrantData['emerging-infrastructure'].length + quadrantData['emerging-delivery'].length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Organizations */}
      {selectedQuadrant && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {selectedQuadrant.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Organizations ({filteredOrgs.length})
            </h3>
            <button
              onClick={() => setSelectedQuadrant(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOrgs.map(org => (
              <button
                key={org.id}
                onClick={() => onOrgClick?.(org.id)}
                className="text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-3 transition-all"
              >
                <div className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {org.name}
                </div>
                {org.ecosystemRole && org.ecosystemRole.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {org.ecosystemRole.slice(0, 2).map((role, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {role.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

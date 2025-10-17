'use client';

interface FilterPanelProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ECOSYSTEM_ROLES = [
  'All Roles',
  'Funder',
  'Media',
  'Government & Policy',
  'Academic & Research',
  'Training & Credentialing',
  'Clinical Services',
  'Community & Peer Support',
  'Spiritual / Religious',
  'Advocacy',
  'Technology & Data Systems',
  'Industry & Supply Chain',
  'Cultural & Indigenous',
  'Other / Unaffiliated'
];

export default function FilterPanel({
  selectedRole,
  onRoleChange,
  searchTerm,
  onSearchChange
}: FilterPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Filter Ecosystem</h2>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Organizations
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Type to search..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ecosystem Role Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ecosystem Role
        </label>
        <select
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ECOSYSTEM_ROLES.map((role) => (
            <option key={role} value={role === 'All Roles' ? 'all' : role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Funder</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
            <span>Media</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
            <span>Government & Policy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Academic & Research</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Training & Credentialing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Clinical Services</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Community & Peer Support</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
            <span>Spiritual / Religious</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span>Advocacy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span>Technology & Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

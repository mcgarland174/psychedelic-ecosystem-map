'use client';

import { useEffect, useState } from 'react';

interface Program {
  id: string;
  name: string;
  organizations?: string[];
  programType?: string;
  programDescription?: string;
  programLength?: string;
  stateProvince?: string[];
  price?: number;
  webpage?: string;
}

interface ProgramDetailPanelProps {
  programId: string | null;
  onClose: () => void;
}

export default function ProgramDetailPanel({ programId, onClose }: ProgramDetailPanelProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!programId) {
      setProgram(null);
      return;
    }

    async function fetchProgram() {
      setLoading(true);
      try {
        const response = await fetch('/api/programs');
        if (!response.ok) throw new Error('Failed to fetch programs');

        const programs = await response.json();
        const foundProgram = programs.find((p: Program) => p.id === programId);
        setProgram(foundProgram || null);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgram();
  }, [programId]);

  if (!programId) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">Program Details</h2>
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
      ) : program ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.name}</h3>
          </div>

          {program.programType && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Program Type
              </label>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {program.programType}
              </span>
            </div>
          )}

          {program.programDescription && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{program.programDescription}</p>
            </div>
          )}

          {program.programLength && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Program Length
              </label>
              <p className="text-gray-900">{program.programLength}</p>
            </div>
          )}

          {program.stateProvince && program.stateProvince.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <div className="flex flex-wrap gap-2">
                {program.stateProvince.map((state, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          )}

          {program.price !== undefined && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price
              </label>
              <p className="text-gray-900 text-2xl font-bold">
                {program.price === 0 ? 'Free' : `$${program.price.toLocaleString()}`}
              </p>
            </div>
          )}

          {program.webpage && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Webpage
              </label>
              <a
                href={program.webpage.startsWith('http') ? program.webpage : `https://${program.webpage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {program.webpage}
              </a>
            </div>
          )}

          {program.organizations && program.organizations.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Associated Organizations ({program.organizations.length})
              </label>
              <p className="text-sm text-gray-600">Click to view organization details</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Program not found</p>
      )}
    </div>
  );
}

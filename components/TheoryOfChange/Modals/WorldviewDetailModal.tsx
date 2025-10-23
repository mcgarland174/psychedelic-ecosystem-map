'use client';

import type { AppWorldview } from '@/lib/data-transformer';
import { useEffect } from 'react';
import { getEditWorldviewUrl } from '@/lib/airtable-forms';
import { LIGHT_BACKGROUNDS, NEUTRALS, PRIMARY } from '@/lib/brand-colors';

interface WorldviewDetailModalProps {
  worldview: AppWorldview;
  onClose: () => void;
}

export default function WorldviewDetailModal({ worldview, onClose }: WorldviewDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        style={{ backgroundColor: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-8 py-6 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${worldview.color || '#6B7280'}15, #FFFFFF)`,
            borderTop: `4px solid ${worldview.color || '#6B7280'}`,
            borderBottom: '1px solid #E6C8A1',
          }}
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
              style={{
                backgroundColor: worldview.color || '#6B7280',
              }}
            >
              {worldview.shortName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#2B180A' }}>{worldview.name}</h2>
              {worldview.shortName && worldview.shortName !== worldview.name && (
                <p className="mt-1" style={{ color: '#4A4643' }}>{worldview.shortName}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            style={{ backgroundColor: '#F7F0E8' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
          >
            <svg className="w-6 h-6" style={{ color: '#2B180A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Cluster Badge */}
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-bold cursor-help"
              style={{ backgroundColor: '#F7F0E8', color: '#2B180A' }}
              title={worldview.clusterDefinition || worldview.cluster}
            >
              📍 {worldview.cluster}
            </span>
          </div>

          {/* Tagline */}
          {worldview.tagline && (
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-l-4 border-teal-500 p-4 rounded-r-lg">
              <p className="text-xl font-medium italic" style={{ color: '#2B180A' }}>
                "{worldview.tagline}"
              </p>
            </div>
          )}

          {/* Description */}
          {worldview.description && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8', border: '1px solid #E6C8A1' }}>
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 flex-shrink-0" style={{ color: '#4A4643' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#2B180A' }}>Overview</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#4A4643' }}>
                    {worldview.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vision */}
          {worldview.vision && (
            <div className="bg-teal-500/10 p-6 rounded-xl border border-teal-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-500 mb-2">Vision</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {worldview.vision}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Approach */}
          {worldview.approach && (
            <div className="bg-cyan-500/10 p-6 rounded-xl border border-cyan-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cyan-500 mb-2">Approach</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {worldview.approach}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Strengths */}
          {worldview.strengths && (
            <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-emerald-500 mb-2">Strengths</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {worldview.strengths}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tensions */}
          {worldview.tensions && (
            <div className="bg-orange-500/10 p-6 rounded-xl border border-orange-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-orange-500 mb-2">Tensions</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {worldview.tensions}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Natural Allies */}
          {worldview.naturalAllies && (
            <div className="bg-pink-500/10 p-6 rounded-xl border border-pink-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-pink-500 mb-2">Natural Allies</h3>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: '#2B180A' }}>
                    {worldview.naturalAllies}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Example Organizations */}
          {worldview.exampleOrgs && worldview.exampleOrgs.length > 0 && (
            <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/30">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-500 mb-3">Example Organizations</h3>
                  <div className="flex flex-wrap gap-2">
                    {worldview.exampleOrgs.map((org, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-500/20 rounded-lg text-sm font-medium" style={{ color: '#2B180A' }}>
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-between items-center" style={{ borderTop: '1px solid #E6C8A1' }}>
          <a
            href={getEditWorldviewUrl(worldview)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#F7F0E8', color: '#2B180A' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAE6CC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7F0E8'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Suggest Edit
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

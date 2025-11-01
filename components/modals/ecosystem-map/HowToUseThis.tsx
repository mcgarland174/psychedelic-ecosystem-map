import React from 'react';

export default function HowToUseThis() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Browse & Filter
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Use filters to narrow by location, organization type, focus area, or other criteria. Visual views help you see patterns and clusters in the field.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Discover Connections
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Find organizations working on similar issues, in similar regions, or from similar worldview perspectives. This can spark partnerships and reduce duplication.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Claim Your Profile
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          If your organization is listed, claim your profile to ensure accuracy and control how you're represented. If you're not listed, submit your organization to increase field visibility.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Find Projects
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Explore specific initiatives to understand what's actually happening on the ground, not just which organizations exist.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Understand the Landscape
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Use geographic and categorical views to see where work is concentrated and where gaps might exist.
        </p>
      </section>
    </div>
  );
}

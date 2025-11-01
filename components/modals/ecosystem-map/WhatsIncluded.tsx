import React from 'react';

export default function WhatsIncluded() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Organizations
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Nonprofits, research institutions, advocacy groups, community organizations, and other entities working in the psychedelic space (currently 764 organizations). Each profile includes basic information, focus areas, and links to their websites.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          Projects
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Specific initiatives, programs, and efforts that organizations have submitted for visibility. Projects address everything from research and policy to education and service delivery.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          Geographic View
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          See where psychedelic work is happening across regions. Current coverage is strongest in areas where we've conducted recent field research—particularly Colorado and the United States broadly—with ongoing expansion to other regions as publicly available information becomes accessible.
        </p>
      </section>
    </div>
  );
}

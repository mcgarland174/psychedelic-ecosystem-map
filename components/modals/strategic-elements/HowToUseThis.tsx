import React from 'react';

export default function HowToUseThis() {
  return (
    <div className="space-y-6">
      <section>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This is a tool for collective sense-making—use it to orient yourself, find collaborators, and contribute to field-wide coordination efforts.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Find Your Alignment
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Explore worldviews to understand where your organization or project fits in the broader landscape
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Discover Allies
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          See who else is working toward similar outcomes from similar perspectives—identify coalition opportunities
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Identify Gaps
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Notice where problems lack sufficient projects or where funding could have the greatest impact
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Support Coordination
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Use this shared language to have clearer conversations about strategy and collaboration
        </p>
      </section>
    </div>
  );
}

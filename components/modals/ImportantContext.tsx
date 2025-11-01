import React from 'react';

export default function ImportantContext() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="text-lg leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          Before diving in, here's important context about how this framework was built and what it represents:
        </p>
      </section>

      {/* Field-Driven Development */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#317E6D' }}>
          Field-Driven Development
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Content reflects 138 stakeholder interviews, summit workshops, and ongoing community input—not top-down expert opinion. This is what the field told us was needed.
        </p>
      </section>

      {/* Worldview Nuance */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#8B6F47' }}>
          Worldview Nuance
        </h3>
        <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
          The seven categories are tools for understanding patterns, not definitive labels for individuals. There are many different perspectives within each orientation—particularly among Indigenous peoples, who represent diverse traditions and do not share a single worldview.
        </p>
        <p className="leading-relaxed font-medium" style={{ color: '#2B180A' }}>
          Most people and organizations align with multiple worldviews, which is expected and valuable.
        </p>
      </section>

      {/* Free & Open Access */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#317E6D' }}>
          Free & Open Access
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          These are free resources for shared improvement. Use what's helpful, provide feedback, or simply explore—no gatekeeping. You can suggest edits whether you're in the tool or not.
        </p>
      </section>

      {/* Living Framework */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#8B6F47' }}>
          Living Framework
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          As the field evolves, so should this map. Your input helps everyone coordinate better.
        </p>
      </section>

      {/* Publicly Available Data */}
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Publicly Available Data
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          All organizational and project information comes from publicly available sources or direct submissions. Organizations can claim and edit their profiles at any time—you control your representation.
        </p>
      </section>

      {/* Bottom Note */}
      <section className="p-6 rounded-xl text-center" style={{ backgroundColor: '#F7F0E8' }}>
        <p className="text-lg font-semibold leading-relaxed" style={{ color: '#2B180A' }}>
          This framework exists to serve the field, not define it. Help us make it better.
        </p>
      </section>
    </div>
  );
}

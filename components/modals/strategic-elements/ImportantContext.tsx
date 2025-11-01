import React from 'react';

export default function ImportantContext() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Descriptive, Not Prescriptive
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          These categories reflect what we heard from the field, not what we invented or believe should exist.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Stakeholder-Validated
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Content went through multiple validation stages: pre-summit circulation, summit workshops, participant portal review (since June 2024), and ongoing expert QA.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Non-Exclusive Categories
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          You likely align with multiple worldviews, and that's expected. This framework helps you see where your alignments are and who shares them.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Worldview Complexity
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          The seven categories necessarily simplify rich complexity. Indigenous peoples, for example, represent diverse traditions and do not share a single worldview. These categories help identify patterns across the field, not define individuals.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Living Framework
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          As the field evolves, so should this map. Tell us what's missing, misrepresented, or needs updating.
        </p>
      </section>
    </div>
  );
}

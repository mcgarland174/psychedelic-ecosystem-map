import React from 'react';

export default function WhatYoullFindHere() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Worldviews
        </h3>
        <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
          Seven distinct perspectives reflecting how different parts of the field understand psychedelics and their role in society. These emerged from systematic analysis of 172 stakeholder orientations across 13 dimensions including change strategy, institutional relationship, knowledge authority, access philosophy, and power dynamic awareness.
        </p>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Most organizations and individuals align with multiple worldviews—these are tools for understanding patterns and finding collaboration opportunities, not labels that define anyone.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Outcomes
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          The five-year goals that stakeholders identified as markers of success. Each outcome is tagged with worldview interest levels (high/medium/low), showing where different perspectives can work toward shared aims and where tensions may exist.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Problems
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          The validated barriers and challenges that the field identified as standing in the way of progress. These were identified through stakeholder interviews, refined through summit workshops, and validated by working groups who committed to addressing them.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Projects
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Initiatives already underway to address these challenges, submitted directly by organizations or gathered from public sources.
        </p>
      </section>
    </div>
  );
}

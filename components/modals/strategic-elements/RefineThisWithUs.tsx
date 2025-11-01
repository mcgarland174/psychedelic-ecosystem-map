import React from 'react';

export default function RefineThisWithUs() {
  return (
    <div className="space-y-6">
      <section>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          At every point in this tool, you can suggest changes:
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Worldview descriptions don't resonate?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Tell us what's missing or misrepresented—we'll refine them.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Disagree with outcome tagging?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Suggest different interest levels (high/medium/low)—if the field agrees, we'll update it.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          See problems that need adjustment?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Propose changes—this list should reflect the field's reality.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Your project addresses problems we haven't linked it to?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Update your project profile to show those connections.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
        <p className="leading-relaxed font-medium" style={{ color: '#2B180A' }}>
          The field is the authority—we're here to organize and support. Your expertise makes this better for everyone.
        </p>
      </section>
    </div>
  );
}

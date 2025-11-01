import React from 'react';

export default function MethodologyOverview() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          Worldview Development
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Surveyed 172 stakeholders across the psychedelic ecosystem (researchers, clinicians, policy advocates, Indigenous practitioners, community organizers, harm reductionists, and more)</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Coded each respondent across 13 dimensions with 148 total codes</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Used Jaccard similarity and K-Medoids/Hierarchical clustering to identify natural groupings</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Selected k=7 clusters based on quantitative metrics (balance, cohesion, stability) and qualitative validation</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Validated profiles with field experts from each orientation</span>
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          Problems & Outcomes Development
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Problems:</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              Bottom-up discovery through interviews → Draft Problems Master document → Field circulation with feedback → Psychedelic Safety Summit half-day workshop → Working group validation → Final integration (48 problems across 8 categories)
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Outcomes:</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              "Magic wand" visioning questions in interviews → Synthesis into structured outcomes → Summit workshopping of 5-year goals → Worldview interest tagging → Success indicator definition (38 outcomes across 8 categories)
            </p>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-xl border-2 border-dashed" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#317E6D' }}>
          <span>💡</span>
          Key Principle
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          This framework describes the field as it is, not as it "should be." We're not advocating for any particular worldview or outcome—we're providing a map to help you navigate.
        </p>
      </section>
    </div>
  );
}

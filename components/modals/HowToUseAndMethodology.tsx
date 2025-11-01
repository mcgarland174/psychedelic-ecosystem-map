import React from 'react';

export default function HowToUseAndMethodology() {
  return (
    <div className="space-y-8">
      {/* How to Use Section */}
      <section>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How to Use This Tool
        </h3>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This tool helps you see how different worldviews lead to different outcomes, the problems blocking those outcomes, and which projects are addressing them. Use it to understand how your work fits in, find collaboration opportunities, and spot gaps where new initiatives are needed.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#317E6D' }}
            >
              1
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#317E6D' }}>
                Choose a Worldview
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                Click on a worldview card to select it (you can select multiple). Each worldview represents a fundamentally different way of thinking about psychedelics in society—these shape what outcomes matter and what problems need solving.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>Tip:</strong> Try selecting multiple worldviews to see where they overlap—that's often where collaboration is easiest.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#317E6D' }}
            >
              2
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#317E6D' }}>
                See What Outcomes Matter
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                After selecting a worldview, the second column shows outcomes that are strongly relevant to that perspective. These are the measurable 5-year goals the field is working toward.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>For Funders:</strong> This helps you see what different stakeholder groups care about most.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#317E6D' }}
            >
              3
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#317E6D' }}>
                Identify the Problems
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                Each outcome links to the problems blocking it. Click on an outcome to see what barriers stand in the way. These problems were identified by field stakeholders as the most pressing coordination challenges.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>For Practitioners:</strong> Find the problems your expertise can solve.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#317E6D' }}
            >
              4
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#317E6D' }}>
                Discover Related Projects
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                See which projects are addressing each problem. This helps you find collaborators, avoid duplication, and identify gaps where new work is needed.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>For Organizers:</strong> Map the ecosystem's capacity around specific challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology & Important Context Section */}
      <section className="pt-8 border-t" style={{ borderColor: '#E0F2EF' }}>
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#2B180A' }}>
          How This Framework Was Developed
        </h3>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
              Research Foundation
            </h4>
            <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span><strong>159 stakeholder interviews</strong> across the psychedelic ecosystem (2022-2024)</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span><strong>Psychedelic Safety Summit</strong> validation with 140 field leaders</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span><strong>Working group refinement</strong> across multiple stakeholder orientations</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span><strong>Systematic coding and clustering</strong> using qualitative and quantitative methods</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              Framework Components
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Worldviews (7 total):</h5>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                  Emerged from analyzing 172 stakeholders across 13 dimensions using Jaccard similarity and K-Medoids clustering. Each represents a distinct perspective on what should change in the psychedelic ecosystem.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Outcomes (38 total):</h5>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                  Field-validated 5-year goals identified through "magic wand" visioning questions, summit workshopping, and stakeholder consensus processes.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Problems (48 across 8 categories):</h5>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                  Bottom-up discovery through interviews, refined through summit validation and working group feedback to identify field-wide coordination challenges.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF8E7', border: '2px solid #CC8D37' }}>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#8B6F47' }}>
              <span>⚠️</span>
              Important Context
            </h4>
            <ul className="space-y-3" style={{ color: '#4A4643' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#CC8D37' }}>•</span>
                <span><strong>This is descriptive, not prescriptive.</strong> We're mapping what stakeholders told us, not advocating for any particular worldview.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#CC8D37' }}>•</span>
                <span><strong>Worldviews aren't boxes.</strong> Most people hold multiple perspectives simultaneously. These are analytical tools, not identity categories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#CC8D37' }}>•</span>
                <span><strong>This framework evolves.</strong> As the field changes, we update based on stakeholder feedback. Your input shapes what this becomes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#CC8D37' }}>•</span>
                <span><strong>Resource distribution is uneven.</strong> Some worldviews have more associated outcomes than others, which may reflect current field emphasis or reveal gaps to address.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

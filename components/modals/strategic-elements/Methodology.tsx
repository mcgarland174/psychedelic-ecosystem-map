import React from 'react';

export default function Methodology() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How This Framework Was Developed
        </h3>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This framework emerged from systematic analysis of stakeholder perspectives across the psychedelic ecosystem. We used rigorous qualitative and quantitative methods to identify natural groupings and validate findings with field experts.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              Worldview Development
            </h4>
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
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              Problems & Outcomes Development
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Problems:</h5>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                  Bottom-up discovery through interviews → Draft Problems Master document → Field circulation with feedback → Psychedelic Safety Summit half-day workshop → Working group validation → Final integration (48 problems across 8 categories)
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Outcomes:</h5>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                  "Magic wand" visioning questions in interviews → Synthesis into structured outcomes → Summit workshopping of 5-year goals → Worldview interest tagging → Success indicator definition (38 outcomes across 8 categories)
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border-2 border-dashed" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#317E6D' }}>
              <span>💡</span>
              Key Principle
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              This framework describes the field as it is, not as it "should be." We're not advocating for any particular worldview or outcome—we're providing a map to help you navigate.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Methodology Section */}
      <section className="pt-8 border-t" style={{ borderColor: '#E0F2EF' }}>
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#2B180A' }}>
          Detailed Methodology
        </h3>

        <div className="space-y-6">
          {/* 13-Dimensional Framework */}
          <div>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              13-Dimensional Framework
            </h4>
            <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
              The seven worldview orientations emerged from systematic analysis of 172 stakeholders across 13 dimensions:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h5 className="font-bold mb-2" style={{ color: '#8B6F47' }}>Strategic Dimensions</h5>
                <ul className="space-y-1 pl-4 text-sm" style={{ color: '#4A4643' }}>
                  <li><strong>Change Strategy:</strong> How should change happen? (7 codes)</li>
                  <li><strong>Purpose/Use Orientation:</strong> Why psychedelics? (8 codes)</li>
                  <li><strong>Beneficiaries:</strong> Who should benefit? (7 codes)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h5 className="font-bold mb-2" style={{ color: '#317E6D' }}>Value & Relationship Dimensions</h5>
                <ul className="space-y-1 pl-4 text-sm" style={{ color: '#4A4643' }}>
                  <li><strong>Institutional Relationship:</strong> Trust or skepticism toward institutions? (9 codes)</li>
                  <li><strong>Tradition vs Innovation:</strong> Honor traditional practices or pioneer new approaches? (11 codes)</li>
                  <li><strong>Individual vs Collective:</strong> Focus on personal autonomy or community benefit? (10 codes)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                <h5 className="font-bold mb-2" style={{ color: '#8B6F47' }}>Epistemic Dimensions</h5>
                <ul className="space-y-1 pl-4 text-sm" style={{ color: '#4A4643' }}>
                  <li><strong>Knowledge Authority:</strong> Who holds legitimate knowledge? (13 codes)</li>
                  <li><strong>Evidence Standards:</strong> What counts as valid evidence? (12 codes)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h5 className="font-bold mb-2" style={{ color: '#8B6F47' }}>Access & Justice Dimensions</h5>
                <ul className="space-y-1 pl-4 text-sm" style={{ color: '#4A4643' }}>
                  <li><strong>Access Philosophy:</strong> Who should have access and how? (14 codes)</li>
                  <li><strong>Power Dynamics Awareness:</strong> Attention to structural oppression? (11 codes)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h5 className="font-bold mb-2" style={{ color: '#317E6D' }}>Implementation Dimensions</h5>
                <ul className="space-y-1 pl-4 text-sm" style={{ color: '#4A4643' }}>
                  <li><strong>Risk Tolerance:</strong> Cautious gatekeeping or experimental openness? (10 codes)</li>
                  <li><strong>Regulatory Stance:</strong> Work within system or challenge fundamentally? (15 codes)</li>
                  <li><strong>Economic Model:</strong> How should this be funded? (11 codes)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
                <p className="font-semibold" style={{ color: '#2B180A' }}>
                  Total Code Space: 148 unique codes across 13 dimensions
                </p>
              </div>
            </div>
          </div>

          {/* Clustering Process */}
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              Clustering Process
            </h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>1.</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Similarity Calculation</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Used Jaccard similarity coefficient to measure alignment between stakeholders, creating a 172×172 similarity matrix.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>2.</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Clustering Algorithms</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Applied both K-Medoids (PAM) and Hierarchical clustering with average linkage.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>3.</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Cluster Selection</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Tested k=5 through k=9. Selected k=7 based on silhouette scores, cluster balance, interpretability, and expert validation.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>4.</span>
                <div>
                  <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Profile Development</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Generated profiles from code frequency analysis and validated with 12+ experts from each worldview orientation.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Validation */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF', border: '2px solid #317E6D' }}>
            <h4 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
              Validation & Iteration
            </h4>
            <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span>Circulated draft worldview profiles to 140 field leaders at Psychedelic Safety Summit</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span>Conducted structured feedback sessions with representatives from each worldview</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span>Refined problem and outcome definitions through working group consensus</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#317E6D' }}>•</span>
                <span>Tested connections and relationships through expert review panels</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

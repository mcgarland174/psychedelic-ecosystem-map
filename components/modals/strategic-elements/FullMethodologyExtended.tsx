import React from 'react';

export default function FullMethodologyExtended() {
  return (
    <div className="space-y-6">
      {/* Worldview Development */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2B180A' }}>
          Worldview Development: 13-Dimensional Framework
        </h2>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          The seven worldview orientations emerged from systematic analysis of 172 stakeholders across 13 dimensions:
        </p>

        <div className="space-y-4">
          {/* Strategic Dimensions */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Strategic Dimensions
            </h3>
            <ul className="space-y-2 pl-4 text-sm" style={{ color: '#4A4643' }}>
              <li><strong>Change Strategy:</strong> How should change happen? (7 codes: policy reform, clinical integration, grassroots organizing, research advancement, etc.)</li>
              <li><strong>Purpose/Use Orientation:</strong> Why psychedelics? (8 codes: medical treatment, spiritual growth, cognitive liberty, harm reduction, etc.)</li>
              <li><strong>Beneficiaries:</strong> Who should benefit? (7 codes: patients, general public, marginalized communities, researchers, etc.)</li>
            </ul>
          </div>

          {/* Value & Relationship Dimensions */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Value & Relationship Dimensions
            </h3>
            <ul className="space-y-2 pl-4 text-sm" style={{ color: '#4A4643' }}>
              <li><strong>Institutional Relationship:</strong> Trust or skepticism toward institutions? (9 codes)</li>
              <li><strong>Tradition vs Innovation:</strong> Honor traditional practices or pioneer new approaches? (11 codes)</li>
              <li><strong>Individual vs Collective:</strong> Focus on personal autonomy or community benefit? (10 codes)</li>
            </ul>
          </div>

          {/* Epistemic Dimensions */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF4E6' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Epistemic Dimensions
            </h3>
            <ul className="space-y-2 pl-4 text-sm" style={{ color: '#4A4643' }}>
              <li><strong>Knowledge Authority:</strong> Who holds legitimate knowledge? (13 codes: scientists, Indigenous elders, lived experience, clinicians, etc.)</li>
              <li><strong>Evidence Standards:</strong> What counts as valid evidence? (12 codes)</li>
            </ul>
          </div>

          {/* Access & Justice Dimensions */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Access & Justice Dimensions
            </h3>
            <ul className="space-y-2 pl-4 text-sm" style={{ color: '#4A4643' }}>
              <li><strong>Access Philosophy:</strong> Who should have access and how? (14 codes)</li>
              <li><strong>Power Dynamics Awareness:</strong> Attention to structural oppression and extraction? (11 codes)</li>
            </ul>
          </div>

          {/* Implementation Dimensions */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Implementation Dimensions
            </h3>
            <ul className="space-y-2 pl-4 text-sm" style={{ color: '#4A4643' }}>
              <li><strong>Risk Tolerance:</strong> Cautious gatekeeping or experimental openness? (10 codes)</li>
              <li><strong>Regulatory Stance:</strong> Work within system or challenge fundamentally? (15 codes)</li>
              <li><strong>Economic Model:</strong> How should this be funded and sustained? (11 codes)</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-xl mt-6" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
          <p className="font-semibold text-center" style={{ color: '#2B180A' }}>
            Total Code Space: 148 unique codes across 13 dimensions
          </p>
        </div>
      </section>

      {/* Clustering Process */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          Clustering Process
        </h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>1.</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Similarity Calculation</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Used Jaccard similarity coefficient to measure alignment between stakeholders. Jaccard(A, B) = |intersection of codes| / |union of codes|. Creates 172×172 similarity matrix.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>2.</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Clustering Algorithms</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Applied both K-Medoids (PAM) and Hierarchical clustering with average linkage</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>3.</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Cluster Selection</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Tested k=5, k=6, k=7, k=8 solutions. k=7 provided best balance of within-cluster cohesion, between-cluster separation, interpretability, and stability.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>4.</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Profile Validation</p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Each worldview profile validated with field experts from that orientation</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Final 7 Orientations */}
      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          Final 7 Orientations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
            <p style={{ color: '#317E6D' }}><strong>Medical Integration</strong> (~28 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
            <p style={{ color: '#317E6D' }}><strong>Pragmatic Policy Reform</strong> (~32 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <p style={{ color: '#8B6F47' }}><strong>Abolitionist Justice</strong> (~24 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <p style={{ color: '#8B6F47' }}><strong>Traditional/Indigenous</strong> (~26 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
            <p style={{ color: '#8B6F47' }}><strong>Scientific Inquiry</strong> (~19 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
            <p style={{ color: '#8B6F47' }}><strong>Clinical Delivery</strong> (~22 respondents)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
            <p style={{ color: '#317E6D' }}><strong>Personal Autonomy</strong> (~21 respondents)</p>
          </div>
        </div>
      </section>

      {/* Problems & Outcomes Development */}
      <section>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2B180A' }}>
          Problems & Outcomes Development: 6-Phase Process
        </h2>

        <div className="space-y-6">
          {/* Problems Development */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
              Problems Development
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 1: Initial Discovery</h4>
                <ul className="text-sm space-y-1" style={{ color: '#4A4643' }}>
                  <li>• 159 stakeholder interviews asking: "What obstacles exist to public health and safety in psychedelics?"</li>
                  <li>• Open-ended questions letting problems emerge organically</li>
                  <li>• No predetermined categories or theory imposed</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 2: First Consolidation</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Synthesized interview patterns into structured problem statements</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 3: Field Circulation</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Distributed to stakeholders for written feedback, incorporated revisions</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 4: Summit Validation</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Half-day workshop with 140 field leaders, collaborative refinement</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 5: Working Group Self-Selection</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Participants chose problems to address, validating urgency</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 6: Final Integration</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Consolidated into 48 validated problems across 8 categories</p>
              </div>
            </div>
          </div>

          {/* Outcomes Development */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
              Outcomes Development
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 1: "Magic Wand" Questions</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Asked: "What do you want to see in 5 years?" Let aspirations emerge from field vision</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 2: Outcome Drafting</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Synthesized visions into structured 5-year goals</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 3: Template Standardization</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Created consistent format with success indicators</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E0F2EF' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 4: Summit Workshopping</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Full-day collaborative development at summit</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 5: Worldview Tagging</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Tagged each outcome with worldview interest levels (High/Medium/Low)</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#2B180A' }}>Phase 6: Success Indicators</h4>
                <p className="text-sm" style={{ color: '#4A4643' }}>Defined concrete indicators and tracking mechanisms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          Key Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#317E6D' }}>159</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Stakeholder interviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#317E6D' }}>172</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Worldview analysis</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#317E6D' }}>13</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Dimensions, 148 codes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#C89860' }}>48</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Validated problems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#317E6D' }}>38</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Five-year outcomes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: '#8B6F47' }}>140</div>
            <div className="text-sm" style={{ color: '#4A4643' }}>Summit participants</div>
          </div>
        </div>
      </section>
    </div>
  );
}

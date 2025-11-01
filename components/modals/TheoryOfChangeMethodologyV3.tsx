import React from 'react';

export default function TheoryOfChangeMethodologyV3() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
          This framework emerged from a two-year process of field research, stakeholder engagement, and iterative refinement. Here's how we developed each component:
        </p>
      </section>

      {/* Problems Section */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          How We Identified Problems
        </h3>
        <div className="space-y-3">
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            Through 159 in-depth interviews with stakeholders across the ecosystem (clinicians, researchers, Indigenous leaders, policy makers, harm reductionists, spiritual guides, and more), we asked:
          </p>
          <div className="pl-4 border-l-2" style={{ borderColor: '#C89860' }}>
            <p className="italic leading-relaxed" style={{ color: '#4A4643' }}>
              "What are the biggest challenges facing the field right now? What's blocking progress on public health and safety? What coordination problems exist that no single organization can solve alone?"
            </p>
          </div>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            We categorized responses, refined them with field leaders, and validated them at a national summit. The result is a map of strategic and coordination challenges—the problems that require collective action to solve.
          </p>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          How We Developed Outcomes
        </h3>
        <div className="space-y-3">
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            For each problem cluster, we asked stakeholders:
          </p>
          <div className="pl-4 border-l-2" style={{ borderColor: '#317E6D' }}>
            <p className="italic leading-relaxed" style={{ color: '#4A4643' }}>
              "If we had a magic wand and solved this problem perfectly, what would the world look like in 5 years? What would be measurably different?"
            </p>
          </div>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            These aspirational but achievable outcomes became our North Stars—specific, measurable goals the field is collectively working toward. We then validated and refined them through multiple rounds of stakeholder feedback.
          </p>
        </div>
      </section>

      {/* Worldviews Section */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#8B6F47' }}>
          How We Mapped Worldviews
        </h3>
        <div className="space-y-3">
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            We realized early on that different stakeholders were using the same words to mean fundamentally different things. One person's "safe use" meant clinical protocols; another's meant spiritual preparation; a third's meant legal decriminalization.
          </p>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            To make sense of this, we conducted a dimensional analysis of stakeholder perspectives, identifying the core axes along which views diverged:
          </p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#8B6F47' }}>•</span>
              <span><strong>Individual vs. Collective Focus:</strong> Should interventions target individuals or communities?</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#8B6F47' }}>•</span>
              <span><strong>Medicalized vs. Non-medicalized:</strong> Is medical oversight essential or restrictive?</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#8B6F47' }}>•</span>
              <span><strong>Harm Reduction vs. Prohibition:</strong> Should we reduce harms from use or prevent use entirely?</span>
            </li>
          </ul>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            The resulting worldviews aren't arbitrary categories—they're fundamentally different philosophies that lead to different priorities, outcomes, and solutions.
          </p>
        </div>
      </section>

      {/* Connections Section */}
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How We Linked Everything Together
        </h3>
        <div className="space-y-3">
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            After identifying problems, outcomes, and worldviews separately, we mapped the relationships between them:
          </p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Worldview ↔ Outcome relevance:</strong> We scored how strongly each outcome mattered to each worldview (High/Medium/Low) based on stakeholder input</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Outcome ↔ Problem blocking:</strong> We mapped which problems were preventing which outcomes from being achieved</span>
            </li>
            <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Problem ↔ Project addressing:</strong> We catalogued which real-world projects are working on which problems</span>
            </li>
          </ul>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            This creates the interactive pathways you see in the tool—traceable connections from worldview to outcome to problem to solution.
          </p>
        </div>
      </section>

      {/* Validation Section */}
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          Validation and Refinement
        </h3>
        <div className="space-y-3">
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            This framework went through multiple rounds of validation:
          </p>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>1.</span>
              <div>
                <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Initial interviews (138 stakeholders)</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Gathered raw data on problems, priorities, and perspectives</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>2.</span>
              <div>
                <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Expert panel review (50+ field leaders)</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Refined categories, validated connections, challenged assumptions</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>3.</span>
              <div>
                <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>National summit testing</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Presented framework to broader field, gathered feedback, made adjustments</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0" style={{ color: '#317E6D' }}>4.</span>
              <div>
                <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>Iterative refinement (ongoing)</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>Continuous updates based on field input and changing conditions</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Limitations Section */}
      <section className="p-6 rounded-xl border-2 border-dashed" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#8B6F47' }}>
          <span>⚠️</span>
          Important Limitations
        </h3>
        <ul className="space-y-2" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span><strong>Simplification is necessary:</strong> Any framework reduces complexity. Real worldviews are more nuanced than our categories suggest.</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span><strong>US-centric bias:</strong> Most interviews were with US-based stakeholders. International perspectives may be underrepresented.</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span><strong>Point-in-time snapshot:</strong> The field is evolving rapidly. What was true in 2023 may not hold in 2025.</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span><strong>Incomplete project data:</strong> Not all projects are captured. Organizations can submit missing projects anytime.</span>
          </li>
        </ul>
      </section>

      {/* Living Framework CTA */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          This Is a Living Framework
        </h3>
        <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
          We designed this tool to be continuously improved by the field. If you see something missing, inaccurate, or outdated, please tell us. If you're working on a problem we didn't list, propose adding it. If a worldview feels mischaracterized, suggest edits.
        </p>
        <p className="text-sm font-medium" style={{ color: '#317E6D' }}>
          The best frameworks are built collaboratively, tested against reality, and refined over time. Help us make this one better.
        </p>
      </section>
    </div>
  );
}

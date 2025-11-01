export default function GettingStarted() {
  return (
    <div className="space-y-8">
      {/* What You'll Find Here Section */}
      <section>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          What You'll Find Here
        </h3>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          The Strategic Elements Explorer helps you navigate the diverse perspectives, shared priorities, and common challenges shaping the psychedelic ecosystem. This framework makes visible what stakeholders told us matters most.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              7 Worldviews
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Different perspectives on what should change in the psychedelic ecosystem. From harm reduction to clinical legitimacy to indigenous sovereignty—each represents a distinct vision for the field's future. These aren't mutually exclusive; most stakeholders hold multiple worldviews simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FEF3E2', borderColor: '#CC8D37' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#CC8D37' }}>
              38 Outcomes
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Specific, measurable changes stakeholders want to see. From "reduced adverse events" to "equitable access" to "policy reform"—these represent the concrete goals different actors pursue. Each outcome links to the worldviews that prioritize it.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F8E8E8', borderColor: '#B85C5C' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#B85C5C' }}>
              8 Problem Categories & 48 Problems
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              The barriers standing in the way of desired outcomes. Organized into categories like "Access & Equity," "Safety & Risk," and "Coordination & Infrastructure"—these represent the challenges stakeholders identified as most urgent. Each problem connects to the outcomes it blocks.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F0F4FF', borderColor: '#5B7CBA' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#5B7CBA' }}>
              Connected Projects
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Real initiatives working to address these problems. See which projects tackle which challenges and how they align with different worldviews and outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use This Section */}
      <section className="pt-8 border-t" style={{ borderColor: '#E0F2EF' }}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How to Use This Tool
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              1. Start with What Resonates
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Click on a <strong>Worldview</strong> that aligns with your perspective. See which outcomes and problems matter most to stakeholders who share that view. Or start with a specific <strong>Problem</strong> you're working on and trace backwards to see which worldviews prioritize solving it.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              2. Explore the Connections
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Click on any element to see its relationships. When you select a worldview, you'll see which outcomes it prioritizes. Select an outcome to see which problems block it and which projects address those problems. The connections reveal strategic alignment opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              3. Find Allies and Opportunities
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Look for overlaps. Where do different worldviews share the same outcomes? Which problems block multiple desired changes? These convergence points often represent the strongest opportunities for collaboration and coordination.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              4. Understand Disagreements
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Notice where worldviews diverge. Some outcomes matter greatly to one perspective but not to others. Some problems are prioritized differently. These differences aren't failures—they're features. Understanding them helps navigate strategic decisions and resource allocation.
            </p>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: '#FFF8E7', border: '2px solid #CC8D37' }}>
          <p className="font-semibold mb-2" style={{ color: '#8B6F47' }}>
            💡 Pro Tip
          </p>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            Use the search and filter functions to find specific topics. Click the filter icon to narrow by category, or use the search bar to find keywords across all elements.
          </p>
        </div>
      </section>
    </div>
  );
}

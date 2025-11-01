export default function GettingStarted() {
  return (
    <div className="space-y-8">
      {/* What's Included Section */}
      <section>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          What's Included
        </h3>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This map provides a comprehensive view of organizations and projects working across the psychedelic ecosystem. Use it to find collaborators, understand the field's capacity, and identify gaps where new work is needed.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              764+ Organizations
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              From research institutions and clinical providers to advocacy groups, harm reduction organizations, and Indigenous-led initiatives—this map captures the diversity of work happening across the field.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FEF3E2', borderColor: '#CC8D37' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#CC8D37' }}>
              Projects & Initiatives
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Specific programs, research studies, advocacy campaigns, and community initiatives. See what work is actively happening and who's leading it.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F8E8E8', borderColor: '#B85C5C' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#B85C5C' }}>
              Geographic Coverage
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Organizations and projects mapped by location, with particular depth in North America and growing coverage globally. Filter by region to find local partners or understand regional dynamics.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F0F4FF', borderColor: '#5B7CBA' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#5B7CBA' }}>
              Focus Areas & Problems Addressed
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Organizations tagged by the problems they address and outcomes they pursue. Connect this data to the Theory of Change Explorer to see strategic alignment.
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
              1. Explore Different Views
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Toggle between <strong>Organizations</strong> and <strong>Projects</strong> tabs to see different levels of the ecosystem. Within each, choose between <strong>Grouped View</strong> (organized by category), <strong>Geographic View</strong> (mapped by location), or <strong>Table View</strong> (sortable list).
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              2. Filter & Search
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Use the search bar to find specific organizations or keywords. Apply filters to narrow by focus area, location, or problem addressed. Combine filters to find exactly what you're looking for.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              3. Click for Details
            </h4>
            <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
              Select any organization or project card to see full details: mission, contact information, focus areas, problems addressed, and related projects. Links to websites and social media are included where available.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3" style={{ color: '#317E6D' }}>
              4. Update or Add Information
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              See outdated info? Organization missing? Use the "Help Us Make This Accurate" button to submit corrections, claim your organization's profile, or add new entries.
            </p>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: '#FFF8E7', border: '2px solid #CC8D37' }}>
          <p className="font-semibold mb-2" style={{ color: '#8B6F47' }}>
            💡 Pro Tip
          </p>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            Use the map in combination with the Theory of Change Explorer to identify strategic gaps—problems that need solving but have few organizations working on them.
          </p>
        </div>
      </section>
    </div>
  );
}

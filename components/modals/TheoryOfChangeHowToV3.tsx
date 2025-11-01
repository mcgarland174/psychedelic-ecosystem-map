import React from 'react';

export default function TheoryOfChangeHowToV3() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          This tool helps you see how different worldviews lead to different outcomes, the problems blocking those outcomes, and which projects are addressing them. Use it to understand how your work fits in, find collaboration opportunities, and spot gaps where new initiatives are needed.
        </p>
      </section>

      {/* 4-Step Process */}
      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How to Use This Tool
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
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

          {/* Step 2 */}
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

          {/* Step 3 */}
          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#C89860' }}
            >
              3
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#8B6F47' }}>
                Find the Problems Blocking Progress
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                The third column shows coordination, infrastructure, and strategic challenges preventing those outcomes from being achieved. Click the info icon to see full problem details, urgency scores, and who's working on them.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>Look for gaps:</strong> Problems with few or no projects are opportunities for new initiatives or collaboration.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
              style={{ backgroundColor: '#C89860' }}
            >
              4
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#8B6F47' }}>
                Discover Projects and Collaborators
              </h4>
              <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
                The fourth column shows real projects working on those problems. Click to see project details, involved organizations, and status. If no one's addressing a problem you care about, that's your cue to propose something.
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
                <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
                  💡 <strong>Reduce duplication:</strong> Before starting a new project, check if someone's already doing similar work you could support or join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Callout */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#317E6D' }}>
          <span>✨</span>
          Key Features
        </h3>
        <ul className="space-y-2" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span><strong>Visual connections:</strong> Lines show relationships between your selections</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span><strong>Multiple selections:</strong> Select multiple items at each stage to see overlaps and synergies</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span><strong>Detailed modals:</strong> Click the info (ℹ️) icon on any card for full information</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span><strong>Active filters:</strong> Track your current path at the top of the page</span>
          </li>
        </ul>
      </section>

      {/* Common Use Cases */}
      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          Common Use Cases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Organizations
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              Find collaborators, identify gaps where your expertise is needed, understand how your work connects to broader field priorities.
            </p>
          </div>
          <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Funders
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              See where funding is most needed, which problems lack adequate support, and how different stakeholder groups prioritize outcomes.
            </p>
          </div>
          <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Researchers
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              Map the field's strategic landscape, understand coordination challenges, analyze how different worldviews shape priorities.
            </p>
          </div>
          <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For New Initiatives
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
              Check what's already being done before starting something new, find problems that need solutions, identify potential partners.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFF4E6' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Help Improve This Tool
        </h3>
        <p className="mb-3 leading-relaxed" style={{ color: '#4A4643' }}>
          This is a living resource. Throughout the tool, you can:
        </p>
        <ul className="space-y-2 mb-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Suggest edits to existing content</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Submit new projects addressing field challenges</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Propose new problems, outcomes, or worldviews</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Flag inaccuracies or missing information</span>
          </li>
        </ul>
        <p className="text-sm font-medium" style={{ color: '#8B6F47' }}>
          Your input makes this more accurate and useful for the entire field.
        </p>
      </section>
    </div>
  );
}

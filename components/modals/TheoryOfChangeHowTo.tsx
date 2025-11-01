import React, { useState } from 'react';

export default function TheoryOfChangeHowTo() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="p-6 rounded-xl text-center" style={{ backgroundColor: '#F7F0E8' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Trace Your Path from Worldview to Solution
        </h3>
        <p className="leading-relaxed max-w-3xl mx-auto" style={{ color: '#4A4643' }}>
          Change Pathways helps you explore how different worldviews lead to different outcomes, problems,
          and projects. Click any step below to learn more.
        </p>
      </section>

      {/* Visual Flow Diagram */}
      <section>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Step 1: Worldviews */}
          <button
            onClick={() => setActiveStep(1)}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
              activeStep === 1 ? 'scale-105 shadow-lg' : ''
            }`}
            style={{
              backgroundColor: activeStep === 1 ? '#E0F2EF' : '#FFFFFF',
              borderColor: activeStep === 1 ? '#317E6D' : '#E5D5C3',
              borderWidth: activeStep === 1 ? '3px' : '2px',
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                style={{ backgroundColor: '#317E6D' }}
              >
                1
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: '#317E6D' }}>
                Worldviews
              </h4>
              <p className="text-xs" style={{ color: '#4A4643' }}>
                Select perspective
              </p>
            </div>
            {/* Arrow */}
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
              style={{ color: '#317E6D' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Step 2: Outcomes */}
          <button
            onClick={() => setActiveStep(2)}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
              activeStep === 2 ? 'scale-105 shadow-lg' : ''
            }`}
            style={{
              backgroundColor: activeStep === 2 ? '#E0F2EF' : '#FFFFFF',
              borderColor: activeStep === 2 ? '#317E6D' : '#E5D5C3',
              borderWidth: activeStep === 2 ? '3px' : '2px',
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                style={{ backgroundColor: '#317E6D' }}
              >
                2
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: '#317E6D' }}>
                Outcomes
              </h4>
              <p className="text-xs" style={{ color: '#4A4643' }}>
                See relevant goals
              </p>
            </div>
            {/* Arrow */}
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
              style={{ color: '#317E6D' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Step 3: Problems */}
          <button
            onClick={() => setActiveStep(3)}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
              activeStep === 3 ? 'scale-105 shadow-lg' : ''
            }`}
            style={{
              backgroundColor: activeStep === 3 ? '#FFF4E6' : '#FFFFFF',
              borderColor: activeStep === 3 ? '#C89860' : '#E5D5C3',
              borderWidth: activeStep === 3 ? '3px' : '2px',
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                style={{ backgroundColor: '#C89860' }}
              >
                3
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: '#8B6F47' }}>
                Problems
              </h4>
              <p className="text-xs" style={{ color: '#4A4643' }}>
                Find barriers
              </p>
            </div>
            {/* Arrow */}
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
              style={{ color: '#C89860' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* Step 4: Projects */}
          <button
            onClick={() => setActiveStep(4)}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
              activeStep === 4 ? 'scale-105 shadow-lg' : ''
            }`}
            style={{
              backgroundColor: activeStep === 4 ? '#FFF4E6' : '#FFFFFF',
              borderColor: activeStep === 4 ? '#C89860' : '#E5D5C3',
              borderWidth: activeStep === 4 ? '3px' : '2px',
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold"
                style={{ backgroundColor: '#C89860' }}
              >
                4
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: '#8B6F47' }}>
                Projects
              </h4>
              <p className="text-xs" style={{ color: '#4A4643' }}>
                Discover solutions
              </p>
            </div>
          </button>
        </div>

        {/* Detail Panel for Active Step */}
        <div
          className="p-6 rounded-xl border-l-4 transition-all"
          style={{
            backgroundColor: activeStep === 1 || activeStep === 2 ? '#E0F2EF' : '#FFF4E6',
            borderColor: activeStep === 1 || activeStep === 2 ? '#317E6D' : '#C89860',
          }}
        >
          {/* Step 1 Details */}
          {activeStep === 1 && (
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#317E6D' }}>
                Step 1: Start with a Worldview
              </h4>
              <p className="mb-4 leading-relaxed" style={{ color: '#4A4643' }}>
                Click on a worldview card to select a fundamental perspective on how psychedelics should be used in society.
                Each worldview represents a distinct philosophy with its own values and approach.
              </p>
              <div className="flex items-start gap-2 text-sm mb-3" style={{ color: '#317E6D' }}>
                <span className="font-bold">→</span>
                <span className="font-medium">Try clicking: "Medical/Clinical" or "Indigenous/Traditional"</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: '#4A4643' }}>
                <span style={{ color: '#317E6D' }}>•</span>
                <span>You can select multiple worldviews to compare different perspectives</span>
              </div>
            </div>
          )}

          {/* Step 2 Details */}
          {activeStep === 2 && (
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#317E6D' }}>
                Step 2: See Relevant Outcomes
              </h4>
              <p className="mb-4 leading-relaxed" style={{ color: '#4A4643' }}>
                After selecting a worldview, the second column reveals the 5-year outcomes most relevant to that perspective.
                These are the measurable goals that align with your chosen worldview.
              </p>
              <div className="flex items-start gap-2 text-sm mb-3" style={{ color: '#317E6D' }}>
                <span className="font-bold">→</span>
                <span className="font-medium">Outcomes are filtered by "High" and "Medium" relevance to your worldview</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: '#4A4643' }}>
                <span style={{ color: '#317E6D' }}>•</span>
                <span>Select one or more outcomes to continue exploring</span>
              </div>
            </div>
          )}

          {/* Step 3 Details */}
          {activeStep === 3 && (
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#8B6F47' }}>
                Step 3: Discover Blocking Problems
              </h4>
              <p className="mb-4 leading-relaxed" style={{ color: '#4A4643' }}>
                The third column shows problems and barriers that are preventing your selected outcomes from being achieved.
                Each problem is color-coded by category.
              </p>
              <div className="flex items-start gap-2 text-sm mb-3" style={{ color: '#C89860' }}>
                <span className="font-bold">ℹ️</span>
                <span className="font-medium">Click the info icon on any card to see detailed information</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: '#4A4643' }}>
                <span style={{ color: '#C89860' }}>•</span>
                <span>Problems show their urgency and feasibility scores to help prioritize</span>
              </div>
            </div>
          )}

          {/* Step 4 Details */}
          {activeStep === 4 && (
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: '#8B6F47' }}>
                Step 4: Explore Active Projects
              </h4>
              <p className="mb-4 leading-relaxed" style={{ color: '#4A4643' }}>
                The final column displays real-world projects that are working to solve your selected problems.
                Click on any project to see full details including organizations involved, status, and impact.
              </p>
              <div className="flex items-start gap-2 text-sm mb-3" style={{ color: '#C89860' }}>
                <span className="font-bold">💡</span>
                <span className="font-medium">Projects show their current status: Active, Proposed, or Planning</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: '#4A4643' }}>
                <span style={{ color: '#C89860' }}>•</span>
                <span>Click projects to learn about organizations, timelines, and how to get involved</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pro Tips */}
      <section className="p-6 rounded-xl border-2 border-dashed" style={{ backgroundColor: '#F7F0E8', borderColor: '#E5D5C3' }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#2B180A' }}>
          <span>💡</span>
          Pro Tips
        </h3>
        <ul className="space-y-2" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Select multiple items at each stage to see overlapping connections and discover synergies</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Visual connection lines show relationships between your selections</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Click the info (ℹ️) icon on any card to open a detailed modal with full information</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Watch the active filters at the top to track your current path through the framework</span>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Use Cases
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Organizations
            </h4>
            <p className="text-sm">
              Understand where your work fits in the broader ecosystem, find collaborators
              working on similar problems, and identify strategic gaps to fill.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Funders
            </h4>
            <p className="text-sm">
              Identify where funding is most needed, see which problems have insufficient
              projects addressing them, and understand the landscape of outcomes different
              initiatives are working toward.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <h4 className="font-bold mb-2" style={{ color: '#317E6D' }}>
              For Researchers
            </h4>
            <p className="text-sm">
              Map the field's strategic priorities, identify coordination challenges, and
              understand how different stakeholder perspectives shape the ecosystem.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Providing Feedback
        </h3>
        <p className="mb-3">
          Throughout the tool, you'll find options to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Suggest edits to existing content</li>
          <li>Propose new worldviews, outcomes, or problems</li>
          <li>Submit projects addressing field challenges</li>
          <li>Flag issues or inaccuracies</li>
        </ul>
        <p className="mt-3 text-sm" style={{ color: '#4A4643' }}>
          Your input helps make this resource more accurate and useful for everyone. This
          is a living tool that improves with community participation.
        </p>
      </section>
    </div>
  );
}

import React from 'react';

export default function TheoryOfChangeMethodology() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Data Sources & Methodology
        </h3>
        <div className="space-y-3">
          <p>
            <strong>Stakeholder-Driven Development:</strong> This framework is based on{' '}
            <strong>2 years of stakeholder interviews and field research</strong>, including{' '}
            <strong>138 in-depth stakeholder interviews</strong> conducted between 2023-2025.
          </p>
          <p>
            Problems and outcomes were workshopped at the summit and validated by field
            participants. We've asked stakeholders to tell us what they think—this process
            has been transparent from the start.
          </p>
          <p>
            Content has been circulated for feedback multiple times: pre-summit, during the
            summit, in the participant portal since June, and through ongoing quality assurance reviews.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Ecosystem Map Data
        </h3>
        <div className="space-y-3">
          <p>
            <strong>Publicly Available Information:</strong> We only gathered publicly
            available information for the ecosystem map. No private contact information is
            shared—only links to organization websites.
          </p>
          <p>
            Organizations can claim and edit their own profiles at any time to ensure
            accuracy and control over how they're represented.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          First Iteration & Continuous Improvement
        </h3>
        <div className="space-y-3">
          <p>
            <strong>This is a first iteration.</strong> This is not a final or comprehensive
            version—it's a starting system that the field can now engage with and improve.
          </p>
          <p>
            We're expecting people to tell us what's missing. This is a living, dynamic
            resource that will evolve based on community feedback and field developments.
          </p>
          <p>
            Built-in feedback mechanisms throughout the tool allow you to suggest edits,
            propose additions, and help make this resource more accurate and useful for everyone.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#2B180A' }}>
          Theory of Change Structure
        </h3>
        <div className="space-y-3">
          <p>
            The framework connects <strong>worldviews → outcomes → problems → projects</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Worldviews:</strong> Seven categories emerged from comprehensive
              stakeholder analysis. These are not singular or homogenized—most people have
              a "heat map" of what they're aligned with.
            </li>
            <li>
              <strong>Outcomes:</strong> Pulled from interviews asking: "What's your vision?
              North Star strategic metrics? If you could wave a magic wand?"
            </li>
            <li>
              <strong>Problems:</strong> The problems list was workshopped at the summit on
              day one with live refinement from field leaders.
            </li>
            <li>
              <strong>Projects:</strong> Initiatives already working to address these challenges,
              submitted directly by organizations or gathered from public sources.
            </li>
          </ul>
        </div>
      </section>

      <section className="pt-4 border-t-2" style={{ borderColor: '#E5D5C3' }}>
        <p className="text-sm" style={{ color: '#4A4643' }}>
          For questions about our methodology or to provide feedback, please use the
          feedback mechanisms throughout the tool or contact us directly.
        </p>
      </section>
    </div>
  );
}

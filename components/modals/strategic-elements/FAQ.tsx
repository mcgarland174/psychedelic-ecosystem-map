import React from 'react';

export default function FAQ() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Q: Why is there more emphasis on some worldviews than others in the outcomes?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          <strong>A:</strong> The current outcomes portfolio reflects the field's current emphasis—more outcomes align with technocratic orientations (Medical Integration, Policy Reform, Scientific Inquiry) than liberatory orientations. This may indicate where field resources are currently concentrated, or it may reveal gaps where additional outcomes should be developed.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Q: How were the 13 dimensions for worldviews chosen?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          <strong>A:</strong> They emerged from analyzing stakeholder interviews and identifying the key axes where perspectives diverge: How should change happen? Who holds authority? What should access look like? We didn't start with 13—we discovered them through systematic qualitative analysis.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Q: Can I see the underlying clustering data?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          <strong>A:</strong> Yes—all methodology documentation, including clustering rationale and dimension definitions, is available in our full methodology section. The clustering code (JavaScript, Python, R) is also available for independent verification.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Q: What if I fundamentally disagree with the entire framework?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          <strong>A:</strong> Tell us why. This tool isn't useful if it doesn't serve the field. If there's a fundamental flaw, we want to know. That said, the framework emerged from 159 interviews and summit validation—so if you disagree with everyone else, it might stay, but we'll note dissenting views.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Q: How do you decide which feedback to incorporate?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          <strong>A:</strong> If multiple stakeholders agree, if it improves accuracy or clarity, or if it addresses an obvious gap, we incorporate it. We document dissenting perspectives even when we don't change the primary framing. If feedback is conflicting, we may create space for multiple viewpoints rather than choosing one "right" answer.
        </p>
      </section>
    </div>
  );
}

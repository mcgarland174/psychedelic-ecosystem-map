import React from 'react';

export default function FAQAndFeedback() {
  return (
    <div className="space-y-8">
      {/* FAQ Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6" style={{ color: '#2B180A' }}>
          Frequently Asked Questions
        </h3>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Q: Why is there more emphasis on some worldviews than others in the outcomes?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>A:</strong> The current outcomes portfolio reflects the field's current emphasis—more outcomes align with technocratic orientations (Medical Integration, Policy Reform, Scientific Inquiry) than liberatory orientations. This may indicate where field resources are currently concentrated, or it may reveal gaps where additional outcomes should be developed.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Q: How were the 13 dimensions for worldviews chosen?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>A:</strong> They emerged from analyzing stakeholder interviews and identifying the key axes where perspectives diverge: How should change happen? Who holds authority? What should access look like? We didn't start with 13—we discovered them through systematic qualitative analysis.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Q: Can I see the underlying clustering data?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>A:</strong> Yes—all methodology documentation, including clustering rationale and dimension definitions, is available in our Methodology section. The clustering code (JavaScript, Python, R) is also available for independent verification.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Q: What if I fundamentally disagree with the entire framework?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>A:</strong> Tell us why. This tool isn't useful if it doesn't serve the field. If there's a fundamental flaw, we want to know. That said, the framework emerged from 159 interviews and summit validation—so if you disagree with everyone else, it might stay, but we'll note dissenting views.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Q: How do you decide which feedback to incorporate?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>A:</strong> If multiple stakeholders agree, if it improves accuracy or clarity, or if it addresses an obvious gap, we incorporate it. We document dissenting perspectives even when we don't change the primary framing. If feedback is conflicting, we may create space for multiple viewpoints rather than choosing one "right" answer.
            </p>
          </div>
        </div>
      </section>

      {/* Refine This With Us Section */}
      <section className="pt-8 border-t" style={{ borderColor: '#E0F2EF' }}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B180A' }}>
          Refine This With Us
        </h3>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          At every point in this tool, you can suggest changes:
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Worldview descriptions don't resonate?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Tell us what's missing or misrepresented—we'll refine them.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              Disagree with outcome tagging?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Suggest different interest levels (high/medium/low)—if the field agrees, we'll update it.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
              See problems that need adjustment?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Propose changes—this list should reflect the field's reality.
            </p>
          </div>

          <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
              Your project addresses problems we haven't linked it to?
            </h4>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              Update your project profile to show those connections.
            </p>
          </div>

          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
            <p className="leading-relaxed font-medium text-center" style={{ color: '#2B180A' }}>
              The field is the authority—we're here to organize and support. Your expertise makes this better for everyone.
            </p>
          </div>

          <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#E0F2EF' }}>
            <p className="mb-4 font-semibold" style={{ color: '#317E6D' }}>
              Ready to share your feedback?
            </p>
            <a
              href="https://airtable.com/appQkt2yYzVKhRaXx/pagbN8oPTu8zDFEhO/form"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
            >
              Submit Feedback →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

export default function FAQ() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="text-lg leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          Common questions about the framework, methodology, and how to contribute:
        </p>
      </section>

      {/* FAQ Items */}
      <section className="space-y-6">
        {/* Q1 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: Why are there only 7 worldviews? That seems too few.
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> We tested k=5, k=6, k=7, and k=8 cluster solutions. Seven provided the best balance of nuance and usability—enough to capture meaningful differences, not so many that patterns become overwhelming. Most people align with multiple worldviews anyway, so this isn't about boxes but about understanding patterns.
          </p>
        </div>

        {/* Q2 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: My organization doesn't fit neatly into one worldview. Is that a problem?
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> Not at all—that's expected and valuable! These categories are tools for understanding patterns across the field, not labels for individuals. Most organizations hold complex positions that span multiple worldviews.
          </p>
        </div>

        {/* Q3 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: How were the problems and outcomes identified?
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> They emerged from 159 stakeholder interviews, were refined through summit workshops with 140 field leaders, and validated through working groups. We synthesized and organized what we heard—we didn't invent or prescribe.
          </p>
        </div>

        {/* Q4 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: How often will this be updated?
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> We're planning monthly review cycles, with ongoing minor updates as feedback comes in. This is a living, dynamic resource.
          </p>
        </div>

        {/* Q5 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: What happens to my feedback?
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> We review all suggestions. If feedback aligns with field validation (others agree, it improves accuracy), we make the change. If it's contested, we may bring it to a broader field conversation. All substantive changes will be documented so the community can see how the tool evolved.
          </p>
        </div>

        {/* Q6 */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#F7F0E8' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
            Q: Can I edit things directly or do I have to wait for approval?
          </h3>
          <p className="leading-relaxed" style={{ color: '#4A4643' }}>
            <strong>A:</strong> Current functionality requires waiting for approval to make changes. We plan to implement future functionality where organizations can directly edit their own profiles based on email verification. For framework elements (worldviews, problems, outcomes), you can suggest changes that we review for field alignment. We're not gatekeeping—we're ensuring that changes reflect field consensus, not just individual preferences.
          </p>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="p-6 rounded-xl border-l-4 text-center" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-3" style={{ color: '#317E6D' }}>
          Still Have Questions?
        </h3>
        <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
          We're here to help. Reach out with any questions, concerns, or suggestions.
        </p>
        <a
          href="https://psychedelicsafetyinstitute.org/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

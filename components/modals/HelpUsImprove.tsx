import React from 'react';

export default function HelpUsImprove() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section>
        <p className="text-lg leading-relaxed mb-4" style={{ color: '#4A4643' }}>
          The tool is designed to allow the ecosystem to express itself. We built the initial framework from what we heard, but the field needs to shape it, correct it, and own it.
        </p>
      </section>

      {/* Main Message */}
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          Throughout the tool, you'll find options to suggest edits at every level:
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💬</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>
                Worldview descriptions don't resonate?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                Suggest an edit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🏷️</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>
                Problem relevance seems off?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                Tell us and we'll adjust the tagging.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">➕</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>
                See a missing outcome or problem?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                Propose it—if the field validates it, we'll add it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🏢</span>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#2B180A' }}>
                Organization misrepresented?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4643' }}>
                Claim the profile and correct it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FFF4E6' }}>
        <p className="text-lg font-semibold mb-3" style={{ color: '#2B180A' }}>
          Your input makes this resource better for everyone.
        </p>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          We've built feedback mechanisms throughout to make it easy to contribute.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <a
          href="https://psychedelicsafetyinstitute.org/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Suggest an Improvement
        </a>
      </section>

      {/* How We Handle Feedback */}
      <section>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#2B180A' }}>
          How We Handle Your Feedback
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>We review all suggestions.</strong> If feedback aligns with field validation (others agree, it improves accuracy), we make the change.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>If it's contested,</strong> we may bring it to a broader field conversation.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F7F0E8' }}>
            <p className="leading-relaxed" style={{ color: '#4A4643' }}>
              <strong>All substantive changes will be documented</strong> so the community can see how the tool evolved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

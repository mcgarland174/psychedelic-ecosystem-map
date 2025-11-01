import React from 'react';

export default function PrivacyAndConsent() {
  return (
    <div className="space-y-6">
      <section>
        <p className="leading-relaxed mb-6 text-lg font-medium" style={{ color: '#2B180A' }}>
          We respect that not all psychedelic work can or should be public.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Your Choice, Your Control
        </h3>
        <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
          Be in this map or don't, be named or not—do what works for your organization. We understand that work can remain private for safety, legal, community, or other valid reasons.
        </p>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          If you're listed and want to be removed, or if you want to adjust how you're represented, that's completely within your rights. Contact us or use the "Report issue" function, and we'll respond promptly.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Contributor Review Period
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          Before launching this map publicly, we provided a two-week review period for all organizations included. This gave contributors the opportunity to review their profiles, request changes, or request removal before the map went live.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          What We Collect
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Only publicly available information from organization websites and public filings</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Information that organizations directly submit through our forms</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>We do not share private contact information—profiles link to organization websites where visitors can find your preferred contact methods</span>
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
          Questions or Concerns?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          If you have any questions about how we handle information, want to request changes to your profile, or would like to be removed from the map, please contact us directly. We're committed to respecting your privacy and organizational autonomy.
        </p>
      </section>
    </div>
  );
}

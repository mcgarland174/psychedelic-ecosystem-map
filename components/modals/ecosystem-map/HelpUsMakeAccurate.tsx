import React from 'react';

export default function HelpUsMakeAccurate() {
  return (
    <div className="space-y-6">
      <section>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This map relies on publicly available information and self-reporting. We need your help to keep it accurate and comprehensive.
        </p>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Organization Profile Needs Updates?
        </h3>
        <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
          If your organization is listed but the information is outdated or incorrect, claim your profile to make corrections directly.
        </p>
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pag7ssRGDlHJylwFr/form"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
        >
          Claim Your Profile →
        </a>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          We Missed Your Organization?
        </h3>
        <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
          If you know of an organization doing psychedelic-related work that isn't on this map, help us expand coverage by submitting it.
        </p>
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pag7exiNQcO65VQvk/form"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#8B6F47', color: '#FFFFFF' }}
        >
          Suggest a Missing Organization →
        </a>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Project Descriptions Don't Capture Problems?
        </h3>
        <p className="leading-relaxed mb-3" style={{ color: '#4A4643' }}>
          If your project addresses specific validated problems from our framework but that's not reflected in the description, update your project profile to show those connections.
        </p>
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#C89860', color: '#FFFFFF' }}
        >
          Submit or Update a Project →
        </a>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Categorization Doesn't Fit?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          If the tags, focus areas, or worldview alignment don't accurately represent your organization, claim your profile and adjust them. You control how you're categorized.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '2px solid #E5D5C3' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#2B180A' }}>
          Found a Technical Issue?
        </h3>
        <p className="leading-relaxed" style={{ color: '#4A4643' }}>
          If you notice broken links, display problems, or other technical issues, use the "Report issue" button or contact us directly so we can fix it.
        </p>
      </section>
    </div>
  );
}

import React from 'react';

export default function ForOrganizations() {
  return (
    <div className="space-y-6">
      <section>
        <p className="leading-relaxed mb-6" style={{ color: '#4A4643' }}>
          This tool is designed to increase your visibility and help you find collaborators. Claiming your profile ensures the information is accurate and gives you control over how you're represented. You can also submit project briefs to highlight specific initiatives you'd like the field to know about.
        </p>
      </section>

      <section className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#317E6D' }}>
          What You Can Do
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
            <span style={{ color: '#317E6D' }}>•</span>
            <div>
              <strong>Update your information:</strong> Change your organization description, focus areas, contact details
            </div>
          </li>
          <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
            <span style={{ color: '#317E6D' }}>•</span>
            <div>
              <strong>Add projects:</strong> Highlight specific initiatives you want the field to know about
            </div>
          </li>
          <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
            <span style={{ color: '#317E6D' }}>•</span>
            <div>
              <strong>Link to problems:</strong> Show which validated problems your work addresses
            </div>
          </li>
          <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
            <span style={{ color: '#317E6D' }}>•</span>
            <div>
              <strong>Tag worldview alignment:</strong> Help others understand your perspective and find collaboration opportunities
            </div>
          </li>
          <li className="flex items-start gap-2" style={{ color: '#4A4643' }}>
            <span style={{ color: '#317E6D' }}>•</span>
            <div>
              <strong>Control your visibility:</strong> Choose how much information to display or request removal if needed
            </div>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pag7ssRGDlHJylwFr/form"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl text-center font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
        >
          Claim Your Profile →
        </a>
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pageM5eDaUnswgwAN/form"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl text-center font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#8B6F47', color: '#FFFFFF' }}
        >
          Submit a Project →
        </a>
        <a
          href="https://airtable.com/appQkt2yYzVKhRaXx/pag7exiNQcO65VQvk/form"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl text-center font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: '#C89860', color: '#FFFFFF' }}
        >
          Suggest a Missing Organization →
        </a>
      </section>
    </div>
  );
}

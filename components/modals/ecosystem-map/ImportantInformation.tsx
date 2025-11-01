import React from 'react';

export default function ImportantInformation() {
  return (
    <div className="space-y-6">
      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Publicly Available Information Only
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>We gathered information from organization websites, public filings, and direct submissions</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>No private or non-public data is included</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>We don't share private contact information—each profile links to the organization's website where you can find their preferred contact methods</span>
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#F7F0E8', borderColor: '#8B6F47' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#8B6F47' }}>
          Self-Reporting & Organization Control
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>Organizations can claim and edit their own profiles at any time</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>The accuracy of information depends on organizations keeping their profiles current</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#8B6F47' }}>•</span>
            <span>You control your representation—claim your profile to ensure it's accurate</span>
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-xl border-2 border-dashed" style={{ backgroundColor: '#FFF4E6', borderColor: '#C89860' }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#8B6F47' }}>
          <span>⚠️</span>
          Not an Endorsement
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>Inclusion in this map does not constitute endorsement, validation, quality assessment, or medical advice by PSI</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>This is a discovery tool, not a recommendation engine</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#C89860' }}>•</span>
            <span>All content is for educational purposes only</span>
          </li>
        </ul>
      </section>

      <section className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#E0F2EF', borderColor: '#317E6D' }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
          Growing Coverage
        </h3>
        <ul className="space-y-2 pl-4" style={{ color: '#4A4643' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Geographic and topical coverage reflects our field research priorities and publicly available information</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Coverage will expand over time as we engage new regions and communities</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>Current emphasis on U.S.-based organizations reflects both research focus and information accessibility</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#317E6D' }}>•</span>
            <span>We respect that not all psychedelic work can or should be public—if your work needs to remain private, that's completely valid</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

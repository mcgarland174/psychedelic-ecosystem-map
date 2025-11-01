'use client';

import { useEffect, useState } from 'react';
import InfoModal from './InfoModal';

export default function BetaWarningModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the beta warning
    const hasSeenBetaWarning = localStorage.getItem('hasSeenBetaWarning');

    if (!hasSeenBetaWarning) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenBetaWarning', 'true');
    setIsOpen(false);
  };

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Beta Launch: Help Us Improve"
    >
      <div className="space-y-6">
        {/* Main Message */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFF8E7', border: '2px solid #CC8D37' }}>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#8B6F47' }}>
                This Tool is in Beta
              </h3>
              <p className="leading-relaxed" style={{ color: '#4A4643' }}>
                You're viewing an early version of this tool that is currently undergoing ecosystem review and refinement. The framework, connections, and content are being actively validated by field stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold" style={{ color: '#2B180A' }}>
            What This Means
          </h4>
          <ul className="space-y-3 pl-4" style={{ color: '#4A4643' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Content is being refined:</strong> Worldview descriptions, outcomes, and problem definitions are being reviewed and updated based on stakeholder feedback.</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Connections may shift:</strong> The relationships between worldviews, outcomes, and problems are being validated and may be adjusted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#317E6D' }}>•</span>
              <span><strong>Your input matters:</strong> This tool improves through field expertise—if something doesn't resonate or seems missing, we want to know.</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#E0F2EF', border: '2px solid #317E6D' }}>
          <h4 className="text-lg font-bold mb-3" style={{ color: '#317E6D' }}>
            How You Can Help
          </h4>
          <p className="leading-relaxed mb-4" style={{ color: '#4A4643' }}>
            Explore the tool, review the framework, and share your perspective. Your feedback helps ensure this resource accurately reflects the field's diversity and complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://airtable.com/appQkt2yYzVKhRaXx/pagbN8oPTu8zDFEhO/form"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all hover:scale-105 text-center"
              style={{ backgroundColor: '#317E6D', color: '#FFFFFF' }}
            >
              Submit Feedback
              <span>→</span>
            </a>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all hover:scale-105 text-center"
              style={{ backgroundColor: '#FFFFFF', color: '#317E6D', border: '2px solid #317E6D' }}
            >
              Explore the Tool
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-center" style={{ color: '#8B6F47' }}>
          This message will only appear once. You can access feedback and methodology information anytime through the links at the bottom of each page.
        </p>
      </div>
    </InfoModal>
  );
}

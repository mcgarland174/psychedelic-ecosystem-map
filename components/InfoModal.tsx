import React, { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#FBF3E7' }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b-2"
            style={{
              backgroundColor: '#FBF3E7',
              borderColor: '#E5D5C3'
            }}
          >
            <h2
              id="modal-title"
              className="text-2xl font-bold"
              style={{ color: '#2B180A' }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                style={{ color: '#317E6D' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div
              className="prose prose-sm md:prose-base max-w-none"
              style={{ color: '#4A4643' }}
            >
              {children}
            </div>
          </div>

          {/* Footer */}
          <div
            className="sticky bottom-0 px-6 py-4 border-t-2 flex justify-end"
            style={{
              backgroundColor: '#FBF3E7',
              borderColor: '#E5D5C3'
            }}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{
                backgroundColor: '#317E6D',
                color: '#FFFFFF'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}

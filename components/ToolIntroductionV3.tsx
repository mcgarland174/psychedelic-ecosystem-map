import React from 'react';

interface ToolIntroductionV3Props {
  title: string;
  subtitle: string;
  calloutText?: string;
  calloutIcon?: string;
  bodyText: string;
  links?: Array<{
    text: string;
    onClick: () => void;
  }>;
  modalLinks?: Array<{
    text: string;
    onClick: () => void;
  }>;
}

export default function ToolIntroductionV3({
  title,
  subtitle,
  calloutText,
  calloutIcon = '📊',
  bodyText,
  links = [],
  modalLinks = []
}: ToolIntroductionV3Props) {
  return (
    <div
      className="w-full relative"
      style={{
        backgroundColor: '#FBF3E7',
        paddingBottom: '60px'
      }}
    >
      <div
        className="max-w-5xl mx-auto px-6 py-12 md:py-16"
        style={{
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Title */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center"
          style={{ color: '#2B180A', letterSpacing: '-0.02em' }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <h2
          className="text-base md:text-lg font-medium mb-10 text-center max-w-3xl mx-auto"
          style={{ color: '#317E6D' }}
        >
          {subtitle}
        </h2>

        {/* Callout Box */}
        {calloutText && (
          <div
            className="mb-10 p-8 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E0F2EF',
              boxShadow: '0 2px 8px rgba(49, 126, 109, 0.08)'
            }}
          >
            <p
              className="text-base md:text-lg leading-relaxed text-center"
              style={{ color: '#2B180A' }}
            >
              {calloutText}
            </p>
          </div>
        )}

        {/* Body Text */}
        <div
          className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto whitespace-pre-line mb-10"
          style={{ color: '#4A4643', lineHeight: '1.8' }}
        >
          {bodyText}
        </div>

        {/* Modal Links - Integrated at bottom of intro */}
        {modalLinks.length > 0 && (
          <div
            className="pt-8 mt-8"
            style={{
              borderTop: '1px solid rgba(49, 126, 109, 0.2)'
            }}
          >
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 justify-center items-center">
              {modalLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="text-sm sm:text-base font-semibold hover:underline transition-colors"
                  style={{ color: '#317E6D' }}
                >
                  {link.text} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scroll Indicator Arrow */}
        <div className="flex flex-col items-center mt-16 animate-bounce">
          <p className="text-sm font-medium mb-2" style={{ color: '#8B6F47' }}>
            Explore the tool below
          </p>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: '#317E6D' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

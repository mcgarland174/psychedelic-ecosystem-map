import React from 'react';

interface ToolIntroductionV2Props {
  title: string;
  subtitle: string;
  bodyText: string;
  links?: Array<{
    text: string;
    onClick: () => void;
  }>;
}

export default function ToolIntroductionV2({
  title,
  subtitle,
  bodyText,
  links = []
}: ToolIntroductionV2Props) {
  return (
    <div
      className="w-full relative"
      style={{
        backgroundColor: '#FBF3E7',
        borderRadius: '0 0 40px 40px',
        paddingBottom: '120px'
      }}
    >
      {/* Proposal B: Rounded bottom corners for overlap effect */}
      <div
        className="max-w-4xl mx-auto px-4 py-6 md:py-12"
        style={{
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Title */}
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center"
          style={{ color: '#2B180A' }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <h2
          className="text-lg md:text-xl lg:text-2xl font-semibold mb-6 text-center"
          style={{ color: '#317E6D' }}
        >
          {subtitle}
        </h2>

        {/* Body Text */}
        <div
          className="text-sm md:text-base leading-relaxed mb-6 whitespace-pre-line"
          style={{ color: '#4A4643' }}
        >
          {bodyText}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={link.onClick}
              className="text-sm md:text-base font-medium hover:underline transition-all"
              style={{ color: '#317E6D' }}
            >
              {link.text} →
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

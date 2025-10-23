'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { getDefinition, type TermDefinition } from '@/lib/terminology-definitions';

interface TermTooltipProps {
  term: string;
  /** Optional custom definition - if not provided, will look up from definitions file */
  definition?: string;
  /** Show examples if available */
  showExamples?: boolean;
  /** Show related terms if available */
  showRelated?: boolean;
  iconSize?: number;
  iconClassName?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Use a different icon style */
  variant?: 'info' | 'help';
}

export default function TermTooltip({
  term,
  definition: customDefinition,
  showExamples = false,
  showRelated = false,
  iconSize = 16,
  iconClassName = '',
  position = 'top',
  variant = 'info'
}: TermTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Look up definition if not provided
  const termDef = customDefinition ? undefined : getDefinition(term);
  const displayDefinition = customDefinition || termDef?.shortDefinition || 'No definition available';

  // Adjust tooltip position to keep it within viewport
  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const tooltip = tooltipRef.current;
      const button = buttonRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition = position;

      // Check horizontal overflow
      if (tooltipRect.right > viewportWidth - 10) {
        // Tooltip overflows right edge
        newPosition = 'left';
      } else if (tooltipRect.left < 10) {
        // Tooltip overflows left edge
        newPosition = 'right';
      }

      // Check vertical overflow
      if (tooltipRect.top < 10) {
        // Tooltip overflows top edge
        newPosition = 'bottom';
      } else if (tooltipRect.bottom > viewportHeight - 10) {
        // Tooltip overflows bottom edge
        newPosition = 'top';
      }

      setAdjustedPosition(newPosition);
    }
  }, [isVisible, position]);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  const Icon = variant === 'help' ? HelpCircle : Info;

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        className={`inline-flex items-center justify-center rounded-full transition-all hover:bg-teal-50 p-1 ${iconClassName}`}
        aria-label={`More information about ${term}`}
        aria-expanded={isVisible}
      >
        <Icon size={iconSize} className="text-teal-500 hover:text-teal-600" />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-4 py-3 text-sm rounded-xl shadow-2xl max-w-sm whitespace-normal border-2 ${positionClasses[adjustedPosition]}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E6C8A1',
            color: '#2B180A'
          }}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Term Title */}
          {termDef && (
            <div className="font-bold mb-2 text-teal-700 text-base">
              {termDef.term}
            </div>
          )}

          {/* Definition */}
          <div className="leading-relaxed" style={{ color: '#4A4643' }}>
            {displayDefinition}
          </div>

          {/* Long Definition (if available and different from short) */}
          {termDef?.longDefinition && termDef.longDefinition !== termDef.shortDefinition && (
            <div className="mt-2 text-xs leading-relaxed" style={{ color: '#6B6764' }}>
              {termDef.longDefinition}
            </div>
          )}

          {/* Examples */}
          {showExamples && termDef?.examples && termDef.examples.length > 0 && (
            <div className="mt-3 pt-2 border-t" style={{ borderColor: '#E6C8A1' }}>
              <div className="text-xs font-semibold mb-1 text-teal-600">Examples:</div>
              <ul className="text-xs space-y-1" style={{ color: '#6B6764' }}>
                {termDef.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-1.5 text-teal-500">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Terms */}
          {showRelated && termDef?.relatedTerms && termDef.relatedTerms.length > 0 && (
            <div className="mt-3 pt-2 border-t" style={{ borderColor: '#E6C8A1' }}>
              <div className="text-xs font-semibold mb-1 text-teal-600">Related:</div>
              <div className="flex flex-wrap gap-1">
                {termDef.relatedTerms.map((related, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 border border-teal-200"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[adjustedPosition]}`}
            style={{ borderColor: '#E6C8A1' }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Inline text with tooltip - wraps term text with an underline and adds tooltip
 */
interface TermTextProps {
  term: string;
  children: React.ReactNode;
  showExamples?: boolean;
  showRelated?: boolean;
}

export function TermText({ term, children, showExamples, showRelated }: TermTextProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="border-b border-dotted border-teal-500 cursor-help">
        {children}
      </span>
      <TermTooltip
        term={term}
        iconSize={14}
        showExamples={showExamples}
        showRelated={showRelated}
      />
    </span>
  );
}

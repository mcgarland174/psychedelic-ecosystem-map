'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Program {
  id: string;
  name: string;
  programType?: string;
  programLength?: string;
  stateProvince?: string[];
  price?: number;
}

interface ProgramBubbleViewProps {
  programs: Program[];
  groupBy: 'programType' | 'programLength' | 'stateProvince' | 'priceRange';
  onProgramClick?: (programId: string) => void;
}

export default function ProgramBubbleView({ programs, groupBy, onProgramClick }: ProgramBubbleViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [expandedBubble, setExpandedBubble] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });

  // Helper to get price range
  const getPriceRange = (price?: number): string => {
    if (price === undefined || price === null) return 'Unknown';
    if (price === 0) return 'Free';
    if (price <= 500) return '$1-500';
    if (price <= 2000) return '$501-2000';
    return '$2000+';
  };

  // Group programs
  const bubbleData = useMemo(() => {
    const groups = new Map<string, Program[]>();

    programs.forEach(program => {
      let groupKeys: string[] = [];

      switch (groupBy) {
        case 'programType':
          groupKeys = program.programType ? [program.programType] : ['Unknown'];
          break;
        case 'programLength':
          groupKeys = program.programLength ? [program.programLength] : ['Unknown'];
          break;
        case 'stateProvince':
          groupKeys = program.stateProvince || ['Unknown'];
          break;
        case 'priceRange':
          groupKeys = [getPriceRange(program.price)];
          break;
      }

      groupKeys.forEach(key => {
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(program);
      });
    });

    return Array.from(groups.entries())
      .map(([key, items]) => ({
        key,
        items,
        count: items.length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [programs, groupBy]);

  const getColor = (key: string) => {
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = 270 + (hash % 60); // Purple range: 270-330
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.max(600, container.clientHeight),
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render bubbles with D3
  useEffect(() => {
    if (!svgRef.current || bubbleData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous
    svg.selectAll('*').remove();

    // Create hierarchy for bubble packing
    const root = d3.hierarchy({ children: bubbleData } as any)
      .sum((d: any) => d.count || 0);

    const pack = d3.pack()
      .size([width - 40, height - 40])
      .padding(10);

    const nodes = pack(root).leaves();

    // Create groups for bubbles
    const bubbleGroups = svg
      .append('g')
      .attr('transform', `translate(20, 20)`)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        if (expandedBubble === d.data.key) {
          setExpandedBubble(null);
        } else {
          setExpandedBubble(d.data.key);
        }
      });

    // Add circles
    bubbleGroups
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d: any) => getColor(d.data.key))
      .attr('fill-opacity', 0.7)
      .attr('stroke', (d: any) => getColor(d.data.key))
      .attr('stroke-width', 2)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('r', (d: any) => d.r);

    // Add labels
    bubbleGroups.each(function(d: any) {
      const group = d3.select(this);
      const textGroup = group.append('g')
        .attr('opacity', 0);

      // Category name
      textGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.2em')
        .style('font-size', Math.max(10, Math.min(d.r / 4, 20)) + 'px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.5)')
        .text(d.data.key);

      // Count
      textGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .style('font-size', Math.max(10, Math.min(d.r / 5, 18)) + 'px')
        .style('font-weight', '600')
        .style('fill', 'white')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.5)')
        .text(`(${d.data.count})`);

      textGroup
        .transition()
        .duration(800)
        .delay(400)
        .attr('opacity', 1);
    });

    // Hover effects
    bubbleGroups
      .on('mouseenter', function() {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('fill-opacity', 0.9)
          .attr('stroke-width', 4);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('fill-opacity', 0.7)
          .attr('stroke-width', 2);
      });

    // Click outside to collapse
    svg.on('click', () => setExpandedBubble(null));

  }, [bubbleData, dimensions, expandedBubble, groupBy]);

  const expandedData = bubbleData.find(b => b.key === expandedBubble);

  return (
    <div className="relative bg-gray-50 rounded-lg" style={{ minHeight: '600px' }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      />

      {/* Expanded bubble view */}
      {expandedBubble && expandedData && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg animate-fadeIn">
          <div className="w-full h-full p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getColor(expandedBubble) }}
                >
                  {expandedData.count}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{expandedBubble}</h3>
                  <p className="text-sm text-gray-600">{expandedData.count} programs</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedBubble(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Program Table */}
            <div className="overflow-y-auto max-h-[calc(100%-120px)]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Program Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expandedData.items.map(program => (
                    <tr
                      key={program.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProgramClick?.(program.id);
                        setExpandedBubble(null);
                      }}
                      className="hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {program.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {program.programType || 'Not specified'}
                      </td>
                      <td className="px-4 py-3">
                        {program.price !== undefined && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                            {program.price === 0 ? 'Free' : `$${program.price.toLocaleString()}`}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

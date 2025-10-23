'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Organization {
  id: string;
  name: string;
  ecosystemRole?: string[];
  entityType?: string;
  organizationType?: string[];
  city?: string;
  state?: string[];
  country?: string[];
}

interface BubbleViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
}

// Import brand-aligned colors
import { ECOSYSTEM_COLORS } from '@/lib/designTokens';

const ROLE_COLORS: Record<string, string> = ECOSYSTEM_COLORS;

type GroupingField = 'ecosystemRole' | 'entityType' | 'organizationType' | 'state' | 'country';

interface BubbleData {
  key: string;
  orgs: Organization[];
  count: number;
  x?: number;
  y?: number;
  r?: number;
}

export default function BubbleView({ organizations, onOrgClick }: BubbleViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [groupBy, setGroupBy] = useState<GroupingField>('ecosystemRole');
  const [filterType, setFilterType] = useState<string>('none');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [expandedBubble, setExpandedBubble] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });

  // Get filter options based on selected filter type
  const filterOptions = useMemo(() => {
    const options = new Set<string>();

    switch (filterType) {
      case 'ecosystemRole':
        organizations.forEach(org => {
          org.ecosystemRole?.forEach(role => options.add(role));
        });
        break;
      case 'entityType':
        organizations.forEach(org => {
          if (org.entityType) options.add(org.entityType);
        });
        break;
      case 'organizationType':
        organizations.forEach(org => {
          org.organizationType?.forEach(type => options.add(type));
        });
        break;
      case 'state':
        organizations.forEach(org => {
          org.state?.forEach(state => options.add(state));
        });
        break;
      case 'country':
        organizations.forEach(org => {
          org.country?.forEach(country => options.add(country));
        });
        break;
    }

    return Array.from(options).sort();
  }, [organizations, filterType]);

  // Apply filters
  const filteredOrgs = useMemo(() => {
    if (filterType === 'none' || filterValue === 'all') {
      return organizations;
    }

    return organizations.filter(org => {
      switch (filterType) {
        case 'ecosystemRole':
          return org.ecosystemRole?.includes(filterValue);
        case 'entityType':
          return org.entityType === filterValue;
        case 'organizationType':
          return org.organizationType?.includes(filterValue);
        case 'state':
          return org.state?.includes(filterValue);
        case 'country':
          return org.country?.includes(filterValue);
        default:
          return true;
      }
    });
  }, [organizations, filterType, filterValue]);

  // Group organizations into bubbles
  const bubbleData = useMemo(() => {
    const groups = new Map<string, Organization[]>();

    filteredOrgs.forEach(org => {
      let groupKeys: string[] = [];

      switch (groupBy) {
        case 'ecosystemRole':
          groupKeys = org.ecosystemRole || ['Other / Unaffiliated'];
          break;
        case 'entityType':
          groupKeys = [org.entityType || 'Unknown'];
          break;
        case 'organizationType':
          groupKeys = org.organizationType || ['Unknown'];
          break;
        case 'state':
          groupKeys = org.state || ['Unknown'];
          break;
        case 'country':
          groupKeys = org.country || ['Unknown'];
          break;
      }

      groupKeys.forEach(key => {
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(org);
      });
    });

    return Array.from(groups.entries())
      .map(([key, orgs]) => ({
        key,
        orgs,
        count: orgs.length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOrgs, groupBy]);

  const getColor = (key: string) => {
    if (groupBy === 'ecosystemRole') {
      return ROLE_COLORS[key] || '#9CA3AF';
    }
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
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

    // Add gradient and glow filter definitions
    const defs = svg.append('defs');

    // Create glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create hierarchy for bubble packing
    const root = d3.hierarchy({ children: bubbleData } as any)
      .sum((d: any) => d.count || 0);

    const pack = d3.pack()
      .size([width - 60, height - 60])
      .padding(30);

    const nodes = pack(root).leaves();

    // Create gradient definitions for each bubble
    nodes.forEach((node: any, i: number) => {
      const color = getColor(node.data.key);
      const gradient = defs.append('radialGradient')
        .attr('id', `gradient-${i}`)
        .attr('cx', '35%')
        .attr('cy', '35%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.7);
    });

    // Create groups for bubbles
    const bubbleGroups = svg
      .append('g')
      .attr('transform', `translate(30, 30)`)
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

    // Add circles with gradients and colored glow
    bubbleGroups
      .append('circle')
      .attr('r', 0)
      .attr('fill', (d: any, i: number) => `url(#gradient-${i})`)
      .attr('stroke', (d: any) => getColor(d.data.key))
      .attr('stroke-width', 2)
      .style('filter', (d: any) => {
        const color = getColor(d.data.key);
        return `drop-shadow(0 0 15px ${color}80)`;
      })
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('r', (d: any) => d.r);

    // Add labels with white text for dark background
    bubbleGroups.each(function(d: any) {
      const group = d3.select(this);
      const textGroup = group.append('g')
        .attr('opacity', 0);

      const radius = d.r;
      const nameFontSize = Math.max(11, Math.min(radius / 4, 18));
      const countFontSize = Math.max(18, Math.min(radius / 2.5, 36));

      // Multi-layer elegant shadow
      const elegantShadow = '0 1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)';
      const elegantCountShadow = '0 1px 3px rgba(0,0,0,0.35), 0 3px 6px rgba(0,0,0,0.25), 0 6px 12px rgba(0,0,0,0.15)';

      // Category name - split into multiple lines if needed
      const words = d.data.key.split(' ');
      const lineHeight = nameFontSize * 1.2;

      if (words.length > 2 && radius > 50) {
        // Multi-line for longer text
        const midpoint = Math.ceil(words.length / 2);
        const line1 = words.slice(0, midpoint).join(' ');
        const line2 = words.slice(midpoint).join(' ');

        textGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `-${lineHeight + 8}px`)
          .style('font-size', nameFontSize + 'px')
          .style('font-weight', '500')
          .style('letter-spacing', '0.5px')
          .style('fill', 'white')
          .style('text-shadow', elegantShadow)
          .text(line1);

        textGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `-2px`)
          .style('font-size', nameFontSize + 'px')
          .style('font-weight', '500')
          .style('letter-spacing', '0.5px')
          .style('fill', 'white')
          .style('text-shadow', elegantShadow)
          .text(line2);

        // Count below
        textGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `${lineHeight + 12}px`)
          .style('font-size', countFontSize + 'px')
          .style('font-weight', '600')
          .style('letter-spacing', '0.5px')
          .style('fill', 'white')
          .style('text-shadow', elegantCountShadow)
          .text(d.data.count);
      } else {
        // Single line for shorter text
        textGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `-${countFontSize * 0.35}px`)
          .style('font-size', nameFontSize + 'px')
          .style('font-weight', '500')
          .style('letter-spacing', '0.5px')
          .style('fill', 'white')
          .style('text-shadow', elegantShadow)
          .text(d.data.key);

        // Count
        textGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', `${countFontSize * 0.65}px`)
          .style('font-size', countFontSize + 'px')
          .style('font-weight', '600')
          .style('letter-spacing', '0.5px')
          .style('fill', 'white')
          .style('text-shadow', elegantCountShadow)
          .text(d.data.count);
      }

      textGroup
        .transition()
        .duration(800)
        .delay(400)
        .attr('opacity', 1);
    });

    // Hover effects with enhanced glow
    bubbleGroups
      .on('mouseenter', function(event, d: any) {
        const color = getColor(d.data.key);
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .style('filter', `drop-shadow(0 0 25px ${color})`);
      })
      .on('mouseleave', function(event, d: any) {
        const color = getColor(d.data.key);
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .style('filter', `drop-shadow(0 0 15px ${color}80)`);
      });

    // Click outside to collapse
    svg.on('click', () => setExpandedBubble(null));

  }, [bubbleData, dimensions, expandedBubble, groupBy]);

  const expandedData = bubbleData.find(b => b.key === expandedBubble);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#E9D5B8] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#003B73] to-[#007F6E]" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Group By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Group By
              </label>
              <select
                value={groupBy}
                onChange={(e) => {
                  setGroupBy(e.target.value as GroupingField);
                  setExpandedBubble(null);
                }}
                className="w-full px-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73]"
              >
                <option value="ecosystemRole">Ecosystem Role</option>
                <option value="entityType">Entity Type</option>
                <option value="organizationType">Organization Type</option>
                <option value="state">State/Province</option>
                <option value="country">Country</option>
              </select>
            </div>

            {/* Filter By (Type) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter By
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterValue('all');
                  setExpandedBubble(null);
                }}
                className="w-full px-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73]"
              >
                <option value="none">No Filter</option>
                <option value="ecosystemRole">Ecosystem Role</option>
                <option value="entityType">Entity Type</option>
                <option value="organizationType">Organization Type</option>
                <option value="state">State/Province</option>
                <option value="country">Country</option>
              </select>
            </div>

            {/* Filter Value */}
            {filterType !== 'none' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select {filterType === 'ecosystemRole' ? 'Role' :
                          filterType === 'entityType' ? 'Entity Type' :
                          filterType === 'organizationType' ? 'Org Type' :
                          filterType === 'state' ? 'State/Province' : 'Country'}
                </label>
                <select
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                    setExpandedBubble(null);
                  }}
                  className="w-full px-4 py-2.5 border-2 border-[#E9D5B8] rounded-xl focus:ring-2 focus:ring-[#007F6E] focus:border-[#007F6E] transition-all hover:border-[#003B73]"
                >
                  <option value="all">All</option>
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-[#E9D5B8]">
            <p className="text-sm text-gray-700">
              Showing <span className="font-bold text-[#007F6E]">{filteredOrgs.length}</span> organizations in{' '}
              <span className="font-bold text-[#007F6E]">{bubbleData.length}</span> groups
              {filterType !== 'none' && filterValue !== 'all' && (
                <span className="ml-2 text-gray-600">
                  • Filtered by: <span className="font-bold text-[#007F6E]">{filterValue}</span>
                </span>
              )}
              {expandedBubble && (
                <span className="ml-2 text-[#007F6E]">
                  • Viewing: <span className="font-bold">{expandedBubble}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Bubble Visualization */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#E9D5B8] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#003B73] to-[#007F6E]" />
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#007F6E] to-[#003B73] bg-clip-text text-transparent">
              {expandedBubble ? `${expandedBubble} Organizations` : 'Category Bubbles'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {expandedBubble
                ? 'Click an organization bubble to view details, or click outside to go back'
                : 'Click a bubble to explore organizations'
              }
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl overflow-hidden shadow-inner" style={{ minHeight: '600px' }}>
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full"
            />

          {/* Expanded bubble view - org list with dark theme */}
          {expandedBubble && expandedData && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 27, 75, 0.98) 100%)',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.4s ease-out'
              }}
            >
              <div className="w-full h-full p-8 flex flex-col">
                {/* Header with bubble color accent */}
                <div
                  className="flex items-center justify-between mb-6 pb-4 border-b-2 rounded"
                  style={{
                    borderColor: getColor(expandedBubble),
                    boxShadow: `0 4px 12px ${getColor(expandedBubble)}30`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${getColor(expandedBubble)} 0%, ${getColor(expandedBubble)}CC 100%)`,
                        boxShadow: `0 0 20px ${getColor(expandedBubble)}60`
                      }}
                    >
                      {expandedData.count}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{expandedBubble}</h3>
                      <p className="text-sm text-gray-300">{expandedData.count} organizations</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedBubble(null);
                    }}
                    className="text-gray-400 hover:text-white transition-all hover:scale-110"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Organization Grid with staggered animation */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expandedData.orgs.map((org, index) => (
                      <div
                        key={org.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOrgClick?.(org.id);
                          setExpandedBubble(null);
                        }}
                        className="bg-slate-800/50 hover:bg-slate-700/70 border-2 border-slate-700 hover:border-[#E6543E] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                          animation: `slideUp 0.4s ease-out ${index * 0.03}s backwards`,
                          borderColor: `${getColor(expandedBubble)}30`
                        }}
                      >
                        <div className="font-semibold text-white text-sm mb-2 line-clamp-2">
                          {org.name}
                        </div>
                        <div className="text-xs text-gray-400 mb-3">
                          {[org.city, org.state?.[0], org.country?.[0]]
                            .filter(Boolean)
                            .join(', ') || 'Location not specified'}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {org.ecosystemRole?.slice(0, 2).map((role, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 text-xs rounded-full text-white font-medium shadow-sm"
                              style={{ backgroundColor: getColor(role) }}
                            >
                              {role.split(' ')[0]}
                            </span>
                          ))}
                          {org.ecosystemRole && org.ecosystemRole.length > 2 && (
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#007F6E]/40 text-[#F5EBDD] font-medium">
                              +{org.ecosystemRole.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {bubbleData.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#E9D5B8] p-12 text-center">
          <div className="h-2 bg-gradient-to-r from-[#003B73] to-[#007F6E] rounded-t-2xl -mt-12 mb-10" />
          <p className="text-gray-500 text-lg mb-4">
            No organizations match the selected filters
          </p>
          <button
            onClick={() => {
              setFilterType('none');
              setFilterValue('all');
            }}
            className="px-6 py-3 bg-[#E6543E] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E6543E]/50 transition-all hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

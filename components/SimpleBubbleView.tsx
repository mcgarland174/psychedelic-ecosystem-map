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

interface SimpleBubbleViewProps {
  organizations: Organization[];
  onOrgClick?: (orgId: string) => void;
  hideControls?: boolean;
  // Controlled props for state management
  chartType?: 'bubble' | 'bar';
  onChartTypeChange?: (type: 'bubble' | 'bar') => void;
  groupBy?: GroupingField;
  onGroupByChange?: (field: GroupingField) => void;
  filterType?: string;
  onFilterTypeChange?: (type: string) => void;
  filterValue?: string;
  onFilterValueChange?: (value: string) => void;
}

type GroupingField = 'ecosystemRole' | 'entityType' | 'organizationType' | 'state' | 'country';

// Warm Earth Tones palette - alternating between teals and golds for visual interest
const BRAND_COLORS = [
  '#317E6D', // teal (primary)
  '#CC8D37', // gold
  '#1F5F51', // forestTeal
  '#E99D33', // amber
  '#9DCDC3', // lightTeal
  '#EFB566', // lightGold
  '#133931', // darkTeal
  '#F4CE99', // paleGold
  '#2E6D6E', // tealBlue
  '#B66A00', // bronze
  '#3E7B6E', // mediumTeal
  '#E48400', // brightOrange
  '#194C41', // deepGreen
  '#894F00', // darkBrown
  '#48A5CC', // skyBlue (accent)
];

export default function SimpleBubbleView({
  organizations,
  onOrgClick,
  hideControls = false,
  chartType: chartTypeProp,
  onChartTypeChange,
  groupBy: groupByProp,
  onGroupByChange,
  filterType: filterTypeProp,
  onFilterTypeChange,
  filterValue: filterValueProp,
  onFilterValueChange,
}: SimpleBubbleViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Use internal state only if controlled props not provided
  const [internalGroupBy, setInternalGroupBy] = useState<GroupingField>('ecosystemRole');
  const [internalFilterType, setInternalFilterType] = useState<string>('none');
  const [internalFilterValue, setInternalFilterValue] = useState<string>('all');
  const [internalChartType, setInternalChartType] = useState<'bubble' | 'bar'>('bubble');

  const [expandedBubble, setExpandedBubble] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Use controlled or internal state
  const groupBy = groupByProp ?? internalGroupBy;
  const setGroupBy = onGroupByChange ?? setInternalGroupBy;
  const filterType = filterTypeProp ?? internalFilterType;
  const setFilterType = onFilterTypeChange ?? setInternalFilterType;
  const filterValue = filterValueProp ?? internalFilterValue;
  const setFilterValue = onFilterValueChange ?? setInternalFilterValue;
  const chartType = chartTypeProp ?? internalChartType;
  const setChartType = onChartTypeChange ?? setInternalChartType;

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
      .map(([key, orgs], index) => ({
        key,
        orgs,
        count: orgs.length,
        color: BRAND_COLORS[index % BRAND_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOrgs, groupBy]);

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

  // Render visualization with D3 (bubble or bar chart)
  useEffect(() => {
    if (!svgRef.current || bubbleData.length === 0) return;

    // Don't render until we have valid dimensions
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous
    svg.selectAll('*').remove();

    if (chartType === 'bubble') {
      // BUBBLE CHART VISUALIZATION
      // Create hierarchy for bubble packing
      const root = d3.hierarchy({ children: bubbleData } as any)
        .sum((d: any) => d.count || 0);

      const pack = d3.pack()
        .size([width - 40, height - 40])
        .padding(10);

      const nodes = pack(root).leaves();

      // No gradients needed - using solid colors

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

      // Add circles with solid color fill and elegant pop-in animation
      bubbleGroups
        .append('circle')
        .attr('r', 0)
        .attr('fill', (d: any) => d.data.color)
        .style('filter', (d: any) => {
          const color = d.data.color;
          return `drop-shadow(0 6px 16px ${color}60) drop-shadow(0 2px 6px ${color}40)`;
        })
        .transition()
        .duration(1000)
        .delay((d: any, i: number) => i * 60) // Stagger delay for cascade effect
        .ease(d3.easeCubicOut)
        .attr('r', (d: any) => d.r)
        .on('end', function() {
          // Subtle bounce at the end for playfulness
          d3.select(this)
            .transition()
            .duration(200)
            .ease(d3.easeElasticOut.amplitude(1).period(0.3))
            .attr('r', function(d: any) { return d.r * 1.05; })
            .transition()
            .duration(150)
            .ease(d3.easeQuadOut)
            .attr('r', function(d: any) { return d.r; });
        });

      // Add labels with enhanced readability
      bubbleGroups.each(function(d: any) {
        const group = d3.select(this);
        const textGroup = group.append('g')
          .attr('opacity', 0);

        const radius = d.r;
        const nameFontSize = Math.max(12, Math.min(radius / 3.5, 20));
        const countFontSize = Math.max(20, Math.min(radius / 2.2, 40));

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
            .style('font-weight', '700')
            .style('letter-spacing', '0.3px')
            .style('fill', '#FFFFFF')
            .style('text-shadow', '0 2px 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8)')
            .text(line1);

          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `-2px`)
            .style('font-size', nameFontSize + 'px')
            .style('font-weight', '700')
            .style('letter-spacing', '0.3px')
            .style('fill', '#FFFFFF')
            .style('text-shadow', '0 2px 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8)')
            .text(line2);

          // Count below
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${lineHeight + 12}px`)
            .style('font-size', countFontSize + 'px')
            .style('font-weight', '800')
            .style('letter-spacing', '0.5px')
            .style('fill', '#FFFFFF')
            .style('text-shadow', '0 3px 8px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.9)')
            .text(d.data.count);
        } else {
          // Single line for shorter text
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `-${countFontSize * 0.35}px`)
            .style('font-size', nameFontSize + 'px')
            .style('font-weight', '700')
            .style('letter-spacing', '0.3px')
            .style('fill', '#FFFFFF')
            .style('text-shadow', '0 2px 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8)')
            .text(d.data.key);

          // Count below
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${countFontSize * 0.65}px`)
            .style('font-size', countFontSize + 'px')
            .style('font-weight', '800')
            .style('letter-spacing', '0.5px')
            .style('fill', '#FFFFFF')
            .style('text-shadow', '0 3px 8px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.9)')
            .text(d.data.count);
        }

        const index = nodes.indexOf(d);
        textGroup
          .transition()
          .duration(800)
          .delay(400 + index * 50) // Stagger with bubble animation
          .attr('opacity', 1);
      });

      // Enhanced hover effects with smooth, delightful interactions
      bubbleGroups
        .on('mouseenter', function(event, d: any) {
          const group = d3.select(this);
          const circle = group.select('circle');
          const currentRadius = parseFloat(circle.attr('r'));

          // Smooth lift and glow effect
          circle
            .transition()
            .duration(250)
            .ease(d3.easeCubicOut)
            .attr('r', currentRadius * 1.12)
            .style('filter', (d: any) => {
              const color = d.data.color;
              return `drop-shadow(0 12px 32px ${color}80) drop-shadow(0 4px 12px ${color}60)`;
            });

          // Scale and brighten text smoothly
          group.selectAll('text')
            .transition()
            .duration(250)
            .ease(d3.easeCubicOut)
            .style('font-weight', '800')
            .attr('transform', 'scale(1.08)');
        })
        .on('mouseleave', function(event, d: any) {
          const group = d3.select(this);
          const circle = group.select('circle');
          const originalRadius = d.r;

          // Smooth return to original state
          circle
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr('r', originalRadius)
            .style('filter', (d: any) => {
              const color = d.data.color;
              return `drop-shadow(0 6px 16px ${color}60) drop-shadow(0 2px 6px ${color}40)`;
            });

          // Reset text smoothly
          group.selectAll('text')
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('font-weight', '600')
            .attr('transform', 'scale(1)');
        });

      // Click outside to collapse
      svg.on('click', () => setExpandedBubble(null));

    } else {
      // BAR CHART VISUALIZATION
      const margin = { top: 20, right: 100, bottom: 20, left: 250 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // Calculate bar height
      const barHeight = Math.min(60, (chartHeight - (bubbleData.length - 1) * 10) / bubbleData.length);
      const barSpacing = 10;

      // Create scale for bar widths
      const maxCount = d3.max(bubbleData, d => d.count) || 1;
      const xScale = d3.scaleLinear()
        .domain([0, maxCount])
        .range([0, chartWidth]);

      // Create subtle gradients for bars with depth
      const defs = svg.append('defs');
      bubbleData.forEach((d, i) => {
        const gradient = defs.append('linearGradient')
          .attr('id', `bar-gradient-${i}`)
          .attr('x1', '0%')
          .attr('x2', '100%')
          .attr('y1', '0%')
          .attr('y2', '0%');

        // Solid color with subtle brightness variation
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', d3.rgb(d.color).brighter(0.2).toString())
          .attr('stop-opacity', 1);

        gradient.append('stop')
          .attr('offset', '50%')
          .attr('stop-color', d.color)
          .attr('stop-opacity', 1);

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', d3.rgb(d.color).darker(0.2).toString())
          .attr('stop-opacity', 1);
      });

      // Create bar groups
      const barGroups = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .selectAll('g')
        .data(bubbleData)
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${i * (barHeight + barSpacing)})`)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          event.stopPropagation();
          if (expandedBubble === d.key) {
            setExpandedBubble(null);
          } else {
            setExpandedBubble(d.key);
          }
        });

      // Add bars with smooth slide-in animation
      barGroups
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', barHeight)
        .attr('width', 0)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', (d, i) => `url(#bar-gradient-${i})`)
        .style('filter', d => `drop-shadow(0 4px 12px ${d.color}50) drop-shadow(0 2px 6px ${d.color}35)`)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 60)
        .ease(d3.easeCubicOut)
        .attr('width', d => xScale(d.count))
        .on('end', function(d) {
          // Subtle pulse at the end
          d3.select(this)
            .transition()
            .duration(150)
            .ease(d3.easeQuadOut)
            .attr('height', barHeight * 1.08)
            .attr('y', -(barHeight * 0.08) / 2)
            .transition()
            .duration(150)
            .ease(d3.easeQuadOut)
            .attr('height', barHeight)
            .attr('y', 0);
        });

      // Add category labels on the left
      barGroups
        .append('text')
        .attr('x', -10)
        .attr('y', barHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#2B180A')
        .style('opacity', 0)
        .text(d => d.key)
        .transition()
        .duration(800)
        .delay((d, i) => 400 + i * 50)
        .style('opacity', 1);

      // Add count badges on the right of bars
      barGroups
        .append('g')
        .attr('class', 'count-badge')
        .attr('transform', d => `translate(${xScale(d.count) + 10}, ${barHeight / 2})`)
        .style('opacity', 0)
        .each(function(d) {
          const badge = d3.select(this);

          // Badge background
          badge.append('circle')
            .attr('r', 18)
            .attr('fill', d.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

          // Badge count text
          badge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('font-size', '12px')
            .style('font-weight', '700')
            .style('fill', 'white')
            .text(d.count);
        })
        .transition()
        .duration(800)
        .delay((d, i) => 600 + i * 50)
        .style('opacity', 1);

      // Smooth hover effects for bars
      barGroups
        .on('mouseenter', function(event, d) {
          const group = d3.select(this);
          const rect = group.select('rect');
          const currentHeight = parseFloat(rect.attr('height'));

          // Lift and glow effect
          rect
            .transition()
            .duration(200)
            .ease(d3.easeCubicOut)
            .attr('height', currentHeight * 1.15)
            .attr('y', -(currentHeight * 0.15) / 2)
            .style('filter', `drop-shadow(0 8px 28px ${d.color}70) drop-shadow(0 4px 12px ${d.color}50)`);

          // Bold label
          group.selectAll('text')
            .transition()
            .duration(200)
            .ease(d3.easeCubicOut)
            .style('font-weight', '800');

          // Scale badge
          group.select('.count-badge')
            .transition()
            .duration(200)
            .ease(d3.easeCubicOut)
            .attr('transform', `translate(${xScale(d.count) + 10}, ${barHeight / 2}) scale(1.2)`);
        })
        .on('mouseleave', function(event, d) {
          const group = d3.select(this);

          // Reset bar smoothly
          group.select('rect')
            .transition()
            .duration(250)
            .ease(d3.easeCubicOut)
            .attr('height', barHeight)
            .attr('y', 0)
            .style('filter', `drop-shadow(0 4px 12px ${d.color}50) drop-shadow(0 2px 6px ${d.color}35)`);

          // Reset label
          group.selectAll('text')
            .transition()
            .duration(250)
            .ease(d3.easeCubicOut)
            .style('font-weight', '600');

          // Reset badge
          group.select('.count-badge')
            .transition()
            .duration(250)
            .ease(d3.easeCubicOut)
            .attr('transform', `translate(${xScale(d.count) + 10}, ${barHeight / 2}) scale(1)`);
        });

      // Click outside to collapse
      svg.on('click', () => setExpandedBubble(null));
    }

  }, [bubbleData, dimensions, expandedBubble, groupBy, chartType]);

  const expandedData = bubbleData.find(b => b.key === expandedBubble);

  return (
    <div className={hideControls ? "" : "space-y-6 px-8"}>
      {/* Controls */}
      {!hideControls && <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 p-6" style={{ borderColor: '#E6C8A1', boxShadow: '0 4px 6px -1px rgba(49, 126, 109, 0.1), 0 2px 4px -1px rgba(49, 126, 109, 0.06)' }}>
        {/* Chart Type Toggle */}
        <div className="mb-4 pb-4 border-b" style={{ borderColor: '#E6C8A1' }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>
            Visualization Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bubble')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${chartType === 'bubble'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'border-2 hover:border-teal-400 hover:text-teal-600'
                }
              `}
              style={{
                borderColor: chartType !== 'bubble' ? '#E6C8A1' : undefined,
                color: chartType !== 'bubble' ? '#4A4643' : undefined
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                <circle cx="6" cy="18" r="2" strokeWidth={2} />
                <circle cx="18" cy="6" r="2" strokeWidth={2} />
              </svg>
              Bubble Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${chartType === 'bar'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'border-2 hover:border-teal-400 hover:text-teal-600'
                }
              `}
              style={{
                borderColor: chartType !== 'bar' ? '#E6C8A1' : undefined,
                color: chartType !== 'bar' ? '#4A4643' : undefined
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Bar Chart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Group By */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>
              Group By
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <select
                value={groupBy}
                onChange={(e) => {
                  setGroupBy(e.target.value as GroupingField);
                  setExpandedBubble(null);
                }}
                className="w-full pl-12 pr-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-400 bg-white appearance-none font-semibold"
                style={{
                  borderColor: '#E6C8A1',
                  color: '#2B180A',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="ecosystemRole">Ecosystem Role</option>
                <option value="entityType">Entity Type</option>
                <option value="organizationType">Organization Type</option>
                <option value="state">State/Province</option>
                <option value="country">Country</option>
              </select>
            </div>
          </div>

          {/* Filter By (Type) */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>
              Filter By
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterValue('all');
                  setExpandedBubble(null);
                }}
                className="w-full pl-12 pr-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-400 bg-white appearance-none font-semibold"
                style={{
                  borderColor: '#E6C8A1',
                  color: '#2B180A',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="none">No Filter</option>
                <option value="ecosystemRole">Ecosystem Role</option>
                <option value="entityType">Entity Type</option>
                <option value="organizationType">Organization Type</option>
                <option value="state">State/Province</option>
                <option value="country">Country</option>
              </select>
            </div>
          </div>

          {/* Filter Value */}
          {filterType !== 'none' && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2B180A' }}>
                Select {filterType === 'ecosystemRole' ? 'Role' :
                        filterType === 'entityType' ? 'Entity Type' :
                        filterType === 'organizationType' ? 'Org Type' :
                        filterType === 'state' ? 'State/Province' : 'Country'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {(filterType === 'state' || filterType === 'country') ? (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                </div>
                <select
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                    setExpandedBubble(null);
                  }}
                  className="w-full pl-12 pr-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all hover:border-teal-400 bg-white appearance-none font-semibold"
                  style={{
                    borderColor: '#E6C8A1',
                    color: '#2B180A',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="all">All</option>
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E6C8A1' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-base font-semibold" style={{ color: '#2B180A' }}>
              Showing <span className="font-bold text-teal-600">{filteredOrgs.length}</span> organizations in{' '}
              <span className="font-bold text-teal-600">{bubbleData.length}</span> groups
            </span>
            {filterType !== 'none' && filterValue !== 'all' && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-sm animate-fadeIn">
                Filtered: {filterValue}
              </span>
            )}
            {expandedBubble && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold rounded-full shadow-sm animate-fadeIn">
                Viewing: {expandedBubble}
              </span>
            )}
          </div>
        </div>
      </div>}

      {!hideControls && <div className="mb-4">
        <h3 className="text-xl font-bold text-teal-700">
          {chartType === 'bubble' ? 'Category Bubbles' : 'Category Bars'}
        </h3>
        <p className="text-sm mt-1" style={{ color: '#6B6764' }}>
          {chartType === 'bubble' ? 'Click a bubble to explore organizations' : 'Click a bar to explore organizations'}
        </p>
      </div>}

      {/* D3 Bubble Pack Visualization */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2" style={{ minHeight: '600px', background: 'linear-gradient(135deg, #FBF3E7 0%, #F7F0E8 100%)', borderColor: '#E6C8A1', boxShadow: '0 10px 15px -3px rgba(49, 126, 109, 0.15), 0 4px 6px -2px rgba(49, 126, 109, 0.05)' }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        />
      </div>

      {/* Expanded Modal */}
      {expandedBubble && expandedData && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setExpandedBubble(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 127, 110, 0.25), 0 10px 25px -5px rgba(0, 127, 110, 0.1)' }}
          >
            {/* Modal Header */}
            <div
              className="p-6"
              style={{ backgroundColor: expandedData.color }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {expandedBubble}
                  </h3>
                  <p className="text-sm text-white/90 mt-1">
                    {expandedData.count} organization{expandedData.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedBubble(null)}
                  className="text-white/80 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-[#F5EBDD]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expandedData.orgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onOrgClick?.(org.id);
                      setExpandedBubble(null);
                    }}
                    className="text-left bg-white hover:bg-teal-50 border-2 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-105"
                    style={{
                      borderColor: '#E6C8A1'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#317E6D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E6C8A1';
                    }}
                  >
                    <div className="font-bold text-sm mb-2 line-clamp-2" style={{ color: '#2B180A' }}>
                      {org.name}
                    </div>
                    <div className="text-xs mb-2" style={{ color: '#6B6764' }}>
                      {org.city || 'Location not specified'}
                    </div>
                    {org.ecosystemRole && org.ecosystemRole.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {org.ecosystemRole.slice(0, 2).map((role, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 text-xs rounded-full font-medium shadow-sm text-white"
                            style={{ backgroundColor: expandedData.color }}
                          >
                            {role.split(' ')[0]}
                          </span>
                        ))}
                        {org.ecosystemRole.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[#F5EBDD] text-[#000000] font-medium">
                            +{org.ecosystemRole.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {expandedData.orgs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No organizations found in this category.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4" style={{ borderColor: '#E6C8A1', background: 'linear-gradient(to right, #FBF3E7, #F7F0E8)' }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#4A4643' }}>
                  Click any organization to view details
                </p>
                <button
                  onClick={() => setExpandedBubble(null)}
                  className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

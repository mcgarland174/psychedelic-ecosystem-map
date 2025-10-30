'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Project {
  id: string;
  name: string;
  priorityArea?: string;
  typeOfProject?: string[];
  geographicLocation?: string[];
  status?: string;
}

interface ProjectBubbleViewProps {
  projects: Project[];
  groupBy: 'priorityArea' | 'typeOfProject' | 'geographicLocation' | 'status';
  onProjectClick?: (projectId: string) => void;
}

// Brand color palette - soft pastels with elegant gradients
const BRAND_COLORS = [
  '#B8E6DB', // soft mint
  '#F5D9A8', // soft peach
  '#C8E6E6', // powder blue
  '#FFE4B5', // moccasin
  '#D4EBE6', // pale teal
  '#FFE7CC', // pale apricot
  '#BCE3D7', // seafoam
  '#FFF0D9', // cream
  '#A8D8D8', // light aqua
  '#FFD9A8', // light sand
];

export default function ProjectBubbleView({ projects, groupBy, onProjectClick }: ProjectBubbleViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [expandedBubble, setExpandedBubble] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [chartType, setChartType] = useState<'bubble' | 'bar'>('bubble');

  // Group projects
  const bubbleData = useMemo(() => {
    const groups = new Map<string, Project[]>();

    projects.forEach(project => {
      let groupKeys: string[] = [];

      switch (groupBy) {
        case 'priorityArea':
          groupKeys = project.priorityArea ? [project.priorityArea] : ['Uncategorized'];
          break;
        case 'typeOfProject':
          groupKeys = project.typeOfProject || ['Unknown'];
          break;
        case 'geographicLocation':
          groupKeys = project.geographicLocation || ['Unknown'];
          break;
        case 'status':
          groupKeys = project.status ? [project.status] : ['Unknown'];
          break;
      }

      groupKeys.forEach(key => {
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(project);
      });
    });

    return Array.from(groups.entries())
      .map(([key, items], index) => ({
        key,
        items,
        count: items.length,
        color: BRAND_COLORS[index % BRAND_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [projects, groupBy]);

  const getColor = (key: string) => {
    const bubble = bubbleData.find(b => b.key === key);
    return bubble?.color || BRAND_COLORS[0];
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

  // Render visualization with D3 (bubble or bar chart)
  useEffect(() => {
    if (!svgRef.current || bubbleData.length === 0) return;

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

      // Create gradients for each bubble
      const defs = svg.append('defs');
      nodes.forEach((d: any, i: number) => {
        const color = getColor(d.data.key);
        const gradient = defs.append('radialGradient')
          .attr('id', `project-gradient-${i}`)
          .attr('cx', '30%')
          .attr('cy', '30%');

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

      // Add circles with gradients and colored glow (with stagger animation)
      bubbleGroups
        .append('circle')
        .attr('r', 0)
        .attr('fill', (d: any, i: number) => `url(#project-gradient-${i})`)
        .attr('stroke', (d: any) => getColor(d.data.key))
        .attr('stroke-width', 2)
        .style('filter', (d: any) => {
          const color = getColor(d.data.key);
          return `drop-shadow(0 0 15px ${color}80)`;
        })
        .transition()
        .duration(800)
        .delay((d: any, i: number) => i * 50) // Stagger delay for cascade effect
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr('r', (d: any) => d.r);

      // Add labels with white text for dark background
      bubbleGroups.each(function(d: any) {
        const group = d3.select(this);
        const textGroup = group.append('g')
          .attr('opacity', 0);

        const radius = d.r;
        const nameFontSize = Math.max(11, Math.min(radius / 4, 18));
        const countFontSize = Math.max(18, Math.min(radius / 2.5, 36));

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
            .style('fill', '#000000')
            .text(line1);

          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `-2px`)
            .style('font-size', nameFontSize + 'px')
            .style('font-weight', '500')
            .style('letter-spacing', '0.5px')
            .style('fill', '#000000')
            .text(line2);

          // Count below
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${lineHeight + 12}px`)
            .style('font-size', countFontSize + 'px')
            .style('font-weight', '600')
            .style('letter-spacing', '0.5px')
            .style('fill', '#000000')
            .text(d.data.count);
        } else {
          // Single line for shorter text
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `-${countFontSize * 0.35}px`)
            .style('font-size', nameFontSize + 'px')
            .style('font-weight', '500')
            .style('letter-spacing', '0.5px')
            .style('fill', '#000000')
            .text(d.data.key);

          // Count below
          textGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${countFontSize * 0.65}px`)
            .style('font-size', countFontSize + 'px')
            .style('font-weight', '600')
            .style('letter-spacing', '0.5px')
            .style('fill', '#000000')
            .text(d.data.count);
        }

        const index = nodes.indexOf(d);
        textGroup
          .transition()
          .duration(800)
          .delay(400 + index * 50) // Stagger with bubble animation
          .attr('opacity', 1);
      });

      // Enhanced hover effects with elastic animation
      bubbleGroups
        .on('mouseenter', function(event, d: any) {
          const group = d3.select(this);
          const circle = group.select('circle');
          const currentRadius = parseFloat(circle.attr('r'));

          // Elastic scale animation
          circle
            .transition()
            .duration(300)
            .ease(d3.easeElastic.amplitude(1).period(0.3))
            .attr('r', currentRadius * 1.1)
            .attr('fill-opacity', 1)
            .attr('stroke-width', 5)
            .style('filter', (d: any) => {
              const color = getColor(d.data.key);
              return `drop-shadow(0 0 25px ${color}CC)`;
            });

          // Bold text on hover
          group.selectAll('text')
            .transition()
            .duration(200)
            .style('font-weight', '700');
        })
        .on('mouseleave', function(event, d: any) {
          const group = d3.select(this);
          const circle = group.select('circle');
          const currentRadius = parseFloat(circle.attr('r')) / 1.1;

          // Return to normal with smooth easing
          circle
            .transition()
            .duration(300)
            .ease(d3.easeBackOut.overshoot(1.2))
            .attr('r', currentRadius)
            .attr('fill-opacity', 0.7)
            .attr('stroke-width', 2)
            .style('filter', (d: any) => {
              const color = getColor(d.data.key);
              return `drop-shadow(0 0 15px ${color}80)`;
            });

          // Return text to normal weight
          group.selectAll('text')
            .transition()
            .duration(200)
            .style('font-weight', (d: any, i: number) => i === group.selectAll('text').size() - 1 ? '600' : '500');
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

      // Create gradients for bars
      const defs = svg.append('defs');
      bubbleData.forEach((d, i) => {
        const color = getColor(d.key);
        const gradient = defs.append('linearGradient')
          .attr('id', `project-bar-gradient-${i}`)
          .attr('x1', '0%')
          .attr('x2', '100%');

        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', color)
          .attr('stop-opacity', 0.9);

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', color)
          .attr('stop-opacity', 0.7);
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

      // Add bars with animation
      barGroups
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', barHeight)
        .attr('width', 0)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', (d, i) => `url(#project-bar-gradient-${i})`)
        .attr('stroke', d => getColor(d.key))
        .attr('stroke-width', 2)
        .style('filter', d => {
          const color = getColor(d.key);
          return `drop-shadow(0 4px 12px ${color}60)`;
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .ease(d3.easeBackOut.overshoot(1.1))
        .attr('width', d => xScale(d.count));

      // Add category labels on the left
      barGroups
        .append('text')
        .attr('x', -10)
        .attr('y', barHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', '#000000')
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
          const color = getColor(d.key);

          // Badge background
          badge.append('circle')
            .attr('r', 18)
            .attr('fill', color)
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

      // Hover effects
      barGroups
        .on('mouseenter', function(event, d) {
          const group = d3.select(this);
          const color = getColor(d.key);

          // Brighten bar
          group.select('rect')
            .transition()
            .duration(200)
            .attr('stroke-width', 4)
            .style('filter', `drop-shadow(0 6px 20px ${color}99)`);

          // Bold label
          group.selectAll('text')
            .transition()
            .duration(200)
            .style('font-weight', '700');

          // Scale badge
          group.select('.count-badge')
            .transition()
            .duration(200)
            .attr('transform', `translate(${xScale(d.count) + 10}, ${barHeight / 2}) scale(1.2)`);
        })
        .on('mouseleave', function(event, d) {
          const group = d3.select(this);
          const color = getColor(d.key);

          // Reset bar
          group.select('rect')
            .transition()
            .duration(200)
            .attr('stroke-width', 2)
            .style('filter', `drop-shadow(0 4px 12px ${color}60)`);

          // Reset label
          group.selectAll('text')
            .transition()
            .duration(200)
            .style('font-weight', '600');

          // Reset badge
          group.select('.count-badge')
            .transition()
            .duration(200)
            .attr('transform', `translate(${xScale(d.count) + 10}, ${barHeight / 2}) scale(1)`);
        });

      // Click outside to collapse
      svg.on('click', () => setExpandedBubble(null));
    }

  }, [bubbleData, dimensions, expandedBubble, groupBy, chartType]);

  const expandedData = bubbleData.find(b => b.key === expandedBubble);

  return (
    <div className="p-6">
      {/* Chart Type Toggle */}
      <div className="mb-4 pb-4 border-b border-[#E9D5B8]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Visualization Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bubble')}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
              ${chartType === 'bubble'
                ? 'bg-[#E6543E] text-white shadow-md'
                : 'border-2 border-[#E9D5B8] text-gray-700 hover:border-[#E6543E] hover:text-[#E6543E]'
              }
            `}
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
                ? 'bg-[#E6543E] text-white shadow-md'
                : 'border-2 border-[#E9D5B8] text-gray-700 hover:border-[#E6543E] hover:text-[#E6543E]'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Bar Chart
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#007F6E] to-[#003B73] bg-clip-text text-transparent">
          {chartType === 'bubble' ? 'Category Bubbles' : 'Category Bars'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {chartType === 'bubble' ? 'Click a bubble to explore projects' : 'Click a bar to explore projects'}
        </p>
      </div>

      <div className="relative bg-gradient-to-br from-[#F5EBDD] to-[#F7DCC3] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-[#E9D5B8]" style={{ minHeight: '600px', boxShadow: '0 10px 15px -3px rgba(0, 127, 110, 0.15), 0 4px 6px -2px rgba(0, 127, 110, 0.05)' }}>
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
                  <p className="text-sm text-gray-600">{expandedData.count} projects</p>
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

            {/* Project Table */}
            <div className="overflow-y-auto max-h-[calc(100%-120px)]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expandedData.items.map(project => (
                    <tr
                      key={project.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectClick?.(project.id);
                        setExpandedBubble(null);
                      }}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {project.geographicLocation?.join(', ') || 'Not specified'}
                      </td>
                      <td className="px-4 py-3">
                        {project.status && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                            {project.status}
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
    </div>
  );
}

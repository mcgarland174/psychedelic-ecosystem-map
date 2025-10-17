'use client';

import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

interface Node {
  id: string;
  label: string;
  group: string;
  title?: string;
  color?: string;
}

interface Edge {
  from: string;
  to: string;
  title?: string;
}

interface NetworkGraphProps {
  onNodeClick?: (nodeId: string) => void;
  filterRole?: string;
  filterCountry?: string;
  searchTerm?: string;
}

export default function NetworkGraph({
  onNodeClick,
  filterRole,
  filterCountry,
  searchTerm
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/network-data');
        if (!response.ok) throw new Error('Failed to fetch network data');

        const data = await response.json();
        setAllNodes(data.nodes);
        setAllEdges(data.edges);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading || error || allNodes.length === 0) return;

    // Filter nodes based on criteria
    let filteredNodes = allNodes;

    if (filterRole && filterRole !== 'all') {
      filteredNodes = filteredNodes.filter(node => node.group === filterRole);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node =>
        node.label.toLowerCase().includes(term)
      );
    }

    // Filter edges to only include connections between visible nodes
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = allEdges.filter(
      edge => nodeIds.has(edge.from) && nodeIds.has(edge.to)
    );

    const nodes = new DataSet(filteredNodes);
    const edges = new DataSet(filteredEdges);

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 12,
          color: '#333',
        },
        borderWidth: 2,
        borderWidthSelected: 4,
      },
      edges: {
        width: 1,
        color: { color: '#848484', highlight: '#333' },
        smooth: {
          type: 'continuous',
        },
      },
      physics: {
        stabilization: {
          iterations: 200,
        },
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 150,
          springConstant: 0.04,
          damping: 0.09,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true,
      },
      groups: {
        'Funder': { color: { background: '#3B82F6', border: '#2563EB' } },
        'Media': { color: { background: '#06B6D4', border: '#0891B2' } },
        'Government & Policy': { color: { background: '#14B8A6', border: '#0D9488' } },
        'Academic & Research': { color: { background: '#10B981', border: '#059669' } },
        'Training & Credentialing': { color: { background: '#EAB308', border: '#CA8A04' } },
        'Clinical Services': { color: { background: '#F59E0B', border: '#D97706' } },
        'Community & Peer Support': { color: { background: '#EF4444', border: '#DC2626' } },
        'Spiritual / Religious': { color: { background: '#EC4899', border: '#DB2777' } },
        'Advocacy': { color: { background: '#A855F7', border: '#9333EA' } },
        'Technology & Data Systems': { color: { background: '#6B7280', border: '#4B5563' } },
        'Industry & Supply Chain': { color: { background: '#0EA5E9', border: '#0284C7' } },
        'Cultural & Indigenous': { color: { background: '#06B6D4', border: '#0891B2' } },
        'Other': { color: { background: '#9CA3AF', border: '#6B7280' } },
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length > 0 && onNodeClick) {
        onNodeClick(params.nodes[0]);
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [allNodes, allEdges, loading, error, filterRole, filterCountry, searchTerm, onNodeClick]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ecosystem map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg text-xs">
        <p className="font-semibold mb-1">Showing:</p>
        <p>{allNodes.length} organizations</p>
        <p>{allEdges.length} connections</p>
      </div>
    </div>
  );
}

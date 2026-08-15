import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { Agent } from './types';

interface ChainStore {
  nodes: Node[];
  edges: Edge[];
  mappings: {
    [edgeId: string]: { sourceField: string; targetField: string }[];
  };
  chainName: string;
  addNode: (agent: Agent) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  setMapping: (edgeId: string, mappings: { sourceField: string; targetField: string }[]) => void;
  setChainName: (name: string) => void;
  saveChain: () => Promise<string>;
}

export const useChainStore = create<ChainStore>((set, get) => ({
  nodes: [],
  edges: [],
  mappings: {},
  chainName: "New Chain",

  addNode: (agent: Agent) => {
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: `node-${Date.now()}`,
          type: 'agentNode',
          position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
          data: { agent },
        }
      ]
    }));
  },

  removeNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
  },

  addEdge: (edge: Edge) => {
    set((state) => ({
      edges: [...state.edges, edge]
    }));
  },

  setMapping: (edgeId, mappings) => {
    set((state) => ({
      mappings: { ...state.mappings, [edgeId]: mappings }
    }));
  },

  setChainName: (name: string) => {
    set({ chainName: name });
  },

  saveChain: async () => {
    const { nodes, edges, mappings, chainName } = get();
    // Implementation will call POST /api/chains
    const res = await fetch('/api/chains', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges, mappings, name: chainName })
    });
    const data = await res.json();
    return data.id;
  }
}));

"use client";

import { useState, useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, BackgroundVariant, Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useChainStore } from '@/lib/chainStore';
import { AgentNode } from './AgentNode';
import { SchemaMapper } from './SchemaMapper';
import { Button } from './ui/button';
import { Save, Search } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { Input } from './ui/input';
import { toast } from 'sonner';

const nodeTypes = { agentNode: AgentNode };

export function ChainStudio() {
  const { nodes, edges, mappings, addNode, removeNode, addEdge: addStoreEdge, setMapping, chainName, setChainName, saveChain } = useChainStore();
  const { data: agents = [] } = useAgents();
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [search, setSearch] = useState("");

  const onConnect = useCallback((params: Connection | Edge) => {
    addStoreEdge({ ...params, type: 'smoothstep', animated: true } as Edge);
  }, [addStoreEdge]);

  const sourceNode = useMemo(() => selectedEdge ? nodes.find(n => n.id === selectedEdge.source) : null, [selectedEdge, nodes]);
  const targetNode = useMemo(() => selectedEdge ? nodes.find(n => n.id === selectedEdge.target) : null, [selectedEdge, nodes]);

  const filteredAgents = useMemo(() => agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase())), [agents, search]);

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#ffffff] text-[#1a1a2e]">

      {/* Sidebar sidebar */}
      <div className="z-10 flex w-80 flex-col border-r border-black/10 bg-[linear-gradient(180deg,rgba(231,76,60,0.08),rgba(255,255,255,0.45))] p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-6 text-xl font-bold">Agent library</h2>
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="w-full border-black/10 bg-black/[0.03] pl-10 text-[#1a1a2e] focus-visible:ring-[#e74c3c]/45"
            placeholder="Search agents"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredAgents.map(a => (
            <div key={a.id} className="cursor-pointer rounded-xl border border-black/10 bg-black/[0.03] p-4 transition-colors hover:border-[#e74c3c]/35 hover:bg-[#f0f0f2]" onClick={() => addNode(a)}>
              <div className="font-semibold text-sm mb-1">{a.name}</div>
              <div className="text-xs text-muted-foreground truncate">{a.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgeClick={(e, edge) => setSelectedEdge(edge)}
          onPaneClick={() => setSelectedEdge(null)}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[radial-gradient(circle_at_top,rgba(231,76,60,0.08),transparent_45%),#ffffff]"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#5f221c" />
          <Controls className="fill-white" />
          <MiniMap className="bg-white/90 border border-black/10" maskColor="rgba(0,0,0,0.5)" />
        </ReactFlow>

        {/* Floating Schema Mapper */}
        {selectedEdge && sourceNode && targetNode && (
          <div className="absolute top-6 right-6 z-20 pointer-events-auto">
            <SchemaMapper
              sourceNode={sourceNode}
              targetNode={targetNode}
              mappings={mappings[selectedEdge.id] || []}
              onChange={(m: any) => setMapping(selectedEdge.id, m)}
            />
          </div>
        )}

        {/* Bottom Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/80 border border-black/10 p-3 rounded-2xl backdrop-blur-xl shadow-2xl">
          <Input
            className="w-48 bg-transparent border-0 focus-visible:ring-0 text-[#1a1a2e] font-semibold text-lg"
            value={chainName}
            onChange={e => setChainName(e.target.value)}
          />
          <div className="w-px h-8 bg-black/10"></div>
          <Button onClick={async () => {
            try {
              const id = await saveChain();
              toast.success("Workflow saved successfully!");
            } catch (err) {
              toast.error("Failed to save workflow");
            }
          }} className="bg-[#e74c3c] px-6 font-bold hover:bg-[#f05a48]">
            <Save className="w-4 h-4 mr-2" /> Save workflow
          </Button>
        </div>
      </div>
    </div>
  );
}

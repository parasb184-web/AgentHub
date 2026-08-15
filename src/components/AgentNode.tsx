import { Handle, Position } from 'reactflow';
import { Network } from 'lucide-react';

export function AgentNode({ data }: { data: any }) {
  const { agent } = data;

  const inputFields = Object.keys(agent.inputSchema?.properties || agent.inputSchema || {});
  const outputFields = Object.keys(agent.outputSchema?.properties || agent.outputSchema || {});

  return (
    <div className="relative w-64 rounded-xl border border-[#e74c3c]/35 bg-[#fafafa]/95 p-4 shadow-2xl shadow-black/10">
      <Handle type="target" position={Position.Top} className="h-3 w-3 border-2 border-white bg-[#ff8c7e]" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#1a1a2e] mb-1 flex items-center gap-2">
            <Network className="w-4 h-4 text-[#ff8c7e]" />
            {agent.name}
          </h3>
          <span className="rounded-full border border-[#e74c3c]/25 bg-[#e74c3c]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#ff9b8f]">
            {agent.capabilityTags?.[0] || "Agent"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {inputFields.length > 0 && (
          <div className="rounded-lg bg-black/[0.03] p-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Input Fields</div>
            <div className="space-y-1">
              {inputFields.map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {outputFields.length > 0 && (
          <div className="rounded-lg bg-black/[0.03] p-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Output Fields</div>
            <div className="space-y-1">
              {outputFields.map(f => (
                <div key={f} className="flex items-center gap-2 rounded px-2 py-1 text-xs text-amber-200 bg-amber-500/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div> {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="h-3 w-3 border-2 border-white bg-amber-400" />
    </div>
  );
}

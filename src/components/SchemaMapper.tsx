export function SchemaMapper({ sourceNode, targetNode, mappings, onChange }: any) {
  const sourceFields = Object.keys(sourceNode.data.agent.outputSchema?.properties || sourceNode.data.agent.outputSchema || {});
  const targetFields = Object.keys(targetNode.data.agent.inputSchema?.properties || targetNode.data.agent.inputSchema || {});

  return (
    <div className="w-80 rounded-[1.25rem] border border-black/10 bg-white/95 p-4 text-sm shadow-2xl">
      <h3 className="mb-4 font-semibold text-[#1a1a2e]">Field mapping</h3>

      {targetFields.map(tf => {
        const currentMapped = mappings?.find((m: any) => m.targetField === tf)?.sourceField || "";
        return (
          <div key={tf} className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
              <span className="text-[#ff8c7e]">Target: {tf}</span>
            </div>
            <select
              className="control-shell select-shell w-full bg-black/[0.03] p-2 text-sm"
              value={currentMapped}
              onChange={(e) => {
                const newMap = mappings?.filter((m: any) => m.targetField !== tf) || [];
                if (e.target.value) {
                  newMap.push({ sourceField: e.target.value, targetField: tf });
                }
                onChange(newMap);
              }}
            >
              <option value="">-- Leave unmapped --</option>
              {sourceFields.map((sf: string) => (
                <option key={sf} value={sf}>{sourceNode.data.agent.name}.{sf}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

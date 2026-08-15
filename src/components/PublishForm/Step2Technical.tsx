import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const Step2Technical = () => {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "pass" | "fail">("idle");

  const endpointUrl = watch("endpointUrl");

  const handleTest = async () => {
    if (!endpointUrl) return;
    setTestStatus("testing");
    try {
      // Simulate pinging the endpoint locally
      const isHttps = endpointUrl.startsWith("https://");
      await new Promise(r => setTimeout(r, 1000));
      setTestStatus(isHttps ? "pass" : "fail");
    } catch {
      setTestStatus("fail");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Technical contract</h2>
        <p className="text-sm leading-6 text-[#64748b]">Document the endpoint, input schema, output schema, and reference payloads used to validate the agent.</p>
      </div>

      <div className="space-y-2">
        <Label>Endpoint URL <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input placeholder="https://api.example.com/run" {...register("endpointUrl")} className="bg-black/[0.03] border-black/10 font-mono text-sm" />
          <Button onClick={handleTest} disabled={!endpointUrl || testStatus === "testing"} className="bg-[#e74c3c] text-white hover:bg-[#f05a48]">
            {testStatus === "testing" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check endpoint"}
          </Button>
        </div>
        {errors.endpointUrl && <p className="text-red-500 text-xs mt-1">{errors.endpointUrl?.message as string}</p>}
        {testStatus === "pass" && <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> HTTPS endpoint looks valid</p>}
        {testStatus === "fail" && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Endpoint check failed or URL is not HTTPS</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Input Schema (JSON) <span className="text-red-500">*</span></Label>
          <textarea
            {...register("inputSchema")}
            className="control-shell textarea-shell min-h-[150px] w-full bg-black/[0.03] p-3 font-mono text-xs"
            placeholder={'{\n  "type": "object",\n  "properties": {\n    "text": { "type": "string" }\n  }\n}'}
          />
          {errors.inputSchema && <p className="text-red-500 text-xs">{errors.inputSchema?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Output Schema (JSON) <span className="text-red-500">*</span></Label>
          <textarea
            {...register("outputSchema")}
            className="control-shell textarea-shell min-h-[150px] w-full bg-black/[0.03] p-3 font-mono text-xs"
            placeholder={'{\n  "type": "object",\n  "properties": {\n    "summary": { "type": "string" }\n  }\n}'}
          />
          {errors.outputSchema && <p className="text-red-500 text-xs">{errors.outputSchema?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Example Input (JSON) <span className="text-red-500">*</span></Label>
          <textarea
            {...register("exampleInput")}
            className="control-shell textarea-shell min-h-[120px] w-full bg-black/[0.03] p-3 font-mono text-xs"
            placeholder={'{\n  "text": "Hello world"\n}'}
          />
          {errors.exampleInput && <p className="text-red-500 text-xs">{errors.exampleInput?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Example Output (JSON) <span className="text-red-500">*</span></Label>
          <textarea
            {...register("exampleOutput")}
            className="control-shell textarea-shell min-h-[120px] w-full bg-black/[0.03] p-3 font-mono text-xs"
            placeholder={'{\n  "summary": "Greeting"\n}'}
          />
          {errors.exampleOutput && <p className="text-red-500 text-xs">{errors.exampleOutput?.message as string}</p>}
        </div>
      </div>
    </div>
  );
};

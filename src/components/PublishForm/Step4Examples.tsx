import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export const Step4Examples = ({ onSubmit, isSubmitting }: { onSubmit: () => void, isSubmitting: boolean }) => {
  const { watch } = useFormContext();
  const formValues = watch();

  const previewField = (label: string, value: any) => (
    <div className="space-y-1 pb-3 mb-3 border-b border-black/5 last:border-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {typeof value === 'object' ? (
        <pre className="overflow-x-auto rounded border border-black/5 bg-black/[0.03] p-2 text-xs font-mono text-[#ffb2a7]">
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <div className="text-sm break-words whitespace-pre-wrap">{value?.toString() || "—"}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Review and publish</h2>
        <p className="text-sm leading-6 text-[#64748b]">Confirm the marketplace profile, technical contract, and pricing before the agent is listed.</p>
      </div>

      <div className="bg-black/[0.03] border border-black/10 rounded-xl p-6">
        <h4 className="text-lg font-bold mb-4 font-mono flex items-center gap-2">
          <CopyIcon className="w-5 h-5 text-[#ff8c7e]" />
          Review configuration
        </h4>

        <div className="grid grid-cols-2 gap-x-8">
          <div>
            {previewField("Name", formValues.name)}
            {previewField("Description", formValues.description)}
            {previewField("Tags", formValues.capabilityTags?.join(", ") || "None")}
            {previewField("Languages", formValues.supportedLanguages?.join(", ") || "None")}
          </div>
          <div>
            {previewField("Endpoint", formValues.endpointUrl)}
            {previewField("Cost / Call", "$" + (formValues.costPerCall || 0).toFixed(3))}
            {previewField("SLA Latency", (formValues.latencyMs || 0) + "ms")}
            {previewField("Rate Limit", (formValues.rateLimit || 0) + " / min")}
            {previewField("Open Source", formValues.isOpenSource ? `Yes (${formValues.sourceUrl || "No URL"})` : "No")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 mt-2">
          <div>{previewField("Input Schema", formValues.inputSchema)}</div>
          <div>{previewField("Output Schema", formValues.outputSchema)}</div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-[#e74c3c] px-8 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#f05a48]"
        >
          {isSubmitting ? "Publishing agent..." : "Publish agent"}
        </Button>
      </div>
    </div>
  );
};

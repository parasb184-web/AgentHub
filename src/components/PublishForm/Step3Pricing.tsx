import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export const Step3Pricing = () => {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const isOpenSource = watch("isOpenSource");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Pricing and limits</h2>
        <p className="text-sm leading-6 text-[#64748b]">Set request pricing, expected latency, and usage limits for the published agent.</p>
      </div>

      <div className="space-y-4">
        <Label className="flex justify-between items-end">
          <span>Cost Per Call (USD) <span className="text-red-500">*</span></span>
          <span className="font-mono text-xl font-medium text-[#ff8c7e]">
            $<Controller
              name="costPerCall"
              control={control}
              render={({ field }) => (field.value || 0).toFixed(3)}
            />
          </span>
        </Label>
        <Controller
          name="costPerCall"
          control={control}
          render={({ field }) => (
            <Slider
              value={[field.value || 0]}
              min={0}
              max={0.100}
              step={0.001}
              onValueChange={(val) => field.onChange((val as number[])[0])}
              className="py-2"
            />
          )}
        />
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>$0.000</span>
          <span>$0.100</span>
        </div>
        {errors.costPerCall && <p className="text-red-500 text-xs">{errors.costPerCall?.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Latency SLA (ms) <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            placeholder="e.g. 500"
            {...register("latencyMs", { valueAsNumber: true })}
            className="bg-black/[0.03] border-black/10 font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Expected response time for a standard request.</p>
          {errors.latencyMs && <p className="text-red-500 text-xs">{errors.latencyMs?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Rate Limit (calls/min) <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            placeholder="e.g. 60"
            {...register("rateLimit", { valueAsNumber: true })}
            className="bg-black/[0.03] border-black/10 font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">Maximum requests allowed per minute.</p>
          {errors.rateLimit && <p className="text-red-500 text-xs">{errors.rateLimit?.message as string}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-black/10">
        <div className="flex items-center space-x-3">
          <Controller
            name="isOpenSource"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isOpenSource"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-black/20 data-[state=checked]:border-[#e74c3c] data-[state=checked]:bg-[#e74c3c]"
              />
            )}
          />
          <Label htmlFor="isOpenSource" className="cursor-pointer">Is the agent&apos;s code open source?</Label>
        </div>

        {isOpenSource && (
          <div className="space-y-2 pl-7 animate-in fade-in duration-300">
            <Label>Source Code URL</Label>
            <Input
              placeholder="https://github.com/your-username/repo"
              {...register("sourceUrl")}
              className="bg-black/[0.03] border-black/10"
            />
            {errors.sourceUrl && <p className="text-red-500 text-xs">{errors.sourceUrl?.message as string}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

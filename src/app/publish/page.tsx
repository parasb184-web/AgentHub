"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Step1Basic } from "@/components/PublishForm/Step1Basic";
import { Step2Technical } from "@/components/PublishForm/Step2Technical";
import { Step3Pricing } from "@/components/PublishForm/Step3Pricing";
import { Step4Examples } from "@/components/PublishForm/Step4Examples";
import { createAgent } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const agentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 chars").max(500),
  capabilityTags: z.array(z.string()).min(1, "Select at least one tag"),
  supportedLanguages: z.array(z.string()),
  endpointUrl: z.string().url("Must be a valid URL").startsWith("https://", "HTTPS required"),
  inputSchema: z.string().refine(str => { try { JSON.parse(str); return true; } catch { return false; } }, "Invalid JSON"),
  outputSchema: z.string().refine(str => { try { JSON.parse(str); return true; } catch { return false; } }, "Invalid JSON"),
  exampleInput: z.string().refine(str => { try { JSON.parse(str); return true; } catch { return false; } }, "Invalid JSON"),
  exampleOutput: z.string().refine(str => { try { JSON.parse(str); return true; } catch { return false; } }, "Invalid JSON"),
  costPerCall: z.number().min(0).max(0.1),
  latencyMs: z.number().min(50),
  rateLimit: z.number().min(1),
  isOpenSource: z.boolean().default(false),
  sourceUrl: z.string().optional(),
});

type FormValues = z.infer<typeof agentSchema>;

export default function PublishPage() {
  const { user, githubProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(agentSchema as any),
    mode: "onChange",
    defaultValues: {
      name: "", description: "", capabilityTags: [], supportedLanguages: [],
      endpointUrl: "", costPerCall: 0, latencyMs: 300, rateLimit: 60,
      isOpenSource: false, sourceUrl: ""
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["name", "description", "capabilityTags"];
    if (step === 2) fieldsToValidate = ["endpointUrl", "inputSchema", "outputSchema", "exampleInput", "exampleOutput"];
    if (step === 3) fieldsToValidate = ["costPerCall", "latencyMs", "rateLimit", "sourceUrl"];

    const isValid = await methods.trigger(fieldsToValidate as any);
    if (isValid) setStep(prev => prev + 1);
  };

  const publishAgent = async (data: FormValues) => {
    if (!user || !githubProfile) {
      toast("Authentication required to publish.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedInputSchema = JSON.parse(data.inputSchema);
      const parsedOutputSchema = JSON.parse(data.outputSchema);
      const parsedExInput = JSON.parse(data.exampleInput);
      const parsedExOutput = JSON.parse(data.exampleOutput);

      const trustScore = Math.round((100 * 0.30) + (50 * 0.25) + (50 * 0.20) + (data.isOpenSource ? 100 : 0) * 0.15 + (100 * 0.10));

      const newAgentId = await createAgent({
        name: data.name,
        description: data.description,
        creatorId: user.uid,
        creatorUsername: githubProfile.githubUsername,
        endpointUrl: data.endpointUrl,
        capabilityTags: data.capabilityTags,
        supportedLanguages: data.supportedLanguages,
        latencyMs: data.latencyMs,
        costPerCall: data.costPerCall,
        inputSchema: parsedInputSchema,
        outputSchema: parsedOutputSchema,
        exampleInput: parsedExInput,
        exampleOutput: parsedExOutput,
        version: "1.0.0",
        status: "active",
        trustScore,
        totalCalls: 0,
        avgLatencyMs: data.latencyMs,
        uptimePercent: 100,
        rating: 0,
        reviewCount: 0
      });

      await fetch("/api/upsert-vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: newAgentId,
          text: data.name + " " + data.description + " " + data.capabilityTags.join(" ")
        })
      });

      toast("Agent published successfully!");
      router.push(`/agents/${newAgentId}`);

    } catch (e: any) {
      toast("Error publishing agent: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-14 text-[#1a1a2e]">
      <div className="mb-12 flex flex-col gap-8 rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.18),transparent_42%),#fafafa] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.08)] md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow-badge mb-4 inline-flex">
            Publish
          </span>
          <h1 className="mb-2 text-3xl font-bold">List an agent on AgentHub</h1>
          <p className="text-[#64748b]">Provide marketplace details, the technical contract, pricing, and sample payloads.</p>
        </div>
        <div className="text-right">
          <div className="mb-1 font-mono text-xl font-semibold text-[#ff8c7e]">Step {step} of 4</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(s => <div key={s} className={`h-1.5 w-8 rounded-full ${s <= step ? 'bg-[#e74c3c]' : 'bg-black/10'}`} />)}
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => publishAgent(d as unknown as FormValues))}>
          <div className="min-h-[400px] rounded-[1.75rem] border border-black/10 bg-[#f0f0f2] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-8">
            {step === 1 && <Step1Basic />}
            {step === 2 && <Step2Technical />}
            {step === 3 && <Step3Pricing />}
            {step === 4 && <Step4Examples onSubmit={methods.handleSubmit((d) => publishAgent(d as unknown as FormValues))} isSubmitting={isSubmitting} />}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
            <Button type="button" variant="ghost" className="text-muted-foreground hover:bg-black/5" disabled={step === 1 || isSubmitting} onClick={() => setStep(p => p - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {step < 4 && (
              <Button type="button" className="bg-[#e74c3c] text-white hover:bg-[#f05a48]" onClick={nextStep}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

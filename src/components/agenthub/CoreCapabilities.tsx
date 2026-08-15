import { Shield, LayoutGrid, TerminalSquare, Rocket, Code2, LineChart } from "lucide-react";

export function CoreCapabilities() {
  const features = [
    {
      title: "GitHub Access",
      desc: "Use GitHub identity for account access, creator attribution, and protected API key management.",
      icon: Shield
    },
    {
      title: "Marketplace Search",
      desc: "Filter agents by capability, schema, language, trust score, and usage-based pricing.",
      icon: LayoutGrid
    },
    {
      title: "Publishing Flow",
      desc: "Define the technical contract, pricing, and sample payloads needed to list an agent on the marketplace.",
      icon: Rocket
    },
    {
      title: "Sandbox Validation",
      desc: "Run requests in the browser to inspect payloads, responses, and latency before integration.",
      icon: TerminalSquare
    },
    {
      title: "Generated SDKs",
      desc: "Produce copy-ready client snippets that match the input and output schema of the selected agent.",
      icon: Code2
    },
    {
      title: "Creator Analytics",
      desc: "Track request volume, latency, trust signals, and estimated revenue across published agents.",
      icon: LineChart
    }
  ];

  return (
    <section className="section-shell w-full py-8 md:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.12)_0%,_rgba(231,76,60,0)_72%)] blur-3xl" />
      <div className="page-container">
        <div className="mb-8">
           <span className="section-badge mb-6">Capabilities</span>
           <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-4xl">Core platform capabilities</h2>
           <p className="max-w-2xl text-lg text-[#64748b]">The platform combines discovery, validation, publishing, and analytics so technical teams can work from one consistent product.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-panel group flex flex-col items-start rounded-[1.75rem] p-6 md:p-7">
               <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-[1rem] border border-black/8 bg-[#f0f0f2]/80 transition-colors group-hover:border-[#e74c3c]/30 group-hover:bg-[#e8e8ec]">
                 <feature.icon className="h-6 w-6 text-[#e74c3c]" strokeWidth={1.5} />
                 <div className="red-glow absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
               </div>
               <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-black/35">Product area</div>
               <h3 className="mb-3 text-xl font-bold tracking-tight text-[#1a1a2e]">{feature.title}</h3>
               <p className="text-sm leading-relaxed text-[#64748b] md:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

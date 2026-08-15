export function TrustStrip() {
  const items = [
    { label: "Access", sub: "GitHub sign-in" },
    { label: "Sandbox", sub: "Live execution" },
    { label: "SDKs", sub: "Generated" },
    { label: "Pricing", sub: "Usage-based" },
    { label: "Reviews", sub: "Verified" },
  ];

  return (
    <section className="relative mt-8 w-full py-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] top-1/2 h-28 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.16)_0%,_rgba(231,76,60,0)_72%)] blur-3xl" />
      <div className="page-container">
        <div className="glass-panel rounded-[2rem] border border-black/[0.08] px-6 py-6 md:px-8 md:py-8">
          <div className="grid grid-cols-2 gap-2 md:gap-x-4 md:gap-y-4 md:grid-cols-5">
          {items.map((item, i, arr) => (
             <div key={item.label} className="group relative col-span-1 flex items-center justify-center">
               <div className="w-full rounded-[1.4rem] border border-black/[0.05] bg-black/[0.02] px-4 py-5 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#e74c3c]/25 group-hover:bg-black/[0.03]">
                 <div className="mb-3 flex items-center justify-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-[#ff8c7e]" />
                   <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/35">AgentHub</span>
                 </div>
                 <div className="mb-[2px] text-xs md:text-sm font-semibold tracking-tight text-[#1a1a2e]">{item.label}</div>
                 <div className="text-[13px] text-[#64748b]">{item.sub}</div>
               </div>
               {i !== arr.length - 1 && (
                 <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-px h-8 bg-black/[0.04]"></div>
               )}
             </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

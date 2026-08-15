export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Browse the marketplace",
      desc: "Search by capability, language, schema, trust score, and cost to find agents that match your technical requirements."
    },
    {
      num: "02",
      title: "Validate in the sandbox",
      desc: "Run real requests in the browser, inspect structured responses, and confirm runtime behavior before you integrate."
    },
    {
      num: "03",
      title: "Ship with generated SDKs",
      desc: "Copy generated client snippets in Python, JavaScript, or cURL and move the integration into production with less setup work."
    }
  ];

  return (
    <section className="section-shell lux-border w-full py-6 md:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-14 h-52 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.14)_0%,_rgba(231,76,60,0)_72%)] blur-3xl" />
      <div className="page-container">
        <div className="mb-8">
          <span className="section-badge mb-6">Workflow</span>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-5xl">How teams move from discovery to integration</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-[#64748b]">AgentHub keeps evaluation and integration in one workflow so teams can compare agents, validate their outputs, and ship faster.</p>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          {steps.map((step, i) => (
            <div key={step.num} className="glass-panel group relative max-w-5xl rounded-[2rem] p-7 md:p-10">
               <div className="absolute -left-4 top-0 text-[90px] font-mono font-bold leading-none text-black/[0.02] md:-left-6 md:text-[150px]">
                 {step.num}
               </div>

               <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                 <div className="hidden md:flex flex-col items-center mt-1">
                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e74c3c]/25 bg-[#e74c3c]/12 font-mono text-lg font-bold text-[#ff8c7e] shadow-[0_0_24px_rgba(231,76,60,0.16)]">
                     {step.num}
                   </div>
                   {i !== steps.length - 1 && (
                     <div className="mt-4 h-24 w-px bg-gradient-to-b from-[#ff8c7e]/40 via-black/10 to-transparent"></div>
                   )}
                 </div>

                 <div className="max-w-2xl">
                   <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.32em] text-black/40">
                     <span className="h-1.5 w-1.5 rounded-full bg-[#ff8c7e]" />
                     Step {i + 1}
                   </div>
                   <h3 className="mb-4 text-2xl font-bold tracking-tight text-[#1a1a2e] transition-colors group-hover:text-[#ff8c7e] md:text-3xl">{step.title}</h3>
                   <p className="max-w-xl text-base leading-relaxed text-[#64748b] md:text-lg">{step.desc}</p>
                 </div>

                 <div className="flex-1 md:pl-6">
                   <div className="rounded-[1.6rem] border border-black/8 bg-black/[0.03] p-5">
                     <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#64748b]">Workflow progress</div>
                     <div className="h-2 overflow-hidden rounded-full bg-black/5">
                       <div
                         className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,140,126,0.95),rgba(231,76,60,0.45))]"
                         style={{ width: `${(i + 1) * 30}%` }}
                       />
                     </div>
                     <div className="mt-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.24em] text-black/35">
                       <span>Stage</span>
                       <span>{step.num}</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

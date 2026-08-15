export function ChainingPreview() {
  return (
    <section className="section-shell lux-border w-full overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 h-56 w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.16)_0%,_rgba(231,76,60,0)_72%)] blur-3xl" />
      <div className="page-container flex flex-col items-center text-center">
        
        <span className="eyebrow-badge mb-6 block">
          Workflow Preview
        </span>
        
        <h2 className="mb-6 max-w-3xl text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-5xl">Compose multi-agent workflows visually</h2>
        <p className="mb-16 max-w-2xl text-lg text-[#64748b]">
          The workflow builder is in development. This preview shows how agents will pass structured data from one step to the next.
        </p>

        <div className="glass-panel relative flex min-h-[400px] w-full max-w-5xl items-center justify-center rounded-[2rem] border border-black/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:p-16">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
             
             {/* Node 1 */}
             <div className="w-[200px] bg-[#f0f0f2] border border-[#e74c3c]/30 rounded-lg p-4 shadow-[0_0_30px_rgba(231,76,60,0.15)] relative">
               <div className="text-[10px] font-mono text-[#e74c3c] uppercase tracking-wider mb-2">Web Fetch</div>
               <div className="text-sm font-bold text-[#1a1a2e] mb-3">Collect source content</div>
               <div className="p-2 bg-white rounded border border-black/5 text-[10px] font-mono text-[#64748b]">
                 Out: {"{ raw_html: string }"}
               </div>
               {/* Right Hook */}
               <div className="hidden md:block absolute top-[50%] right-[-10px] w-3 h-3 bg-white border border-black/20 rounded-full translate-y-[-50%] z-20"></div>
             </div>

             {/* Connection Line 1 */}
             <div className="relative hidden h-[2px] flex-1 bg-gradient-to-r from-[#e74c3c]/50 to-black/10 md:block">
               <div className="animate-data-flow absolute inset-y-0 h-full w-24 bg-gradient-to-r from-transparent via-[#ff8c7e] to-transparent opacity-90" />
               <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white border border-black/10 text-[9px] font-mono text-[#64748b] px-2 py-0.5 rounded">
                 Map fields
               </div>
             </div>

             {/* Node 2 */}
             <div className="w-[200px] bg-[#f0f0f2] border border-black/10 rounded-lg p-4 relative hover:border-black/30 transition-colors">
               <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-[#ff8c7e]">Analysis</div>
               <div className="text-sm font-bold text-[#1a1a2e] mb-3">Summarize content</div>
               <div className="p-2 bg-white rounded border border-black/5 text-[10px] font-mono text-[#64748b]">
                 In: {"{ raw_text: string }"}
               </div>
               {/* Left/Right Hooks */}
               <div className="hidden md:block absolute top-[50%] left-[-10px] w-3 h-3 bg-[#e74c3c] rounded-full translate-y-[-50%] shadow-[0_0_10px_rgba(231,76,60,0.5)] z-20"></div>
               <div className="hidden md:block absolute top-[50%] right-[-10px] w-3 h-3 bg-white border border-black/20 rounded-full translate-y-[-50%] z-20"></div>
             </div>

             {/* Connection Line 2 */}
             <div className="relative hidden h-[2px] flex-1 bg-black/10 md:block">
               <div className="animate-data-flow absolute inset-y-0 h-full w-24 bg-gradient-to-r from-transparent via-black/25 to-transparent opacity-80" />
             </div>

             {/* Node 3 */}
             <div className="w-[200px] bg-[#f0f0f2] border border-black/10 rounded-lg p-4 relative hover:border-black/30 transition-colors">
               <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">Delivery</div>
               <div className="text-sm font-bold text-[#1a1a2e] mb-3">Send to Slack</div>
               <div className="p-2 bg-white rounded border border-black/5 text-[10px] font-mono text-[#64748b]">
                 In: {"{ message: string }"}
               </div>
               {/* Left Hook */}
               <div className="hidden md:block absolute top-[50%] left-[-10px] w-3 h-3 bg-white border border-black/20 rounded-full translate-y-[-50%] z-20"></div>
             </div>

          </div>
        </div>

      </div>
    </section>
  );
}

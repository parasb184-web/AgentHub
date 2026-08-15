import { Search, Github, Activity, Merge, Key, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function Phase2Preview() {
  const features = [
    { title: "Semantic Search", desc: "Natural-language lookup across the marketplace catalog.", icon: Search },
    { title: "Repository Scan", desc: "Codebase analysis for matching agent opportunities.", icon: Github },
    { title: "Gap Detection", desc: "Suggested capabilities based on repository context.", icon: Activity },
    { title: "Workflow Builder", desc: "Visual orchestration across multiple agents.", icon: Merge },
    { title: "API Keys", desc: "Managed access for testing and production usage.", icon: Key },
    { title: "Rate Limits", desc: "Configurable request limits for published agents.", icon: ShieldAlert }
  ];

  return (
    <section className="w-full py-24 md:py-32 relative bg-[radial-gradient(ellipse_at_top,_rgba(250,250,252,0.5)_0%,_rgba(255,255,255,1)_100%)]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 text-center flex flex-col items-center">
        
        <span className="eyebrow-badge mb-6 block">
          Preview
        </span>
        
        <h2 className="mb-16 max-w-2xl text-3xl font-bold tracking-tight text-[#1a1a2e] md:text-5xl">Preview areas for the next platform release</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl mb-16 text-left">
          {features.map((feature) => (
            <div key={feature.title} className="glass-panel p-6 rounded-xl border border-black/5 opacity-60 hover:opacity-100 transition-opacity flex flex-col relative overflow-hidden group">
               <div className="absolute top-4 right-4 rounded-full border border-black/10 bg-[#f0f0f2] px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#64748b]">Preview</div>
               <feature.icon className="w-5 h-5 text-[#64748b] mb-4 group-hover:text-[#1a1a2e] transition-colors" strokeWidth={1.5} />
               <h3 className="text-[#1a1a2e] font-semibold text-base mb-1">{feature.title}</h3>
               <p className="text-[#64748b] text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/login?redirect=/publish" className="rounded-full border border-black/20 bg-transparent px-8 py-4 text-sm font-semibold text-[#1a1a2e] transition-colors hover:border-black/50 hover:bg-black/[0.03]">
          Sign in for product updates
        </Link>

      </div>
    </section>
  );
}

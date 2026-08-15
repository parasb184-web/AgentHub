import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeatureQuickMenu, FeatureRail } from "@/components/agenthub/FeatureRail";
import { Footer } from "@/components/agenthub/StrongCTA";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Metric = {
  label: string;
  value: string;
};

type QuickLink = {
  href: string;
  label: string;
};

export function FeaturePageShell({
  eyebrow,
  title,
  description,
  metrics,
  quickLinks,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  metrics: Metric[];
  quickLinks: QuickLink[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#ffffff]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,76,60,0.12),transparent_24%),linear-gradient(180deg,#fafafa_0%,#f5f5f7_52%,#ffffff_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 hero-grid opacity-[0.04]" />
      <div
        aria-hidden="true"
        className="animate-aurora-drift absolute left-[6%] top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(231,76,60,0.16)_0%,_rgba(231,76,60,0)_72%)] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="animate-aurora-drift-reverse absolute right-[8%] top-[16%] hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0)_72%)] blur-[104px] md:block"
      />

      <div className="relative z-10 2xl:pl-[288px]">
        <aside className="fixed bottom-0 left-0 top-20 z-30 hidden w-[288px] 2xl:block">
          <FeatureRail variant="attached" />
        </aside>

        <div className="page-container max-w-[1340px] pb-20 pt-20 md:pt-24">
          <FeatureQuickMenu />

          <section
            className="surface-primary animate-fade-in-up mb-8 overflow-hidden rounded-[2rem] p-6 md:p-8 lg:p-10"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex flex-col gap-8 2xl:flex-row 2xl:items-end 2xl:justify-between">
              <div className="max-w-3xl 2xl:flex-[1_1_640px]">
                <span className="eyebrow-badge mb-6">{eyebrow}</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#1a1a2e]">
                  {title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-[#64748b] md:text-lg">
                  {description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4 uppercase tracking-[0.18em]")}
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-3 2xl:w-auto 2xl:min-w-[420px] 2xl:max-w-[480px] 2xl:flex-[0_1_480px]">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="metric-card"
                  >
                    <div className="metric-card-label">
                      {metric.label}
                    </div>
                    <div className="metric-card-value mt-3">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-0">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

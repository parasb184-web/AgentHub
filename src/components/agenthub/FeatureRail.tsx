"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { featureNavItems, type FeatureNavItem } from "@/lib/featureNavigation";

type RailVariant = "sticky" | "attached";

const statusLabel: Record<FeatureNavItem["status"], string> = {
  live: "LIVE",
  new: "NEW",
  soon: "PREVIEW",
};

const statusClassName: Record<FeatureNavItem["status"], string> = {
  live: "border-[#4ade80]/18 bg-[#4ade80]/10 text-[#86efac]",
  new: "border-[#ff8c7e]/18 bg-[#e74c3c]/10 text-[#ff8c7e]",
  soon: "border-black/10 bg-black/[0.03] text-[#94a3b8]",
};

const coreItems = ["Home", "Marketplace", "Platform", "Signal", "Repo Scan", "Workflows"];
const builderItems = ["Publish", "Creator", "Launchpad"];

const pickItems = (titles: string[]) =>
  titles
    .map((title) => featureNavItems.find((item) => item.title === title))
    .filter((item): item is FeatureNavItem => Boolean(item));

const railGroups = [
  { title: "Product", items: pickItems(coreItems) },
  { title: "Creator Tools", items: pickItems(builderItems) },
];

const isItemActive = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function FeatureRail({
  className,
  variant = "sticky",
}: {
  className?: string;
  variant?: RailVariant;
}) {
  const pathname = usePathname();
  const attached = variant === "attached";

  return (
    <aside className={cn(attached ? "h-full" : "sticky top-24", className)}>
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden border border-black/10 bg-[linear-gradient(180deg,rgba(250,250,252,0.96),rgba(248,248,250,0.98))] backdrop-blur-xl",
          attached
            ? "border-b-0 border-l-0 border-t-0 border-r-black/8 rounded-none"
            : "glass-panel rounded-[1.9rem]"
        )}
      >
        <div className={cn("border-b border-black/8", attached ? "px-5 pb-4 pt-6" : "px-5 pb-4 pt-5")}>
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-[0.95rem] border border-black/12 bg-[#f5f5f7] text-lg font-black text-[#1a1a2e] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              A
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-[3px] bg-[#ff6a57]" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
                AgentHub
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#64748b]">
                Navigation
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {railGroups.map((group, groupIndex) => (
            <div key={group.title} className={cn(groupIndex > 0 && "mt-3 border-t border-black/8 pt-3")}>
              <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6b7280]">
                {group.title}
              </div>

              <nav className="relative pl-5">
                {group.items.map((item, itemIndex) => {
                  const active = isItemActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-[0.95rem] px-3 py-3 transition-all duration-300",
                        active
                          ? "bg-[linear-gradient(180deg,rgba(231,76,60,0.18),rgba(0,0,0,0.02))] text-[#1a1a2e] shadow-[0_12px_30px_rgba(231,76,60,0.08)]"
                          : "text-[#374151] hover:bg-black/[0.03] hover:text-[#1a1a2e]"
                      )}
                    >
                      {/* Map node dot */}
                      <div
                        className={cn(
                          "absolute left-[-0.625rem] top-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300",
                          active
                            ? "h-3 w-3 border-[#e74c3c] bg-[#e74c3c] shadow-[0_0_8px_rgba(231,76,60,0.6)]"
                            : "h-2.5 w-2.5 border-black/20 bg-[#f0f0f2] group-hover:border-[#e74c3c]/50 group-hover:bg-[#e74c3c]/20"
                        )}
                      />

                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] border transition-all duration-300",
                          active
                            ? "border-[#ff8c7e]/18 bg-[#e74c3c]/12 text-[#ff8c7e] scale-110"
                            : "border-black/10 bg-[#f0f0f2] text-[#94a3b8] group-hover:border-black/14 group-hover:text-[#1a1a2e] group-hover:scale-105"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[15px] font-medium tracking-tight">
                            {item.title}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300",
                              statusClassName[item.status],
                              active && "scale-105"
                            )}
                          >
                            {statusLabel[item.status]}
                          </span>
                        </div>
                        <span className={cn(
                          "block text-[11px] leading-snug mt-0.5 transition-all duration-300 overflow-hidden",
                          active
                            ? "max-h-8 text-[#94a3b8] opacity-100"
                            : "max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 group-hover:text-[#6b7280]"
                        )}>
                          {featureNavItems.find((n) => n.href === item.href)?.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function FeatureQuickMenu({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("mb-6 flex gap-2 overflow-x-auto pb-2 xl:hidden scrollbar-hide", className)}>
      {featureNavItems.map((item) => {
        const active = isItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300",
              active
                ? "border-[#e74c3c]/28 bg-[#e74c3c]/10 text-[#ff8c7e] shadow-[0_0_12px_rgba(231,76,60,0.15)] scale-105"
                : "border-black/10 bg-black/[0.02] text-[#64748b] hover:border-[#e74c3c]/20 hover:text-[#1a1a2e] hover:scale-105 active:scale-95"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

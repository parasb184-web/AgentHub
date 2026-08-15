"use client";

import { useQueryState, parseAsArrayOf, parseAsString, parseAsFloat } from "nuqs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/lib/types";
import { useMemo } from "react";

export const FilterSidebar = ({ agents }: { agents: Agent[] }) => {
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));
  const [langs, setLangs] = useQueryState("langs", parseAsArrayOf(parseAsString).withDefault([]));
  const [maxCost, setMaxCost] = useQueryState("cost", parseAsFloat.withDefault(2.0));
  const [minTrust, setMinTrust] = useQueryState("trust", parseAsFloat.withDefault(0));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("newest"));

  const allTags = useMemo(() => Array.from(new Set(agents.flatMap((a) => a.capabilityTags))).sort(), [agents]);
  const allLangs = useMemo(() => Array.from(new Set(agents.flatMap((a) => a.supportedLanguages))).sort(), [agents]);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter((t) => t !== tag));
    else setTags([...tags, tag]);
  };

  const toggleLang = (lang: string) => {
    if (langs.includes(lang)) setLangs(langs.filter((l) => l !== lang));
    else setLangs([...langs, lang]);
  };

  const hasFilters = tags.length > 0 || langs.length > 0 || maxCost < 2.0 || minTrust > 0 || sort !== "newest";

  const resetFilters = () => {
    setTags([]);
    setLangs([]);
    setMaxCost(2.0);
    setMinTrust(0);
    setSort("newest");
  };

  return (
    <div className="lg:sticky lg:top-28 space-y-8 rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,250,252,0.98))] p-4 md:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-black/8 pb-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#1a1a2e]">Filters</h3>
          <p className="mt-1 text-sm text-[#64748b]">Refine the catalog to the agents that fit your requirements.</p>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#64748b] transition-colors hover:border-[#e74c3c]/40 hover:text-[#ff8c7e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748b]">Sort</h4>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="control-shell select-shell bg-white text-sm"
        >
          <option value="newest">Newest</option>
          <option value="used">Most Used</option>
          <option value="rated">Highest Rated</option>
          <option value="cost">Lowest Cost</option>
        </select>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748b]">Price Ceiling</h4>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#64748b]">$0</span>
          <span className="text-xs font-mono font-bold text-[#ff8c7e]">${maxCost.toFixed(2)}</span>
        </div>
        <Slider
          value={[maxCost]}
          min={0}
          max={2.0}
          step={0.01}
          onValueChange={(vals) => setMaxCost((vals as number[])[0])}
          className="w-full accent-[#e74c3c]"
        />
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748b]">Minimum Trust</h4>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#64748b]">0</span>
          <span className="text-xs font-mono font-bold text-[#ff8c7e]">{minTrust}</span>
        </div>
        <Slider
          value={[minTrust]}
          min={0}
          max={100}
          step={1}
          onValueChange={(vals) => setMinTrust((vals as number[])[0])}
          className="w-full accent-[#e74c3c]"
        />
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748b]">Capabilities</h4>
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {allTags.map((tag) => (
            <label key={tag} className="group flex cursor-pointer items-center space-x-3">
              <Checkbox checked={tags.includes(tag)} onCheckedChange={() => toggleTag(tag)} className="border-black/20 bg-black/[0.02] data-[state=checked]:border-[#e74c3c] data-[state=checked]:bg-[#e74c3c]" />
              <span className="text-sm font-medium text-[#374151] transition-colors group-hover:text-[#1a1a2e]">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748b]">Languages</h4>
        <div className="space-y-3">
          {allLangs.map((lang) => (
            <label key={lang} className="group flex cursor-pointer items-center space-x-3">
              <Checkbox checked={langs.includes(lang)} onCheckedChange={() => toggleLang(lang)} className="border-black/20 bg-black/[0.02] data-[state=checked]:border-[#e74c3c] data-[state=checked]:bg-[#e74c3c]" />
              <span className="text-sm font-medium text-[#374151] transition-colors group-hover:text-[#1a1a2e]">{lang}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

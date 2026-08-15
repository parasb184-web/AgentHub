import Link from "next/link";
import { Agent } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { Star, Activity } from "lucide-react";

const getTagColor = (tag: string) => {
  const colors = [
    "bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/20",
    "bg-purple-400/10 text-purple-600 border-purple-400/20",
    "bg-amber-400/10 text-amber-600 border-amber-400/20",
    "bg-emerald-400/10 text-emerald-600 border-emerald-400/20",
    "bg-cyan-400/10 text-cyan-600 border-cyan-400/20",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatCalls = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

export const AgentCard = ({ agent }: { agent: Agent }) => {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card className="group h-full cursor-pointer flex-col overflow-hidden border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.98))] text-[#1a1a2e] shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:border-[#e74c3c]/40 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]">
        <CardHeader className="pb-3 px-5 pt-5 flex flex-row items-start justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="flex items-center gap-2 truncate text-base font-bold leading-tight text-[#1a1a2e]">
              {agent.name}
              {agent.version && <span className="rounded border border-black/10 bg-black/[0.03] px-1.5 py-0.5 text-xs font-normal text-[#64748b]">v{agent.version}</span>}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <span className="font-mono flex items-center">
                <img src={`https://github.com/${agent.creatorUsername}.png?size=32`} className="mr-1.5 h-4 w-4 rounded-full ring-1 ring-black/10" alt="" />
                {agent.creatorUsername}
              </span>
            </div>
          </div>
          <div>
            <TrustScoreBadge trustScore={agent.trustScore || 50} />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4 flex-1">
          <p className="mb-4 h-12 line-clamp-2 text-sm leading-6 text-[#6b7280]">{agent.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilityTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className={`border px-1.5 py-0 font-mono text-[10px] ${getTagColor(tag)}`}>
                {tag}
              </Badge>
            ))}
            {agent.capabilityTags.length > 3 && (
              <Badge variant="outline" className="border border-black/10 bg-black/[0.02] px-1.5 py-0 font-mono text-[10px] text-[#64748b]">
                +{agent.capabilityTags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-black/[0.04] bg-black/[0.02] px-5 py-3 text-xs text-[#64748b]">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 transition-colors group-hover:text-[#ffd07f]">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {agent.rating?.toFixed(1) || "No ratings"}
            </span>
            <span className="flex items-center gap-1 truncate transition-colors group-hover:text-[#ff8c7e]">
              <Activity className="w-3.5 h-3.5" />
              {formatCalls(agent.totalCalls || 0)} requests
            </span>
          </div>
          <div className="flex items-baseline gap-1 text-right text-[#1a1a2e]">
            <span className="font-mono text-xs">${agent.costPerCall?.toFixed(3) || "0.000"}</span>
            <span className="font-mono text-[10px] text-[#64748b]">/call</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

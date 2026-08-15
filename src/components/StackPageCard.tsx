import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { Agent } from "@/lib/types";

export const StackPageCard = ({ agent }: { agent: Agent }) => {
  return (
    <Card className="border-black/10 bg-[#f0f0f2] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#1a1a2e]">{agent.name}</h3>
            <p className="mt-1 text-sm text-[#64748b]">@{agent.creatorUsername}</p>
          </div>
          <TrustScoreBadge trustScore={agent.trustScore} />
        </div>

        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-[#6b7280]">
          {agent.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {agent.capabilityTags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="border-[#e74c3c]/20 bg-[#e74c3c]/10 text-[#ff9b8f]">
              {tag}
            </Badge>
          ))}
        </div>

        <Link
          href={`/agents/${agent.id}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ff8c7e] transition-colors hover:text-[#1a1a2e]"
        >
          View agent
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

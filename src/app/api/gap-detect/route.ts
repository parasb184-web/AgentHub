import { NextResponse } from "next/server";
import { queryNearestAgents } from "@/lib/vectorSearch";
import { db } from "@/lib/firebase";
import { MOCK_AGENTS } from "@/lib/dummyData";
import { collection, query, where, getDocs } from "firebase/firestore";

const IMPACT_STRINGS: Record<string, string> = {
  "code-review": "Teams save 3–4 hrs/week on manual PR reviews",
  "test-writing": "Increases test coverage by 40% in first month",
  "bug-triage": "Reduces bug response time from days to hours",
  "changelog-generation": "Saves 2 hrs per release cycle",
  "summarization": "Cuts meeting follow-up time by 60%",
  "data-extraction": "Eliminates 5+ hrs/week of manual data entry",
  "classification": "Processes 10x more tickets with same team size"
};

export async function POST(req: Request) {
  try {
    const { repoLanguages, repoTags, currentCategories } = await req.json();

    const searchString = `${repoLanguages?.join(" ")} ${repoTags?.join(" ")}`;

    // Nearest neighbours come from the agent index rather than a dedicated repo
    // index: repos are only embedded once they have been scanned, so a fresh
    // deployment has nothing to match against. Agent embeddings are a usable
    // stand-in because both are embedded as "language language tag tag" strings.
    // Vector lookup is best-effort; Upstash may be unconfigured.
    try {
      await queryNearestAgents(searchString, 5);
    } catch (e) {
      console.warn("Vector similarity unavailable, continuing", e);
    }

    // Union of every capability tag seen across previously scanned repos.
    const unionCategories = new Set<string>();

    // repo_scans may be empty, denied by rules, or unreachable. None of those
    // should fail the request - the default gaps below still give the user
    // something useful.
    try {
      const scansCol = collection(db, "repo_scans");
      const scansQuery = await getDocs(scansCol);
      scansQuery.docs.forEach(doc => {
        const data = doc.data();
        if (data.agentMatches) {
          data.agentMatches.forEach((m: any) => {
            if (m.capabilityTags) {
              m.capabilityTags.forEach((t: string) => unionCategories.add(t));
            }
          });
        }
      });
    } catch (e) {
      console.warn("repo_scans unavailable, using default gap categories", e);
    }

    const currentCats = new Set<string>(currentCategories || []);
    const gaps = Array.from(unionCategories).filter(c => !currentCats.has(c));

    // Add default fallbacks if gaps are empty so UI isn't empty
    if (gaps.length === 0) {
      ["code-review", "test-writing"].filter(c => !currentCats.has(c)).forEach(c => gaps.push(c));
    }

    const gapAgents: any[] = [];
    const agentCols = collection(db, "agents");

    for (const gap of gaps) {
      if (gapAgents.length >= 3) break; // Limit to 3 gaps shown to user
      const q = query(agentCols, where("capabilityTags", "array-contains", gap));
      let agentsForCat: any[] = [];
      try {
        const snaps = await getDocs(q);
        agentsForCat = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch {
        agentsForCat = [];
      }

      // Firestore is empty or unreachable in demo mode, so fall back to the
      // local catalog rather than returning an empty card to the user.
      if (agentsForCat.length === 0) {
        agentsForCat = MOCK_AGENTS.filter(a => a.capabilityTags.includes(gap));
      }

      if (agentsForCat.length > 0) {
        gapAgents.push({
          category: gap,
          agent: agentsForCat[0],
          impact: IMPACT_STRINGS[gap] || "Boosts productivity immediately."
        });
      }
    }

    return NextResponse.json(gapAgents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

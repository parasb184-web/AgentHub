import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(_: Request, { params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = await params;
  let count = 0;

  try {
    const snapshot = await getDocs(
      query(collection(db, "repo_stacks"), where("ownerRepo", "==", `${owner}/${repo}`))
    );

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as { agents?: unknown[] };
      count = Array.isArray(data.agents) ? data.agents.length : 0;
    }
  } catch {
    count = 0;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <rect width="70" height="20" fill="#555"/>
  <rect x="70" width="50" height="20" fill="#0F5FFF"/>
  <text x="35" y="14" fill="white" font-size="11" font-family="monospace" text-anchor="middle">AgentHub</text>
  <text x="95" y="14" fill="white" font-size="11" font-family="monospace" text-anchor="middle">${count} agents</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "s-maxage=3600",
    },
  });
}

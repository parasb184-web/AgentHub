import { ImageResponse } from "next/og";
import { createElement } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner") || "repo";
  const repo = searchParams.get("repo") || "stack";

  let agentNames: string[] = [];
  try {
    const snapshot = await getDocs(
      query(collection(db, "repo_stacks"), where("ownerRepo", "==", `${owner}/${repo}`))
    );
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as { agents?: { name?: string }[] };
      agentNames = (data.agents || []).slice(0, 3).map((agent) => agent.name || "Agent");
    }
  } catch {
    agentNames = [];
  }

  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#08111d 0%, #102443 52%, #09111d 100%)",
          padding: "64px",
          color: "white",
          fontFamily: "sans-serif",
        },
      },
      createElement("div", { style: { fontSize: 28, opacity: 0.8 } }, "AgentHub"),
      createElement(
        "div",
        null,
        createElement("div", { style: { fontSize: 58, fontWeight: 700 } }, `${owner}/${repo}'s Agent Stack`),
        createElement(
          "div",
          { style: { display: "flex", gap: 16, marginTop: 28 } },
          ...agentNames.map((name) =>
            createElement(
              "div",
              {
                key: name,
                style: {
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "10px 18px",
                  fontSize: 24,
                },
              },
              name
            )
          )
        )
      ),
      createElement("div", { style: { fontSize: 24, opacity: 0.7 } }, "Powered by AgentHub")
    ),
    { width: 1200, height: 630 }
  );
}

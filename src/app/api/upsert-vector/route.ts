import { NextResponse } from "next/server";
import { upsertAgentVector } from "@/lib/vectorSearch";

export async function POST(req: Request) {
  try {
    const { agentId, text } = await req.json();
    if (!agentId || !text) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    await upsertAgentVector(agentId, text);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

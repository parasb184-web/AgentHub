import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = doc(db, "chains", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Minimal run chain mock logic
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const inputPayload = await req.json();
    const docRef = doc(db, "chains", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const chain = snap.data();
    let currentPayload = inputPayload;

    // Simplistic topological run mock
    for (const node of chain.nodes) {
      // In real life: map previous output to this node using chain.mappings, then fetch
      // For demo, we just simulate a small wait and passing payload
      await new Promise(r => setTimeout(r, 500));
      currentPayload = {
        ...currentPayload,
        [node.data.agent.name]: "Processed by " + node.data.agent.id
      };
    }

    return NextResponse.json({ success: true, finalOutput: currentPayload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

export async function GET(req: Request) {
  // Mock auth for demo purposes since Next.js route handlers don't have client firebase auth context easily
  // Usually we'd use cookies or pass uid in headers
  const uid = req.headers.get("x-user-id") || "demo-user";

  try {
    const q = query(collection(db, "chains"), where("userId", "==", uid));
    const snaps = await getDocs(q);
    const chains = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(chains);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const uid = req.headers.get("x-user-id") || "demo-user";

    const docRef = await addDoc(collection(db, "chains"), {
      ...data,
      userId: uid,
      createdAt: Timestamp.now()
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

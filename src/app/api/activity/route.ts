import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const seedEvents = [
  { agentName: "PR Review Agent", repoType: "Next.js app", action: "started using" },
  { agentName: "Bug Triager", repoType: "Python ML project", action: "integrated" },
  { agentName: "Test Writer", repoType: "React component library", action: "started using" },
  { agentName: "Changelog Generator", repoType: "Node.js API", action: "deployed" },
  { agentName: "Code Summarizer", repoType: "Go microservice", action: "integrated" },
  { agentName: "Email Drafter", repoType: "SaaS startup", action: "started using" },
  { agentName: "Slack Summarizer", repoType: "remote-first team", action: "deployed" },
  { agentName: "SQL Generator", repoType: "data analytics team", action: "integrated" },
  { agentName: "Sentiment Analyzer", repoType: "e-commerce platform", action: "started using" },
  { agentName: "Data Extractor", repoType: "fintech startup", action: "deployed" },
];

const insertEvent = async (event: { agentName: string; repoType: string; action: string }, timestamp: Date, isSeeded = false) => {
  await addDoc(collection(db, "activity_feed"), {
    agentName: event.agentName,
    repoType: event.repoType,
    eventType: event.action,
    timestamp: Timestamp.fromDate(timestamp),
    isSeeded,
  });
};

const seedIfEmpty = async () => {
  const existing = await getDocs(query(collection(db, "activity_feed"), limit(1)));
  if (!existing.empty) return;

  const now = Date.now();
  const entries = Array.from({ length: 40 }).map((_, index) => {
    const template = seedEvents[index % seedEvents.length];
    const offsetMs = Math.floor((index / 39) * 6 * 60 * 60 * 1000);
    return insertEvent(template, new Date(now - offsetMs), true);
  });

  await Promise.all(entries);
};

export async function GET(request: Request) {
  try {
    await seedIfEmpty();

    const isCron = request.headers.get("x-vercel-cron") !== null || new URL(request.url).searchParams.get("emit") === "1";
    if (isCron) {
      const random = seedEvents[Math.floor(Math.random() * seedEvents.length)];
      await insertEvent(random, new Date());
    }

    const snapshot = await getDocs(
      query(collection(db, "activity_feed"), orderBy("timestamp", "desc"), limit(20))
    );

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(events);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load activity feed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.agentName || !body.repoType || !body.eventType) {
      return NextResponse.json({ error: "agentName, repoType and eventType are required" }, { status: 400 });
    }

    const ref = await addDoc(collection(db, "activity_feed"), {
      agentName: body.agentName,
      repoType: body.repoType,
      eventType: body.eventType,
      timestamp: Timestamp.now(),
      isSeeded: false,
    });

    return NextResponse.json({ id: ref.id, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to insert activity event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

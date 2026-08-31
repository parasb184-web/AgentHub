import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";

// Vercel caps serverless functions at 10s by default; these call out to
// Gemini, GitHub or a third-party agent endpoint and need longer.
export const maxDuration = 60;

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

/**
 * Firestore reads reject when the backend is unreachable, but writes do not --
 * they queue offline indefinitely, so seeding 40 documents can block the route
 * for minutes. Every Firestore call here is therefore bounded, and any failure
 * degrades to this local feed rather than hanging the request.
 */
const FIRESTORE_TIMEOUT_MS = 5000;

const withTimeout = <T>(promise: Promise<T>, ms = FIRESTORE_TIMEOUT_MS): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore request timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
};

const buildLocalFeed = () => {
  const now = Date.now();
  return Array.from({ length: 20 }).map((_, index) => {
    const template = seedEvents[index % seedEvents.length];
    const offsetMs = Math.floor((index / 19) * 6 * 60 * 60 * 1000);
    return {
      id: `local-${index}`,
      agentName: template.agentName,
      repoType: template.repoType,
      eventType: template.action,
      timestamp: Timestamp.fromDate(new Date(now - offsetMs)),
      isSeeded: true,
    };
  });
};

export async function GET(request: Request) {
  if (!isFirebaseConfigured) {
    return NextResponse.json(buildLocalFeed());
  }

  try {
    await withTimeout(seedIfEmpty());

    const isCron = request.headers.get("x-vercel-cron") !== null || new URL(request.url).searchParams.get("emit") === "1";
    if (isCron) {
      const random = seedEvents[Math.floor(Math.random() * seedEvents.length)];
      await insertEvent(random, new Date());
    }

    const snapshot = await withTimeout(
      getDocs(query(collection(db, "activity_feed"), orderBy("timestamp", "desc"), limit(20)))
    );

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(events);
  } catch (error: unknown) {
    // Unreachable or not-yet-enabled Firestore must not fail the page.
    console.warn("Activity feed unavailable, serving local feed:", error);
    return NextResponse.json(buildLocalFeed());
  }
}

export async function POST(request: Request) {
  if (!isFirebaseConfigured) {
    return NextResponse.json(
      { error: "Activity feed is read-only in demo mode. Add Firebase credentials to persist events." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    if (!body.agentName || !body.repoType || !body.eventType) {
      return NextResponse.json({ error: "agentName, repoType and eventType are required" }, { status: 400 });
    }

    const ref = await withTimeout(addDoc(collection(db, "activity_feed"), {
      agentName: body.agentName,
      repoType: body.repoType,
      eventType: body.eventType,
      timestamp: Timestamp.now(),
      isSeeded: false,
    }));

    return NextResponse.json({ id: ref.id, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to insert activity event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

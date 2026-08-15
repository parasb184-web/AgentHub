import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAgentById } from "@/lib/firestore";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://mock.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "mock"
});

const isMockAgent = (agent: { id: string; endpointUrl: string }) =>
  agent.id.startsWith("mock-") ||
  agent.endpointUrl.includes("api.agenthub.dev") ||
  agent.endpointUrl.includes("example.com");

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let errorStr: string | null = null;
  let latencyMs = 0;

  try {
    const authHeader = req.headers.get("Authorization");
    // For local dev ease, we'll allow passing without auth if it's the demo-user UI. 
    // Wait, the prompt strictly says: "Add middleware in app/api to validate Bearer token on all sandbox calls". 
    // Since UI sandbox calls this, the UI needs to send a dev token or we make it strictly required.
    // Let's make it strictly required.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Missing Bearer token. Create one in your Dashboard." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const keyHash = crypto.createHash("sha256").update(token).digest("hex");

    const q = query(collection(db, "api_keys"), where("keyHash", "==", keyHash), where("isActive", "==", true));
    const snaps = await getDocs(q);
    if (snaps.empty) {
      return NextResponse.json({ success: false, error: "Invalid or revoked API key" }, { status: 403 });
    }
    const apiKeyDoc = snaps.docs[0];
    const apiKeyData = apiKeyDoc.data();
    await updateDoc(doc(db, "api_keys", apiKeyDoc.id), { lastUsedAt: Timestamp.now() });

    const userId = apiKeyData.userId;

    const inputPayload = await req.json();
    const { id } = await params;
    const agent = await getAgentById(id);

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    // Upstash Redis Rate Limiting
    try {
      const rl = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(agent.rateLimit || 10, "1 m"),
      });
      const { success } = await rl.limit(`rl_${userId}_${agent.id}`);
      if (!success) {
        return NextResponse.json({ success: false, error: "Rate limit exceeded. Try again later." }, { status: 429 });
      }
    } catch (rlError) {
      console.warn("Rate limit check failed, proceeding anyway", rlError);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const startTime = Date.now();
    let outputPayload = null;
    let success = false;

    try {
      if (isMockAgent(agent)) {
        // Return the seeded sample response for marketplace demo agents.
        await new Promise(r => setTimeout(r, agent.latencyMs || 500));
        outputPayload = agent.exampleOutput;
        success = true;
      } else {
        const resp = await fetch(agent.endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inputPayload),
          signal: controller.signal
        });

        if (!resp.ok) {
          throw new Error(`Endpoint returned status ${resp.status}`);
        }

        outputPayload = await resp.json();
        success = true;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        errorStr = "Request timed out (SLA exceeded 10s)";
      } else {
        errorStr = e.message;
      }
    } finally {
      clearTimeout(timeoutId);
      latencyMs = Date.now() - startTime;
    }

    try {
      const callsCol = collection(db, "agent_calls");
      await addDoc(callsCol, {
        agentId: agent.id,
        userId: userId,
        inputPayload,
        outputPayload: outputPayload || { error: errorStr },
        latencyMs,
        success,
        timestamp: Timestamp.now()
      });
    } catch (logError) {
      console.error("Failed to log call:", logError);
    }

    if (!success) {
      return NextResponse.json({ success: false, error: errorStr, latencyMs });
    }

    return NextResponse.json({ success: true, output: outputPayload, latencyMs });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: errorStr || error.message, latencyMs }, { status: 500 });
  }
}

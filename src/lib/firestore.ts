import { db, isFirebaseConfigured } from "./firebase";
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, addDoc, query, where, orderBy, Timestamp, runTransaction } from "firebase/firestore";
import { Agent, AgentCall, AgentReview } from "./types";
import { MOCK_AGENTS } from "./dummyData";

/**
 * Firestore does not reject when the backend is unreachable - it retries in the
 * background, so an awaited read can hang forever and a `catch` never fires.
 * Every UI-facing read below is bounded so the caller always settles.
 */
const FIRESTORE_TIMEOUT_MS = 6000;

const withTimeout = <T>(promise: Promise<T>, ms = FIRESTORE_TIMEOUT_MS): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore request timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
};

export const getAgents = async (): Promise<Agent[]> => {
  // Demo mode: never touch Firestore, just serve the local catalog.
  if (!isFirebaseConfigured) return MOCK_AGENTS;

  try {
    const q = query(collection(db, "agents"), where("status", "==", "active"));
    const snapshot = await withTimeout(getDocs(q));
    const firestoreAgents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
    const mockIds = new Set(MOCK_AGENTS.map(a => a.id));
    const uniqueFirestore = firestoreAgents.filter(a => !mockIds.has(a.id));
    return [...uniqueFirestore, ...MOCK_AGENTS];
  } catch (e) {
    console.warn("Firestore getAgents failed, using mock data", e);
    return MOCK_AGENTS;
  }
};

export const getAgentById = async (id: string): Promise<Agent | null> => {
  const mockAgent = MOCK_AGENTS.find(a => a.id === id);
  if (mockAgent) return mockAgent;

  if (!isFirebaseConfigured) return null;

  try {
    const docRef = doc(db, "agents", id);
    const docSnap = await withTimeout(getDoc(docRef));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Agent;
  } catch (e) {
    console.warn("Firestore getAgentById failed", e);
    return null;
  }
};

export const getAgentReviews = async (agentId: string): Promise<AgentReview[]> => {
  if (!isFirebaseConfigured) return [];

  try {
    const q = query(collection(db, "agent_reviews"), where("agentId", "==", agentId), orderBy("createdAt", "desc"));
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AgentReview));
  } catch (e) {
    console.warn("Firestore getAgentReviews failed", e);
    return [];
  }
};

export const createAgent = async (agent: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(collection(db, "agents"), {
    ...agent,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const checkHasRunSandbox = async (agentId: string, userId: string): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;

  try {
    const q = query(
      collection(db, "agent_calls"),
      where("agentId", "==", agentId),
      where("userId", "==", userId)
    );
    const snapshot = await withTimeout(getDocs(q));
    return snapshot.docs.length > 0;
  } catch (e) {
    console.warn("Firestore checkHasRunSandbox failed", e);
    return false;
  }
};

export const addReview = async (agentId: string, userId: string, rating: number, body: string): Promise<void> => {
  const agentRef = doc(db, "agents", agentId);
  const reviewRef = doc(collection(db, "agent_reviews"));

  await runTransaction(db, async (transaction) => {
    const agentDoc = await transaction.get(agentRef);
    if (!agentDoc.exists()) throw new Error("Agent does not exist!");

    const data = agentDoc.data() as Agent;
    const currentRating = data.rating || 0;
    const currentCount = data.reviewCount || 0;

    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + rating) / newCount;

    transaction.set(reviewRef, {
      id: reviewRef.id,
      agentId,
      userId,
      rating,
      body,
      createdAt: Timestamp.now()
    });

    transaction.update(agentRef, {
      rating: newRating,
      reviewCount: newCount,
      updatedAt: Timestamp.now()
    });
  });
};

export const submitCopyrightClaim = async (claim: {
  agentId: string;
  agentName: string;
  reporterId: string;
  reporterUsername: string;
  originalAgentUrl: string;
  description: string;
  evidenceUrl: string;
  relationship: "creator" | "representative";
}): Promise<string> => {
  const docRef = await addDoc(collection(db, "copyright_claims"), {
    ...claim,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const hasCopyrightClaim = async (agentId: string, userId: string): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;

  try {
    const q = query(
      collection(db, "copyright_claims"),
      where("agentId", "==", agentId),
      where("reporterId", "==", userId)
    );
    const snapshot = await withTimeout(getDocs(q));
    return !snapshot.empty;
  } catch (e) {
    console.warn("Firestore hasCopyrightClaim failed", e);
    return false;
  }
};

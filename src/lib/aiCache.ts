import crypto from "crypto";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { adminDb } from "./firebaseAdmin";

/**
 * Response cache for the AI clients.
 *
 * Prefers the Admin SDK, which bypasses security rules — these collections are
 * written only by server code, so they are denied to the client SDK under any
 * sane ruleset. Falls back to the client SDK, then to no caching at all. A cache
 * miss is never fatal: every failure path just means the caller hits the model.
 *
 * `createdAtMs` is a plain number rather than a Firestore Timestamp so the same
 * document shape works through both SDKs.
 */

const TIMEOUT_MS = 5000;

const withTimeout = <T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore cache timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
};

export const cacheKeyHash = (cacheKey: string) =>
  crypto.createHash("md5").update(cacheKey).digest("hex");

export async function readCache(
  collectionName: string,
  cacheKey: string,
  ttlHours: number
): Promise<string | null> {
  const id = cacheKeyHash(cacheKey);

  try {
    if (adminDb) {
      const snap = await withTimeout(adminDb.collection(collectionName).doc(id).get());
      if (!snap.exists) return null;
      const data = snap.data() as { result?: string; createdAtMs?: number } | undefined;
      if (!data?.result || !data.createdAtMs) return null;
      const ageHours = (Date.now() - data.createdAtMs) / 3600000;
      return ageHours < ttlHours ? data.result : null;
    }

    if (!isFirebaseConfigured) return null;

    const snap = await withTimeout(getDoc(doc(db, collectionName, id)));
    if (!snap.exists()) return null;
    const data = snap.data() as { result?: string; createdAtMs?: number };
    if (!data?.result || !data.createdAtMs) return null;
    const ageHours = (Date.now() - data.createdAtMs) / 3600000;
    return ageHours < ttlHours ? data.result : null;
  } catch (e) {
    console.warn(`Cache read failed for ${collectionName}, calling the model`, e);
    return null;
  }
}

export async function writeCache(
  collectionName: string,
  cacheKey: string,
  result: string
): Promise<void> {
  const id = cacheKeyHash(cacheKey);
  const payload = { result, createdAtMs: Date.now(), prompt: cacheKey };

  try {
    if (adminDb) {
      await withTimeout(adminDb.collection(collectionName).doc(id).set(payload));
      return;
    }

    if (!isFirebaseConfigured) return;

    await withTimeout(setDoc(doc(db, collectionName, id), payload));
  } catch (e) {
    console.warn(`Cache write failed for ${collectionName}, continuing`, e);
  }
}

import {
  collection,
  query as clientQuery,
  where as clientWhere,
  getDocs as clientGetDocs,
  addDoc as clientAddDoc,
  doc as clientDoc,
  updateDoc as clientUpdateDoc,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { adminDb } from "./firebaseAdmin";

/**
 * Thin Firestore facade for API routes.
 *
 * Server code should talk to Firestore as a service account, not as an anonymous
 * browser. The Admin SDK does that and bypasses security rules, which is what
 * lets `firestore.rules` stay locked down while server-only collections still
 * work. When no service account is configured we fall back to the client SDK so
 * the app keeps running — writes to server-only collections will simply be
 * refused by the rules, exactly as they were before.
 *
 * The two SDKs have different shapes, so this exposes only the handful of
 * operations the routes actually need.
 */

export const usingAdmin = adminDb !== null;

export type DocRecord = Record<string, unknown> & { id: string };

const TIMEOUT_MS = 8000;

const withTimeout = <T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore request timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
};

/** Fetch documents, optionally filtered by a single equality condition. */
export async function findWhere(
  collectionName: string,
  field?: string,
  value?: unknown
): Promise<DocRecord[]> {
  if (adminDb) {
    const base = adminDb.collection(collectionName);
    const q = field ? base.where(field, "==", value) : base;
    const snap = await withTimeout(q.get());
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DocRecord);
  }

  if (!isFirebaseConfigured) return [];

  const base = collection(db, collectionName);
  const q = field ? clientQuery(base, clientWhere(field, "==", value)) : clientQuery(base);
  const snap = await withTimeout(clientGetDocs(q));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DocRecord);
}

/** Create a document and return its id. */
export async function insert(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  if (adminDb) {
    const ref = await withTimeout(adminDb.collection(collectionName).add(data));
    return ref.id;
  }

  if (!isFirebaseConfigured) {
    throw new Error("Firestore is not configured");
  }

  const ref = await withTimeout(clientAddDoc(collection(db, collectionName), data));
  return ref.id;
}

/** Merge fields into an existing document. */
export async function update(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  if (adminDb) {
    await withTimeout(adminDb.collection(collectionName).doc(id).set(data, { merge: true }));
    return;
  }

  if (!isFirebaseConfigured) {
    throw new Error("Firestore is not configured");
  }

  await withTimeout(clientUpdateDoc(clientDoc(db, collectionName, id), data));
}

/** Wall-clock timestamp that reads back the same through either SDK. */
export const nowMs = () => Date.now();

export { Timestamp };

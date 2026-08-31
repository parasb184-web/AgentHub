import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-side Firestore access.
 *
 * API routes previously used the *client* SDK, which talks to Firestore as an
 * unauthenticated visitor. Security rules cannot tell that traffic apart from a
 * random browser, so any collection written only by the server had to be either
 * world-writable or denied. The Admin SDK authenticates as a service account and
 * bypasses rules entirely, which is the correct boundary for trusted server code.
 *
 * Credentials come from FIREBASE_SERVICE_ACCOUNT: the full service-account JSON,
 * as a single-line string. Without it, `adminDb` stays null and callers fall back
 * to the client SDK, so the app still runs (just without server-only persistence).
 */

const ADMIN_APP_NAME = "agenthub-admin";

const parseServiceAccount = (): Record<string, string> | null => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      console.warn("FIREBASE_SERVICE_ACCOUNT is missing project_id, client_email or private_key");
      return null;
    }
    // Escaped newlines survive .env round-tripping; the SDK needs real ones.
    parsed.private_key = String(parsed.private_key).replace(/\\n/g, "\n");
    return parsed;
  } catch (e) {
    console.warn("FIREBASE_SERVICE_ACCOUNT is not valid JSON", e);
    return null;
  }
};

let adminDb: Firestore | null = null;

const serviceAccount = parseServiceAccount();

if (serviceAccount) {
  try {
    const existing: App | undefined = getApps().find((a) => a.name === ADMIN_APP_NAME);
    const app =
      existing ??
      initializeApp(
        {
          credential: cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key,
          }),
          projectId: serviceAccount.project_id,
        },
        ADMIN_APP_NAME
      );

    adminDb = getFirestore(app);
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch (e) {
    console.warn("Firebase Admin init failed, falling back to the client SDK", e);
    adminDb = null;
  }
}

/** True when server routes can read and write Firestore without rule restrictions. */
export const isAdminConfigured = adminDb !== null;

export { adminDb };

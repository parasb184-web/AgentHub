import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";

/**
 * True only when real credentials are present. `getAuth()` succeeds locally even
 * with a placeholder key and fails later on its first network call, so guarding
 * on the config up front is the only way to keep Auth from throwing.
 */
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock_key_for_build",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:mock",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: ReturnType<typeof getAuth> | any = null;
if (isFirebaseConfigured) {
  try {
    auth = getAuth(app);
  } catch (e) {
    console.warn("Firebase auth not configured properly:", e);
  }
} else if (typeof window !== "undefined") {
  console.info(
    "[AgentHub] Firebase credentials not set - running in demo mode. " +
      "Sign-in is disabled; the catalog is served from local data. " +
      "Add NEXT_PUBLIC_FIREBASE_* to .env.local to enable auth."
  );
}

const db = (() => {
  if (typeof window === "undefined") {
    return getFirestore(app);
  }

  try {
    return initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
})();
const githubProvider = new GithubAuthProvider();

export { app, auth, db, githubProvider };

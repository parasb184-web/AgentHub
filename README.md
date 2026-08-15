# Agent Hub

Agent Hub is a Next.js 16 marketplace for discovering, comparing, and testing AI agents. The app uses Firebase for auth and Firestore-backed data, plus Upstash services for vector search and rate limiting.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your project values.

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Environment variables

Use the following variables locally and in Firebase App Hosting:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
ANTHROPIC_API_KEY=your-anthropic-api-key
UPSTASH_VECTOR_REST_URL=https://your-vector-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-upstash-vector-token
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

`NEXT_PUBLIC_*` values are safe for the browser. Keep `ANTHROPIC_API_KEY` and the Upstash tokens in Firebase Secret Manager.

## Firebase App Hosting

This repo now includes [apphosting.yaml](./apphosting.yaml) for Firebase App Hosting.

Recommended setup:

1. Create or open a Firebase project on the Blaze plan.
2. In the Firebase console, open App Hosting and create a backend.
3. Connect the GitHub repo `yathboss/hackind` and deploy the `main` branch from the repo root.
4. In the backend's Environment settings, add the plain-text values from `.env.local` or `.env.example`:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `UPSTASH_VECTOR_REST_URL`, and `UPSTASH_REDIS_REST_URL`.
5. Create these secrets in Secret Manager so they match `apphosting.yaml`:
   `anthropic-api-key`, `upstash-vector-rest-token`, and `upstash-redis-rest-token`.
6. Roll out the backend.

If you want CLI-based local source deployments later, install `firebase-tools` 14.4.0 or newer, run `firebase init apphosting`, and then deploy with `firebase deploy`.

## Build check

```bash
npm run build
```

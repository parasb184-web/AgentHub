import { db } from "../src/lib/firebase";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";

const seedAgents = [
  { name: "PR Review Agent", repoType: "Next.js app", action: "started using" },
  { name: "Bug Triager", repoType: "Python ML project", action: "integrated" },
  { name: "Test Writer", repoType: "React component library", action: "started using" },
  { name: "Changelog Generator", repoType: "Node.js API", action: "deployed" },
];

const repos = [
  "https://github.com/vercel/next.js",
  "https://github.com/facebook/react",
  "https://github.com/microsoft/vscode",
];

async function seedActivity() {
  const now = Date.now();
  await Promise.all(
    Array.from({ length: 40 }).map((_, index) =>
      addDoc(collection(db, "activity_feed"), {
        agentName: seedAgents[index % seedAgents.length].name,
        repoType: seedAgents[index % seedAgents.length].repoType,
        eventType: seedAgents[index % seedAgents.length].action,
        timestamp: Timestamp.fromDate(new Date(now - index * 9 * 60 * 1000)),
        isSeeded: true,
      })
    )
  );
}

async function seedStacks() {
  await Promise.all(
    repos.map(async (repoUrl) => {
      const url = new URL(repoUrl);
      const ownerRepo = url.pathname.replace(/^\/+/, "");
      const key = ownerRepo.replace("/", "__");
      await setDoc(doc(db, "repo_stacks", key), {
        repoUrl,
        ownerRepo,
        agents: [],
        generatedAt: Timestamp.now(),
        viewCount: 0,
      }, { merge: true });
    })
  );
}

async function main() {
  console.log("Pre-warming AgentHub demo data...");
  await seedActivity();
  await seedStacks();
  console.log("Done. Repo scan and search cache warming should be run against a live dev server for full coverage.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

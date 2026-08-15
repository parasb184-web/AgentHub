import Link from "next/link";
import { collection, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { StackPageCard } from "@/components/StackPageCard";
import { Agent } from "@/lib/types";

interface StackDoc {
  ownerRepo: string;
  agents: Agent[];
  generatedAt?: { toDate?: () => Date };
  viewCount?: number;
}

const getStack = async (ownerRepo: string) => {
  const snapshot = await getDocs(
    query(collection(db, "repo_stacks"), where("ownerRepo", "==", ownerRepo))
  );

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data() as StackDoc;

  await updateDoc(doc.ref, { viewCount: increment(1) });

  return { id: doc.id, ...data };
};

export async function generateMetadata({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = await params;

  return {
    title: `${owner}/${repo} Agent Stack — AgentHub`,
    openGraph: {
      images: [`/api/og?owner=${owner}&repo=${repo}`],
    },
  };
}

export default async function StackPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = await params;
  const ownerRepo = `${owner}/${repo}`;
  const stack = await getStack(ownerRepo);

  if (!stack) {
    return (
      <div className="container mx-auto min-h-[70vh] px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top,rgba(231,76,60,0.18),transparent_55%),#fafafa] p-10 text-center">
          <h1 className="text-4xl font-black tracking-tight text-[#1a1a2e]">{ownerRepo}</h1>
          <p className="mt-4 text-lg text-[#64748b]">No public repository analysis has been generated yet.</p>
          <Link href="/scan" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e74c3c] px-6 py-3 font-semibold text-white hover:bg-[#f05a48]">
            Run repository scan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const generatedAt = stack.generatedAt?.toDate ? stack.generatedAt.toDate() : new Date();

  return (
    <div className="container mx-auto px-6 py-20">
      <header className="mb-12 text-center">
        <p className="font-mono text-5xl font-black text-[#1a1a2e]">{ownerRepo}</p>
        <p className="mt-4 text-lg text-[#64748b]">Repository analysis powered by AgentHub</p>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#ff8c7e]/70">
          Generated {generatedAt.toLocaleDateString()}
        </p>
        <Link href="/scan" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#e74c3c]/25 bg-[#e74c3c]/10 px-5 py-3 text-sm font-semibold text-[#e74c3c] hover:bg-[#e74c3c]/16">
          Analyze another repository
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stack.agents.map((agent) => (
          <StackPageCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

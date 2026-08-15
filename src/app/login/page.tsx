"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, ArrowRight, Github, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified access",
    description: "Authenticate once and manage secure API keys for sandbox testing and production usage.",
  },
  {
    icon: Workflow,
    title: "Instant integration",
    description: "Move from live validation to production-ready SDK snippets without leaving the marketplace.",
  },
  {
    icon: Sparkles,
    title: "Agent discovery",
    description: "Evaluate trusted agents, compare capabilities, and route the right tool into your workflow.",
  },
];

function LoginPageContent() {
  const { user, loading, signInWithGitHub } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, redirectTo, router, user]);

  const handleSignIn = async () => {
    await signInWithGitHub();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(231,76,60,0.22),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(192,57,43,0.14),transparent_22%),radial-gradient(circle_at_60%_70%,rgba(231,76,60,0.1),transparent_32%)]" />
      <div className="absolute inset-0 hero-grid opacity-[0.04]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e74c3c]/25 bg-[#e74c3c]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#ff8c7e]">
              <Activity className="h-3.5 w-3.5" />
              Access
            </div>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-[#1a1a2e] md:text-7xl">
              Sign in to manage
              <span className="block bg-gradient-to-r from-[#1a1a2e] via-[#ffb0a5] to-[#e74c3c] bg-clip-text text-transparent">
                agents and API access
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748b] md:text-xl">
              Sign in to create API keys, test agents in the sandbox, publish your own services, and manage marketplace usage from one place.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-black/10 bg-black/[0.02] p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-[#e74c3c]/25"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-[#e74c3c]/25 bg-[#e74c3c]/10 p-3 text-[#ff8c7e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-[#1a1a2e]">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,252,0.96))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,76,60,0.2),transparent_30%)]" />
              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e74c3c] shadow-[0_0_40px_rgba(231,76,60,0.38)]">
                  <Github className="h-7 w-7 text-white" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#1a1a2e]">Continue with GitHub</h2>
                <p className="mt-3 text-sm leading-7 text-[#64748b]">
                  GitHub identity is used to provision developer access, connect published agents to creators, and secure API key issuance.
                </p>

                <Button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="mt-8 h-12 w-full rounded-xl bg-[#e74c3c] text-base font-semibold text-white hover:bg-[#ff5645]"
                >
                  <Github className="mr-2 h-5 w-5" />
                  {loading ? "Checking session..." : "Continue with GitHub"}
                </Button>

                <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-6 text-sm text-[#64748b]">
                  <span>Developer access only</span>
                  <Link href="/" className="inline-flex items-center gap-2 text-[#ff8c7e] transition-colors hover:text-[#e74c3c]">
                    Return home
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]" />}>
      <LoginPageContent />
    </Suspense>
  );
}

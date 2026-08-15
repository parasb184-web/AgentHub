import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Github,
  House,
  Key,
  LayoutGrid,
  Merge,
  Rocket,
  Search,
  Shield,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

export type FeatureNavStatus = "live" | "new" | "soon";

export type FeatureNavItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  status: FeatureNavStatus;
  topNav?: boolean;
};

export const featureNavItems: FeatureNavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Overview of discovery, validation, and publishing.",
    icon: House,
    status: "live",
  },
  {
    title: "Marketplace",
    href: "/agents",
    description: "Browse agents by capability, trust, language, and price.",
    icon: LayoutGrid,
    status: "live",
    topNav: true,
  },
  {
    title: "Platform",
    href: "/platform",
    description: "Run sandbox tests, inspect schemas, and generate SDKs.",
    icon: Shield,
    status: "new",
    topNav: true,
  },
  {
    title: "Trending",
    href: "/signal",
    description: "Track repositories, market coverage, and marketplace activity.",
    icon: Activity,
    status: "new",
    topNav: true,
  },
  {
    title: "Repo Scan",
    href: "/scan",
    description: "Analyze a GitHub repository and identify agent opportunities.",
    icon: Github,
    status: "live",
    topNav: true,
  },
  {
    title: "Workflows",
    href: "/chains",
    description: "Compose saved workflows across multiple agents.",
    icon: Merge,
    status: "live",
    topNav: true,
  },
  {
    title: "Publish",
    href: "/publish",
    description: "List an agent with schemas, pricing, and sample payloads.",
    icon: Rocket,
    status: "live",
  },
  {
    title: "Creator",
    href: "/dashboard",
    description: "Manage API keys, usage, earnings, and published agents.",
    icon: Key,
    status: "live",
  },
  {
    title: "Launchpad",
    href: "/launchpad",
    description: "Preview upcoming workflow and creator tooling.",
    icon: Sparkles,
    status: "soon",
  },
];

export const topFeatureNavItems = featureNavItems.filter((item) => item.topNav);

export type PortalCard = {
  title: string;
  href: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
  accentClass: string;
};

export const homePortalCards: PortalCard[] = [
  {
    title: "Platform",
    href: "/platform",
    eyebrow: "Validation",
    description:
      "Test agents, inspect structured inputs and outputs, and generate integration-ready SDK snippets.",
    icon: TerminalSquare,
    bullets: ["Sandbox execution", "Schema inspection", "Generated SDKs"],
    accentClass:
      "from-[#e74c3c]/16 via-[#141418]/82 to-[#080808]",
  },
  {
    title: "Trending",
    href: "/signal",
    eyebrow: "Market Intelligence",
    description:
      "Follow trending repositories, AI news coverage, and recent marketplace activity from one route.",
    icon: Activity,
    bullets: ["Trending repositories", "Recent coverage", "Marketplace activity"],
    accentClass:
      "from-white/[0.08] via-[#141418]/82 to-[#080808]",
  },
  {
    title: "Launchpad",
    href: "/launchpad",
    eyebrow: "Builder Preview",
    description:
      "Review creator tooling, workflow previews, and the next layer of publishing infrastructure.",
    icon: Sparkles,
    bullets: ["Creator workflow", "Revenue tools", "Workflow previews"],
    accentClass:
      "from-[#ff8c7e]/14 via-[#141418]/82 to-[#080808]",
  },
];

export const homeQuickActions = [
  {
    title: "Marketplace",
    href: "/agents",
    description: "Browse production-ready agents.",
    icon: LayoutGrid,
  },
  {
    title: "Repo Scan",
    href: "/scan",
    description: "Analyze a GitHub repository.",
    icon: Search,
  },
  {
    title: "Workflows",
    href: "/chains",
    description: "Build multi-agent workflows.",
    icon: Merge,
  },
  {
    title: "Publish",
    href: "/publish",
    description: "List an agent on AgentHub.",
    icon: Rocket,
  },
];

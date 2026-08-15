import { NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoMeta, fetchLanguages, fetchOpenIssues, fetchRecentCommits, fetchReadme } from "@/lib/githubClient";
import { geminiAnalyze } from "@/lib/geminiClient";
import { MOCK_AGENTS } from "@/lib/dummyData";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import crypto from "crypto";

interface GitHubIssueLabel {
  name: string;
}

interface GitHubIssue {
  labels: GitHubIssueLabel[];
  title: string;
}

interface GitHubCommit {
  commit: {
    message: string;
  };
}

interface ClaudePainPoint {
  painPoint: string;
  agentCategory: string;
  specificReason: string;
  estimatedTimeSaved: string;
}

const SCAN_CACHE_VERSION = "v2-ml-aware";

const buildFallbackPainPoints = ({
  description,
  primaryLanguage,
  issueLabels,
  openIssueCount,
  commitMessages,
  readmeExcerpt,
}: {
  description: string;
  primaryLanguage: string;
  issueLabels: string[];
  openIssueCount: number;
  commitMessages: string[];
  readmeExcerpt: string;
}): ClaudePainPoint[] => {
  const repoContext = `${description} ${readmeExcerpt} ${commitMessages.join(" ")}`.toLowerCase();
  const isMlClassifierRepo = /(spam|classifier|classification|naive bayes|dataset|prediction|train|model|nlp|inference)/.test(repoContext);
  const isPythonRepo = primaryLanguage.toLowerCase().includes("python");
  const normalizedLanguage = primaryLanguage || "application";
  const labelSummary = issueLabels.length > 0 ? issueLabels.slice(0, 4).join(", ") : "general maintenance";
  const commitSummary = commitMessages.length > 0 ? commitMessages.slice(0, 3).join("; ") : "ongoing repository updates";
  const readmeSignal = readmeExcerpt
    ? `README references ${readmeExcerpt.slice(0, 120).replace(/\s+/g, " ")}`
    : "README context was limited";

  if (isMlClassifierRepo) {
    return [
      {
        painPoint: "The model needs a tighter evaluation loop to catch false positives, false negatives, and data drift before spam classification quality degrades.",
        agentCategory: "classification",
        specificReason: `${readmeSignal}, and commit history like "${commitSummary}" points to an ML classification workflow where continuous evaluation should be automated.`,
        estimatedTimeSaved: "5 hours per week",
      },
      {
        painPoint: "Preprocessing and inference logic should be covered by regression tests so feature or training changes do not quietly break predictions.",
        agentCategory: "test-writing",
        specificReason: `This ${normalizedLanguage} repo appears to include training and prediction paths, which makes dataset-aware edge-case tests valuable for spam filtering behavior.`,
        estimatedTimeSaved: "4 hours per week",
      },
      {
        painPoint: "Issue triage around misclassified messages and noisy datasets can become difficult without structured labeling and prioritization.",
        agentCategory: "bug-triage",
        specificReason: `${openIssueCount} open issues and labels such as ${labelSummary} suggest a strong need for automated clustering of model-quality problems.`,
        estimatedTimeSaved: "3 hours per week",
      },
      {
        painPoint: "Repository updates can create knowledge gaps when experiments, training assumptions, and model improvements are not summarized for collaborators.",
        agentCategory: "summarization",
        specificReason: `${readmeSignal}, and a commit stream like "${commitSummary}" benefits from concise technical summaries for demos and handoffs.`,
        estimatedTimeSaved: "2 hours per week",
      },
      {
        painPoint: "Progress updates are harder to communicate when release notes and experiment deltas must be assembled manually from commits.",
        agentCategory: "changelog-generation",
        specificReason: `Frequent updates in this ${isPythonRepo ? "Python ML" : normalizedLanguage} project make automatic changelog generation useful for showcasing iteration speed.`,
        estimatedTimeSaved: "2 hours per week",
      },
    ];
  }

  return [
    {
      painPoint: "Pull request review volume can slow down delivery when maintainers are reviewing repetitive change patterns by hand.",
      agentCategory: "code-review",
      specificReason: `${openIssueCount} open issues and recent commits such as "${commitSummary}" suggest active iteration in this ${normalizedLanguage} codebase.`,
      estimatedTimeSaved: "4 hours per week",
    },
    {
      painPoint: "Repository updates are likely creating knowledge gaps across contributors and stakeholders.",
      agentCategory: "summarization",
      specificReason: `${readmeSignal}, and active issue labels such as ${labelSummary} indicate a need for automated status summaries.`,
      estimatedTimeSaved: "3 hours per week",
    },
    {
      painPoint: "Manual test coverage often lags behind new changes, especially in fast-moving repos.",
      agentCategory: "test-writing",
      specificReason: `Commit activity in a ${normalizedLanguage} project suggests repeated implementation cycles where auto-generated tests would reduce regression risk.`,
      estimatedTimeSaved: "5 hours per week",
    },
    {
      painPoint: "Issue triage can become noisy when maintainers need to sort bugs, enhancements, and duplicates manually.",
      agentCategory: "bug-triage",
      specificReason: `${openIssueCount} open issues with labels including ${labelSummary} make automated classification and prioritization valuable.`,
      estimatedTimeSaved: "2 hours per week",
    },
    {
      painPoint: "Releases and handoffs become slower when changelogs are assembled from commits and merged work manually.",
      agentCategory: "changelog-generation",
      specificReason: `Recent commit history such as "${commitSummary}" is a strong signal for automatic release-note generation.`,
      estimatedTimeSaved: "2 hours per week",
    },
  ];
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  "code-review": ["code-review", "testing", "security", "automation"],
  "summarization": ["summarization", "productivity", "content-creation", "education"],
  "test-writing": ["test-writing", "testing", "code-review", "automation"],
  "bug-triage": ["bug-triage", "classification", "automation", "analytics"],
  "changelog-generation": ["changelog-generation", "summarization", "productivity"],
  "data-extraction": ["data-extraction", "classification", "analytics", "automation"],
  "classification": ["classification", "analytics", "python", "automation"],
};

const rankAgentForPainPoint = (
  agent: typeof MOCK_AGENTS[number],
  painPoint: ClaudePainPoint,
  languageHints: string[]
) => {
  const aliases = CATEGORY_ALIASES[painPoint.agentCategory] || [painPoint.agentCategory];
  const searchable = `${agent.name} ${agent.description} ${agent.capabilityTags.join(" ")} ${agent.supportedLanguages.join(" ")}`.toLowerCase();
  let score = 0;

  aliases.forEach((alias, index) => {
    if (agent.capabilityTags.some((tag) => tag.toLowerCase() === alias.toLowerCase())) {
      score += index === 0 ? 14 : 8;
    } else if (searchable.includes(alias.toLowerCase())) {
      score += 4;
    }
  });

  languageHints.forEach((language) => {
    if (agent.supportedLanguages.some((supported) => supported.toLowerCase() === language.toLowerCase())) {
      score += 3;
    }
  });

  if (painPoint.agentCategory === "classification" && /model|classification|false positive|false negative|dataset/.test(searchable)) {
    score += 8;
  }

  if (painPoint.agentCategory === "test-writing" && /test|regression|edge case/.test(searchable)) {
    score += 6;
  }

  return score + (agent.trustScore || 0) / 100;
};

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });

    const { owner, repo } = parseRepoUrl(repoUrl);
    if (!owner || !repo) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

    const normalizedRepoUrl = `https://github.com/${owner}/${repo}`;
    const hash = crypto.createHash("md5").update(`${SCAN_CACHE_VERSION}:${normalizedRepoUrl}`).digest("hex");
    const scanRef = doc(db, "repo_scans", hash);

    try {
      const cached = await getDoc(scanRef);
      if (cached.exists()) {
        const data = cached.data();
        const ageHours = (Date.now() - (data.createdAt as Timestamp).toMillis()) / 3600000;
        if (ageHours < 24) return NextResponse.json(data.result);
      }
    } catch (e) {
      console.warn("Scan cache read error", e);
    }

    const [meta, langs, issues, commits, readme] = await Promise.all([
      fetchRepoMeta(owner, repo),
      fetchLanguages(owner, repo),
      fetchOpenIssues(owner, repo),
      fetchRecentCommits(owner, repo),
      fetchReadme(owner, repo)
    ]);

    const typedIssues = issues as GitHubIssue[];
    const typedCommits = commits as GitHubCommit[];
    const issueList = typedIssues.map((issue) => `[${issue.labels.map((label) => label.name).join(",")}] ${issue.title}`).join("; ");
    const commitMessages = typedCommits.map((commit) => commit.commit.message.split("\n")[0]);
    const commitMsgs = commitMessages.join("; ");
    const readmeExcerpt = readme.substring(0, 1000);
    const issueLabels = [...new Set(typedIssues.flatMap((issue) => issue.labels.map((label) => label.name)).filter(Boolean))];

    const prompt = `You are an expert AI automation consultant analyzing a software project.
Here is the repository data:
- Name: ${meta.full_name}
- Description: ${meta.description}  
- Languages: ${Object.keys(langs).join(", ")}
- Open Issues (${meta.open_issues_count} total): ${issueList}
- Recent commits: ${commitMsgs}
- README summary: ${readmeExcerpt}
- Contributors: 0
- Stars: ${meta.stargazers_count}

Analyze this repository and identify the top 5 automation pain points.
For each pain point, provide:
1. painPoint: one sentence describing the specific problem
2. agentCategory: which type of agent would help (match to one of: code-review, summarization, test-writing, bug-triage, changelog-generation, data-extraction, classification)
3. specificReason: reference specific data from the repo (mention actual issue labels, commit patterns, or file types)
4. estimatedTimeSaved: e.g. '3 hours per week'

Return ONLY a valid JSON array of 5 objects with these exact keys.`;

    let painPoints: ClaudePainPoint[] = [];
    try {
      const geminiResp = await geminiAnalyze(prompt, `repo-${hash}`);
      const jsonStr = geminiResp.substring(geminiResp.indexOf("["), geminiResp.lastIndexOf("]") + 1);
      painPoints = JSON.parse(jsonStr) as ClaudePainPoint[];
    } catch (e) {
      console.warn("Gemini analysis unavailable, using local fallback scan", e);
      painPoints = buildFallbackPainPoints({
        description: meta.description || "",
        primaryLanguage: meta.language || Object.keys(langs)[0] || "application",
        issueLabels,
        openIssueCount: meta.open_issues_count || 0,
        commitMessages,
        readmeExcerpt,
      });
    }

    const matchedAgents: Record<string, unknown>[] = [];
    const agentCols = collection(db, "agents");
    const languageHints = [meta.language, ...Object.keys(langs)].filter(Boolean) as string[];

    for (const point of painPoints) {
      const q = query(agentCols, where("capabilityTags", "array-contains", point.agentCategory));
      try {
        const snaps = await getDocs(q);
        const agentsForCat = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        if (agentsForCat.length > 0) {
          matchedAgents.push(agentsForCat[0]); // match at least one
          continue;
        }
      } catch { /* ignores */ }

      const rankedFallbackAgents = [...MOCK_AGENTS]
        .map((agent) => ({
          agent,
          score: rankAgentForPainPoint(agent, point, languageHints),
        }))
        .filter((entry) => entry.score > 6)
        .sort((a, b) => b.score - a.score);

      if (rankedFallbackAgents.length > 0) {
        matchedAgents.push(rankedFallbackAgents[0].agent as unknown as Record<string, unknown>);
      }
    }

    const ownerRepo = `${owner}/${repo}`;
    const finalResult = {
      ownerRepo,
      repoUrl: normalizedRepoUrl,
      repoMeta: {
        stars: meta.stargazers_count || 0,
        contributors: 0,
        openIssues: meta.open_issues_count || 0,
        primaryLanguage: meta.language,
        owner,
        repo,
      },
      painPoints,
      matchedAgents
    };

    try {
      await setDoc(scanRef, {
        repoUrl: normalizedRepoUrl,
        ownerRepo,
        result: finalResult,
        agentMatches: matchedAgents,
        cacheVersion: SCAN_CACHE_VERSION,
        createdAt: Timestamp.now()
      });
      await setDoc(doc(db, "repo_stacks", hash), {
        repoUrl: normalizedRepoUrl,
        ownerRepo,
        agents: matchedAgents,
        generatedAt: Timestamp.now(),
        viewCount: 0,
      }, { merge: true });
    } catch { }

    return NextResponse.json(finalResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to scan repository";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

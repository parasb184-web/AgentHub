const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const headers: Record<string, string> = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

export function parseRepoUrl(url: string) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return { owner: null, repo: null };
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export async function fetchRepoMeta(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch repo meta");
  return res.json();
}

export async function fetchLanguages(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
  if (!res.ok) return {};
  return res.json();
}

export async function fetchOpenIssues(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=30`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchRecentCommits(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=15`, { headers });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchReadme(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
  if (!res.ok) return "";
  const data = await res.json();
  if (data.content && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  return "";
}

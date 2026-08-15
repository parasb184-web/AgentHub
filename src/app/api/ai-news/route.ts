import { NextResponse } from "next/server";
import { AINewsFeedItem, AINewsResponse, FALLBACK_AI_NEWS } from "@/lib/homepageFeed";

const NEWS_URL =
  "https://news.google.com/rss/search?q=%22artificial+intelligence%22+OR+%22AI+agents%22+when%3A7d&hl=en-US&gl=US&ceid=US%3Aen";

const decodeEntities = (value: string) =>
  value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const getTagValue = (item: string, tag: string) => {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1] ? decodeEntities(match[1]) : "";
};

const parseFeed = (xml: string): AINewsFeedItem[] => {
  const matches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  return matches.slice(0, 8).map((entry, index) => {
    const title = getTagValue(entry, "title").replace(/\s+-\s+[^-]+$/, "");
    const link = getTagValue(entry, "link");
    const publishedAt = getTagValue(entry, "pubDate");
    const source = getTagValue(entry, "source") || "Google News";

    return {
      id: `${index}-${link || title}`,
      title: title || "Latest AI update",
      url: link || "https://news.google.com/",
      source,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    };
  });
};

export async function GET() {
  try {
    const response = await fetch(NEWS_URL, {
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      throw new Error(`News request failed with ${response.status}`);
    }

    const xml = await response.text();
    const items = parseFeed(xml);

    return NextResponse.json<AINewsResponse>({
      items: items.length > 0 ? items : FALLBACK_AI_NEWS,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json<AINewsResponse>({
      items: FALLBACK_AI_NEWS,
      fetchedAt: new Date().toISOString(),
    });
  }
}

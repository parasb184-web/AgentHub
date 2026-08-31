/**
 * Local sentence embeddings via @xenova/transformers.
 *
 * The package is ~117MB on disk and downloads model weights on first use, which
 * is far too heavy to sit in every serverless bundle - especially since it is
 * only reachable through the Upstash vector path. It is therefore imported
 * dynamically, so a deployment without Upstash never loads it at all.
 */

type Embedder = (text: string, opts: Record<string, unknown>) => Promise<{ data: ArrayLike<number> }>;

let embedder: Embedder | null = null;
let loading: Promise<Embedder> | null = null;

const loadEmbedder = async (): Promise<Embedder> => {
  const { pipeline } = await import("@xenova/transformers");
  return (await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")) as unknown as Embedder;
};

export async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    // Share one in-flight load between concurrent callers.
    loading = loading ?? loadEmbedder();
    embedder = await loading;
  }

  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

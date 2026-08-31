import { NextResponse } from "next/server";
import crypto from "crypto";
import { findWhere, insert, update } from "@/lib/serverDb";

export async function GET(req: Request) {
  const uid = req.headers.get("x-user-id");
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const keys = await findWhere("api_keys", "userId", uid);
    return NextResponse.json(keys);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to list API keys";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const uid = req.headers.get("x-user-id");
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { label } = await req.json();
    const rawKey = "ah_" + crypto.randomBytes(24).toString("hex");
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.substring(0, 8);

    const newKey = {
      userId: uid,
      keyHash,
      keyPrefix,
      label: label || "Default Key",
      lastUsedAt: null,
      createdAtMs: Date.now(),
      isActive: true,
    };

    const id = await insert("api_keys", newKey);

    // rawKey is returned exactly once - only its hash is stored.
    return NextResponse.json({ id, ...newKey, rawKey });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Revoke
export async function PUT(req: Request) {
  const uid = req.headers.get("x-user-id");
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { keyId } = await req.json();
    if (!keyId) {
      return NextResponse.json({ error: "keyId is required" }, { status: 400 });
    }

    // Only let a caller revoke a key they own.
    const owned = await findWhere("api_keys", "userId", uid);
    if (!owned.some((k) => k.id === keyId)) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await update("api_keys", keyId, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to revoke API key";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

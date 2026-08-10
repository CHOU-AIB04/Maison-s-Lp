import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_PREFIX = "order-status";
const VALID = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof VALID)[number];

function authOk(req: NextRequest) {
  const k = req.nextUrl.searchParams.get("k");
  return process.env.ORDERS_KEY && k === process.env.ORDERS_KEY;
}

/** Carte { orderId: statut } stockée dans un blob dédié (overlay, ne touche pas les commandes). */
async function getStatusMap(token?: string): Promise<Record<string, Status>> {
  try {
    const { blobs } = await list({ prefix: STATUS_PREFIX, token, limit: 100 });
    if (!blobs.length) return {};
    const latest = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    const r = await fetch(latest.url, { cache: "no-store" });
    return r.ok ? await r.json() : {};
  } catch {
    return {};
  }
}

async function saveStatusMap(map: Record<string, Status>, token?: string) {
  const created = await put(`${STATUS_PREFIX}.json`, JSON.stringify(map), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    token,
  });
  // purge les anciennes versions
  try {
    const { blobs } = await list({ prefix: STATUS_PREFIX, token, limit: 100 });
    const { del } = await import("@vercel/blob");
    const old = blobs.filter((b) => b.url !== created.url).map((b) => b.url);
    if (old.length) await del(old, { token });
  } catch {
    /* sans conséquence */
  }
}

export async function GET(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const [{ blobs }, statusMap] = await Promise.all([
    list({ prefix: "orders/", token, limit: 1000 }),
    getStatusMap(token),
  ]);

  const raw = await Promise.all(
    blobs.map(async (b) => {
      try {
        const r = await fetch(b.url, { cache: "no-store" });
        const o = await r.json();
        const id = o.orderNum || b.pathname;
        return { ...o, id, status: statusMap[id] || "new" };
      } catch {
        return null;
      }
    })
  );

  const orders = raw.filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ ok: true, count: orders.length, orders });
}

export async function PATCH(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const { id, status } = body;
  if (!id || !status || !VALID.includes(status as Status)) {
    return NextResponse.json({ ok: false, error: "bad_params" }, { status: 422 });
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const map = await getStatusMap(token);
  map[id] = status as Status;
  await saveStatusMap(map, token);
  return NextResponse.json({ ok: true, id, status });
}

import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const k = req.nextUrl.searchParams.get("k");
  if (!process.env.ORDERS_KEY || k !== process.env.ORDERS_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { blobs } = await list({ prefix: "orders/", token, limit: 1000 });

  const orders = await Promise.all(
    blobs.map(async (b) => {
      try {
        const r = await fetch(b.url, { cache: "no-store" });
        return await r.json();
      } catch {
        return null;
      }
    })
  );

  const clean = orders
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return NextResponse.json({ ok: true, count: clean.length, orders: clean });
}

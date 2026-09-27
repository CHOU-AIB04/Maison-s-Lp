import { NextRequest, NextResponse } from "next/server";
import { ordersStore, statusStore } from "@/lib/store";
import { sendCapiEvent } from "@/lib/capi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof VALID)[number];
const STATUS_KEY = "map";

function authOk(req: NextRequest) {
  const k = req.nextUrl.searchParams.get("k");
  return process.env.ORDERS_KEY && k === process.env.ORDERS_KEY;
}

async function getStatusMap(): Promise<Record<string, Status>> {
  try {
    return ((await statusStore().get(STATUS_KEY, { type: "json" })) as Record<string, Status>) || {};
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const store = ordersStore();
    const [{ blobs }, statusMap] = await Promise.all([store.list(), getStatusMap()]);

    const raw = await Promise.all(
      blobs.map(async (b) => {
        try {
          const o = (await store.get(b.key, { type: "json" })) as Record<string, unknown> | null;
          if (!o) return null;
          const id = String(o.orderNum || b.key);
          return { ...o, id, status: statusMap[id] || "new" };
        } catch {
          return null;
        }
      })
    );

    const orders = raw
      .filter(Boolean)
      .sort((a, b) => (String((a as { date?: string }).date) < String((b as { date?: string }).date) ? 1 : -1));
    return NextResponse.json({ ok: true, count: orders.length, orders });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "blob_error", message: e instanceof Error ? e.message : String(e), orders: [], count: 0 },
      { status: 200 }
    );
  }
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
  try {
    const map = await getStatusMap();
    const prev = map[id];
    map[id] = status as Status;
    await statusStore().setJSON(STATUS_KEY, map);

    // ── Livrée = la VRAIE vente (COD payé) → CAPI Purchase (une seule fois)
    if (status === "delivered" && prev !== "delivered") {
      try {
        const o = (await ordersStore().get(String(id), { type: "json" })) as Record<string, unknown> | null;
        if (o) {
          await sendCapiEvent("Purchase", {
            orderNum: `${id}-purchase`,
            phone: String(o.phone || ""),
            name: String(o.name || ""),
            value: Number(o.total) || 0,
            numItems: Number(o.qty) || 1,
            fbc: o.fbc ? String(o.fbc) : undefined,
            fbp: o.fbp ? String(o.fbp) : undefined,
          });
        }
      } catch (e) {
        console.error("CAPI Purchase (delivered) failed:", e);
      }
    }
    return NextResponse.json({ ok: true, id, status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "blob_error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const id = body.id;
  if (!id) {
    return NextResponse.json({ ok: false, error: "bad_params" }, { status: 422 });
  }
  try {
    await ordersStore().delete(String(id));
    try {
      const map = await getStatusMap();
      if (map[id]) {
        delete map[id];
        await statusStore().setJSON(STATUS_KEY, map);
      }
    } catch {
      /* sans conséquence */
    }
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "blob_error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

type OrderPayload = {
  name?: string;
  phone?: string;
  city?: string;
  color?: string;
  qty?: number;
  price?: number;
  delivery?: number | null;
  subtotal?: number;
  discount?: number;
  total?: number;
  product?: string;
  model?: string;
  lang?: string;
};

export async function POST(req: NextRequest) {
  let body: OrderPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").replace(/\s+/g, "");
  const city = (body.city || "").trim();

  if (!name || !phone || !city) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }
  // tel marocain : 06/07 + 10 chiffres, ou +212
  const normalized = phone.replace(/^\+?212/, "0");
  if (!/^0[67]\d{8}$/.test(normalized)) {
    return NextResponse.json({ ok: false, error: "bad_phone" }, { status: 422 });
  }

  const row = {
    date: new Date().toISOString(),
    name,
    phone: normalized,
    city,
    color: body.color || "",
    qty: body.qty || 1,
    price: body.price || 0,
    delivery: body.delivery ?? 0,
    subtotal: body.subtotal || 0,
    discount: body.discount || 0,
    total: body.total || 0,
    product: body.product || "Ensemble Swan",
    model: body.model || "swan",
    lang: body.lang || "ar",
  };

  // Stockage principal : Vercel Blob (append-only, 1 fichier par commande)
  try {
    const key = `orders/${Date.now()}-${Math.floor(Math.random() * 1e6)}.json`;
    await put(key, JSON.stringify(row), {
      access: "public",
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
  } catch (e) {
    console.error("blob store failed", e);
    return NextResponse.json({ ok: false, error: "store_failed" }, { status: 500 });
  }

  // Optionnel : miroir vers un webhook Sheet si configuré
  const webhook = process.env.SHEET_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
    } catch (e) {
      // on ne bloque pas la commande si le sheet échoue
      console.error("sheet webhook failed", e);
    }
  } else {
    console.log("ORDER (no webhook set):", row);
  }

  return NextResponse.json({ ok: true });
}

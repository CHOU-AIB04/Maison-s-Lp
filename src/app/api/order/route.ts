import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { ordersStore } from "@/lib/store";
import { FORCELOG_CITIES } from "@/lib/cities";
import { buildOrderEmailHtml, type EmailItem } from "@/lib/order-email";
import { pushNtfy } from "@/lib/notify";

export const runtime = "nodejs";

const META_PIXEL_ID = process.env.META_PIXEL_ID || "36659330483710557";

/** Conversions API (serveur) — Purchase dédupliqué avec le pixel via event_id = orderNum. */
async function sendCapiPurchase(args: {
  orderNum: string;
  phone: string; // normalisé 06/07...
  name: string;
  value: number;
  numItems: number;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
}) {
  const token = process.env.CAPI_TOKEN;
  if (!token) return; // pas de token → CAPI désactivé (le pixel navigateur continue seul)
  const sha = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
  const phoneE164 = args.phone.replace(/\D/g, "").replace(/^0/, "212"); // 06.. -> 2126..
  const first = args.name.trim().split(/\s+/)[0] || "";
  const user_data: Record<string, unknown> = {
    ph: [sha(phoneE164)],
    ...(first ? { fn: [sha(first)] } : {}),
    ...(args.ip ? { client_ip_address: args.ip } : {}),
    ...(args.ua ? { client_user_agent: args.ua } : {}),
    ...(args.fbp ? { fbp: args.fbp } : {}),
    ...(args.fbc ? { fbc: args.fbc } : {}),
  };
  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: args.orderNum,
        action_source: "website",
        ...(args.sourceUrl ? { event_source_url: args.sourceUrl } : {}),
        user_data,
        custom_data: { value: args.value, currency: "MAD", num_items: args.numItems, content_type: "product" },
      },
    ],
  };
  try {
    await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("CAPI Purchase failed:", e);
  }
}

/* ─────────────────────────────────────────────
   Payload envoyé par la landing page
   ───────────────────────────────────────────── */
type OrderItem = {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderPayload = {
  name?: string;
  phone?: string;
  cityCode?: string;
  address?: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  product?: string;
  model?: string;
  variant?: string;
  qty?: number;
  lang?: string;
  source?: string;
  utmSource?: string;
  utmContent?: string;
  utm?: Record<string, string>;
  addonToOrderNum?: string;
};

const EMAIL_TO = (process.env.ORDER_EMAIL_TO || "chouaibalx@gmail.com,m.eladraouy@gmail.com")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

/* ─────────────────────────────────────────────
   1. Forcelog — création du colis
   ───────────────────────────────────────────── */
async function createForcelogParcel(args: {
  orderNum: string;
  name: string;
  phone: string;
  cityCode: string;
  address: string;
  total: number;
  items: OrderItem[];
}) {
  if (!process.env.FORCELOG_API_KEY) {
    console.warn("FORCELOG_API_KEY manquant — colis non créé");
    return { ok: false, skipped: true };
  }

  const comment = args.items
    .map((i) => `${i.name} (${i.variant}) x${i.quantity}`)
    .join(" | ");
  const productNature = args.items.map((i) => i.name).join(", ");

  const payload = {
    ORDER_NUM: args.orderNum.slice(0, 20),
    RECEIVER: args.name.slice(0, 50),
    PHONE: args.phone.slice(0, 14),
    CITY: args.cityCode.slice(0, 50),
    ADDRESS: args.address.slice(0, 100),
    COMMENT: comment.slice(0, 100),
    PRODUCT_NATURE: productNature.slice(0, 100),
    COD: args.total,
    CAN_OPEN: true,
    FRAGILE: false,
  };

  const res = await fetch("https://api.forcelog.ma/customer/Parcels/AddParcel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.FORCELOG_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const details = await res.text();
    console.error("Forcelog error:", res.status, details);
    return { ok: false, status: res.status, details };
  }

  return { ok: true, data: await res.json() };
}

/* ─────────────────────────────────────────────
   3. Resend — email de commande
   ───────────────────────────────────────────── */
async function sendOrderEmail(args: {
  orderNum: string;
  name: string;
  phone: string;
  address: string;
  cityName: string;
  items: EmailItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  source: string;
  utmSource: string;
  utmContent: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY manquant — email non envoyé");
    return;
  }

  const html = buildOrderEmailHtml({
    orderNum: args.orderNum,
    customerName: args.name,
    phone: args.phone,
    address: args.address,
    cityName: args.cityName,
    items: args.items,
    subtotal: args.subtotal,
    discount: args.discount,
    shipping: args.shipping,
    total: args.total,
    source: args.source,
    utmSource: args.utmSource,
    utmContent: args.utmContent,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || "Maison d'Or <commandes@maison-dor.store>",
      to: EMAIL_TO,
      subject: `🛒 Commande LP ${args.orderNum} — ${args.name} (${args.total} MAD)`,
      html,
    }),
  });

  if (!res.ok) console.error("Resend error:", await res.text());
}

/* ─────────────────────────────────────────────
   4. Vercel Blob — journal des commandes
   ───────────────────────────────────────────── */
async function logToBlob(row: Record<string, unknown>, addonToOrderNum?: string) {
  try {
    const store = ordersStore();
    // Upsell : on fusionne dans la commande parente (même orderNum) au lieu d'en créer une nouvelle.
    if (addonToOrderNum) {
      const parent = (await store.get(String(addonToOrderNum), { type: "json" })) as Record<string, unknown> | null;
      if (parent) {
        const pItems = Array.isArray(parent.items) ? (parent.items as unknown[]) : [];
        const rItems = Array.isArray(row.items) ? (row.items as unknown[]) : [];
        parent.items = [...pItems, ...rItems];
        parent.total = (Number(parent.total) || 0) + (Number(row.total) || 0);
        parent.subtotal = (Number(parent.subtotal) || 0) + (Number(row.subtotal) || 0);
        parent.discount = (Number(parent.discount) || 0) + (Number(row.discount) || 0);
        parent.qty = (Number(parent.qty) || 0) + (Number(row.qty) || 0);
        await store.setJSON(String(addonToOrderNum), parent);
        return;
      }
      // parent introuvable → on retombe sur un enregistrement normal
    }
    const key = String(row.orderNum || `${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
    await store.setJSON(key, row);
  } catch (e) {
    // non bloquant : la commande reste prise (Forcelog + email) même si le journal échoue
    console.error("Netlify Blobs (order) failed:", e);
  }
}

/* ─────────────────────────────────────────────
   Route
   ───────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: OrderPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").replace(/\s+/g, "");
  const cityCode = (body.cityCode || "").trim();
  const address = (body.address || "").trim();

  if (!name || !phone || !cityCode) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  // Téléphone marocain : 05/06/07 + 8 chiffres, ou +212
  const normalized = phone.replace(/^\+?212/, "0");
  if (!/^0[567]\d{8}$/.test(normalized)) {
    return NextResponse.json({ ok: false, error: "bad_phone" }, { status: 422 });
  }

  const city = FORCELOG_CITIES.find((c) => c.code === cityCode);
  if (!city) {
    return NextResponse.json({ ok: false, error: "bad_city" }, { status: 422 });
  }

  const items: OrderItem[] =
    body.items && body.items.length
      ? body.items
      : [
          {
            name: body.product || "Maison d'Or",
            variant: body.variant || "",
            quantity: body.qty || 1,
            price: body.total || 0,
            image: "",
          },
        ];

  const orderNum = `MDO-LP-${Date.now()}`.slice(0, 20);
  const subtotal = body.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = body.discount ?? 0;
  const shipping = body.shipping ?? 0;
  const total = body.total ?? subtotal - discount + shipping;
  const source = body.source || body.model || "LP";
  const utmSource = (body.utmSource || "").slice(0, 60);
  const utmContent = (body.utmContent || "").slice(0, 60);
  const utm =
    body.utm && typeof body.utm === "object"
      ? Object.fromEntries(
          Object.entries(body.utm)
            .slice(0, 15)
            .map(([kk, vv]) => [String(kk).slice(0, 30), String(vv).slice(0, 200)])
        )
      : {};

  const row = {
    date: new Date().toISOString(),
    orderNum,
    name,
    phone: normalized,
    cityCode,
    city: city.name,
    address,
    product: body.product || items[0]?.name || "",
    model: body.model || "",
    variant: body.variant || items[0]?.variant || "",
    color: body.variant || items[0]?.variant || "",
    image: items[0]?.image || "",
    items,
    qty: body.qty ?? items.reduce((s, i) => s + i.quantity, 0),
    price: items[0]?.price ?? 0,
    subtotal,
    discount,
    delivery: shipping,
    shipping,
    total,
    lang: body.lang || "fr",
    source,
    utmSource,
    utmContent,
    utm,
  };

  // ── Forcelog : bloquant (si ça échoue, on n'annonce pas la commande comme prise)
  const forcelog = await createForcelogParcel({
    orderNum,
    name,
    phone: normalized,
    cityCode,
    address: address || city.name,
    total,
    items,
  });

  // ── Contexte requête pour le CAPI (matching Meta)
  const ua = req.headers.get("user-agent") || undefined;
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  const fbclid = (utm as Record<string, string>).fbclid;
  const fbc = req.cookies.get("_fbc")?.value || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
  const sourceUrl = req.headers.get("referer") || undefined;

  // ── Notifications & journal : non bloquants
  await Promise.allSettled([
    sendCapiPurchase({
      orderNum,
      phone: normalized,
      name,
      value: total,
      numItems: Number(row.qty) || 1,
      ip,
      ua,
      fbp,
      fbc,
      sourceUrl,
    }),
    pushNtfy({
      orderNum,
      name,
      phone: normalized,
      cityName: city.name,
      total,
      items,
      image: items[0]?.image || "",
      source,
      utmSource,
      utmContent,
    }),
    sendOrderEmail({
      orderNum,
      name,
      phone: normalized,
      address: address || city.name,
      cityName: city.name,
      items,
      subtotal,
      discount,
      shipping,
      total,
      source,
      utmSource,
      utmContent,
    }),
    logToBlob({ ...row, forcelog: forcelog.ok }, body.addonToOrderNum),
  ]);

  if (!forcelog.ok && !forcelog.skipped) {
    // Le colis n'est pas créé mais la commande est notifiée : on la considère reçue.
    return NextResponse.json({ ok: true, orderNum, forcelog: false });
  }

  return NextResponse.json({ ok: true, orderNum, forcelog: forcelog.ok });
}

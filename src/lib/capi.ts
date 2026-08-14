import crypto from "node:crypto";

/**
 * Conversions API Meta (serveur).
 * - "Lead"     : au form submit (commande passée)   -> dédup avec le pixel via event_id = orderNum
 * - "Purchase" : quand la commande passe en "Livrée" -> la vraie vente payée (COD)
 */
const PIXEL = process.env.META_PIXEL_ID || "36659330483710557";
const sha = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export type CapiArgs = {
  orderNum: string;
  phone: string;
  name?: string;
  value?: number;
  numItems?: number;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
};

export async function sendCapiEvent(eventName: "Lead" | "Purchase", a: CapiArgs) {
  const token = process.env.CAPI_TOKEN;
  if (!token) return; // CAPI désactivé tant que le token n'est pas configuré
  const phoneE164 = (a.phone || "").replace(/\D/g, "").replace(/^0/, "212"); // 06.. -> 2126..
  const first = (a.name || "").trim().split(/\s+/)[0] || "";
  const user_data: Record<string, unknown> = {
    ...(phoneE164 ? { ph: [sha(phoneE164)] } : {}),
    ...(first ? { fn: [sha(first)] } : {}),
    ...(a.ip ? { client_ip_address: a.ip } : {}),
    ...(a.ua ? { client_user_agent: a.ua } : {}),
    ...(a.fbp ? { fbp: a.fbp } : {}),
    ...(a.fbc ? { fbc: a.fbc } : {}),
  };
  const custom_data: Record<string, unknown> = { currency: "MAD", content_type: "product" };
  if (a.value != null) custom_data.value = a.value;
  if (a.numItems != null) custom_data.num_items = a.numItems;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: a.orderNum,
        action_source: "website",
        ...(a.sourceUrl ? { event_source_url: a.sourceUrl } : {}),
        user_data,
        custom_data,
      },
    ],
  };
  try {
    await fetch(`https://graph.facebook.com/v21.0/${PIXEL}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error(`CAPI ${eventName} failed:`, e);
  }
}

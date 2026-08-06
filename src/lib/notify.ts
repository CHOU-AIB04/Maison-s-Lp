/**
 * Notifications push ntfy.sh
 * ─────────────────────────────────────────────────────────────
 * ⚠️ Publication en JSON, pas par en-têtes HTTP : les en-têtes
 * ntfy (Title, Tags…) doivent être ASCII / Latin-1. Un tiret
 * cadratin, un accent ou un emoji dans Title fait échouer
 * fetch() avant même que la requête parte.
 */

export type NtfyItem = { name: string; variant: string; quantity: number; price: number };

export const NTFY_TOPICS = (process.env.NTFY_TOPICS || "Maison_dor,Adraouy")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

export async function pushNtfy(args: {
  orderNum: string;
  name: string;
  phone: string;
  cityName: string;
  total: number;
  items: NtfyItem[];
  image: string;
  source: string;
}) {
  const itemsList = args.items
    .map((i) => `- ${i.name} x ${i.variant} x ${i.quantity} - ${i.price} MAD`)
    .join("\n");

  const message = `🛍 Client: ${args.name}\nTél: ${args.phone}\nTotal: ${args.total} MAD\nVille: ${args.cityName}\nRéf: ${args.orderNum}\n\nArticles:\n${itemsList}`;

  const results = await Promise.allSettled(
    NTFY_TOPICS.map(async (topic) => {
      const res = await fetch("https://ntfy.sh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: `Nouvelle commande ${args.source} - Maison d'Or`,
          message,
          priority: 5,
          tags: ["moneybag", "package"],
          click: `tel:${args.phone}`,
          ...(args.image ? { attach: args.image } : {}),
        }),
      });
      if (!res.ok) throw new Error(`ntfy ${topic} → ${res.status} ${await res.text()}`);
      return topic;
    })
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") console.error("NTFY ÉCHEC:", NTFY_TOPICS[i], r.reason);
    else console.log("NTFY OK:", r.value);
  });

  return results.map((r, i) => ({
    topic: NTFY_TOPICS[i],
    ok: r.status === "fulfilled",
    error: r.status === "rejected" ? String(r.reason) : null,
  }));
}

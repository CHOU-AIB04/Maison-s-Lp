import { NextRequest, NextResponse } from "next/server";
import { pushNtfy } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Test des notifications push.
 *   /api/notify-test?k=VOTRE_ORDERS_KEY
 * Renvoie le statut topic par topic (utile pour voir l'erreur exacte de ntfy).
 */
export async function GET(req: NextRequest) {
  if (process.env.ORDERS_KEY && req.nextUrl.searchParams.get("k") !== process.env.ORDERS_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const result = await pushNtfy({
    orderNum: `TEST-${Date.now()}`,
    name: "Test Maison d'Or",
    phone: "0722474350",
    cityName: "Casablanca",
    total: 149,
    items: [{ name: "Test produit", variant: "Doré", quantity: 1, price: 149 }],
    image: "",
    source: "test",
  });

  return NextResponse.json({
    ok: result.every((r) => r.ok),
    topics: process.env.NTFY_TOPICS || "Maison_dor,Adraouy (par défaut)",
    result,
  });
}

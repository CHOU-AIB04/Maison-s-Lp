/**
 * Couche dataLayer / GTM — même convention que maison-dor.store,
 * pour que les deux propriétés remontent dans le même conteneur.
 */

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export type GtmItem = {
  item_id: string;
  item_name: string;
  item_variant: string;
  item_category: string;
  price: number;
  quantity: number;
};

export function gtmEvent(event: string, ecommerce?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  // Bonne pratique GA4 : purger l'objet ecommerce précédent
  w.dataLayer.push({ ecommerce: null });
  w.dataLayer.push(ecommerce ? { event, ecommerce } : { event });
}

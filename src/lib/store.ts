import { getStore, type Store } from "@netlify/blobs";

/**
 * Stockage natif Netlify Blobs — aucune variable d'env à configurer,
 * le contexte est injecté automatiquement par le runtime Netlify.
 * (Remplace @vercel/blob qui exigeait BLOB_READ_WRITE_TOKEN.)
 */
export function ordersStore(): Store {
  return getStore({ name: "maison-dor-orders", consistency: "strong" });
}

export function statusStore(): Store {
  return getStore({ name: "maison-dor-status", consistency: "strong" });
}

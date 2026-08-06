import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://lp-maison-dor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: new Date(), priority: 1 },
    ...PRODUCTS.map((p) => ({
      url: `${SITE}/${p.slug}`,
      lastModified: new Date(),
      priority: 0.9,
    })),
  ];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductLP from "@/components/ProductLP";
import { PRODUCTS, getProduct, img } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const image = img(p.hero, 1200);
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: {
      title: p.seo.title,
      description: p.seo.description,
      type: "website",
      locale: "fr_MA",
      url: `/${p.slug}`,
      images: [{ url: image, width: 1200, height: 1200, alt: p.name.fr }],
    },
    twitter: { card: "summary_large_image", title: p.seo.title, description: p.seo.description, images: [image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.fr,
    description: product.seo.description,
    image: product.gallery.map((g) => img(g, 1200)),
    brand: { "@type": "Brand", name: "Maison d'Or" },
    category: product.category.fr,
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "MAD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    },
    review: product.reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name.fr },
      reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
      reviewBody: r.text.fr,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faq.map((f) => ({
      "@type": "Question",
      name: f.q.fr,
      acceptedAnswer: { "@type": "Answer", text: f.a.fr },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <ProductLP product={product} />
    </>
  );
}

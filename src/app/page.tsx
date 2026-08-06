import Link from "next/link";
import { PRODUCTS, img } from "@/lib/catalog";

export const metadata = {
  title: "Maison d'Or — Parures & Bracelets, livraison gratuite au Maroc",
  description:
    "Parures Tulip et Swan, bracelets sertis de cristaux. Plaqué or 18K, hypoallergénique. Livraison gratuite partout au Maroc, paiement à la livraison.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 text-center">
        <p className="font-display text-3xl font-black gold-text">Maison d&apos;Or</p>
        <p className="mt-2 text-sm text-[#6b6353]">
          Livraison gratuite partout au Maroc · Paiement à la livraison
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="group overflow-hidden rounded-3xl border border-[#e7ddca] bg-white shadow-sm transition hover:shadow-xl"
          >
            <img
              src={img(p.hero, 600)}
              alt={p.name.fr}
              className="aspect-square w-full object-cover transition group-hover:scale-105"
            />
            <div className="p-4">
              <h2 className="font-display text-lg font-bold">
                {p.emoji} {p.name.fr}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs text-[#8a8172]">{p.headline.fr}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-xl font-black gold-text">{p.price} dh</span>
                <span className="text-sm text-[#a09889] line-through">{p.compareAt} dh</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

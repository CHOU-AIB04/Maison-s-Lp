"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type LPProduct,
  type Lang,
  type L,
  img,
  WHATSAPP,
  bundleTotal,
  bundleSaving,
  getProduct,
} from "@/lib/catalog";
import { UI } from "@/lib/ui-copy";
import { gtmEvent, type GtmItem } from "@/lib/gtm";
import { FORCELOG_CITIES } from "@/lib/cities";

type Status = "idle" | "sending" | "done";

/** UTM + IDs de campagne Meta captés dans l'URL de l'annonce. */
const UTM_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "ad_id", "adset_id", "campaign_id", "fbclid",
] as const;

/* ── Meta Pixel ─────────────────────────────────────────── */
type Fbq = (...args: unknown[]) => void;
const track = (event: string, data?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: Fbq }).fbq?.("track", event, data);
};

function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={`${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= n ? "fill-[#f0a83c]" : "fill-[#dfd6c4]"}`}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductLP({ product }: { product: LPProduct }) {
  const [lang, setLang] = useState<Lang>("fr");
  const t = UI[lang];
  const dir = t.dir;
  const tr = (v: L) => v[lang];

  /* ── Sélection ───────────────────────────────────────── */
  const [variantKey, setVariantKey] = useState(product.variants[0].key);
  const [bundleIdx, setBundleIdx] = useState(0);

  const variant = product.variants.find((v) => v.key === variantKey) || product.variants[0];
  const bundle = product.bundles[bundleIdx];
  const qty = bundle.qty;
  const subtotal = product.price * qty;
  const total = bundleTotal(bundle);
  const discount = bundleSaving(bundle, product.price);
  const discountPct = Math.round((1 - product.price / product.compareAt) * 100);

  /** Une photo par modèle : le diaporama fait défiler les variantes. */
  const gallery = useMemo(() => product.variants.map((v) => v.img), [product.variants]);
  const galleryIdx = Math.max(0, product.variants.findIndex((v) => v.key === variantKey));
  const goToVariant = (i: number) =>
    setVariantKey(product.variants[(i + product.variants.length) % product.variants.length].key);

  /* ── Formulaire ──────────────────────────────────────── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [upsellState, setUpsellState] = useState<"offer" | "adding" | "added" | "declined">("offer");
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [revIdx, setRevIdx] = useState(0);
  const touchX = useRef<number | null>(null);
  const checkoutStarted = useRef(false);

  const selectedCity = FORCELOG_CITIES.find((c) => c.code === cityCode);
  const filteredCities = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return FORCELOG_CITIES.slice(0, 60);
    return FORCELOG_CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 60);
  }, [cityQuery]);

  /* ── Éléments dynamiques (client-only) ───────────────── */
  const [delivery, setDelivery] = useState<{ a: string; b: string } | null>(null);

  useEffect(() => {
    const fmt = (d: Date) => `${t.days[d.getDay()]} ${d.getDate()} ${t.months[d.getMonth()]}`;
    const a = new Date();
    a.setDate(a.getDate() + 2);
    const b = new Date();
    b.setDate(b.getDate() + 4);
    setDelivery({ a: fmt(a), b: fmt(b) });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /** UTM + IDs Meta (campaign/adset/ad) : lus dans l'URL, conservés pour la session. */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pick = (key: string) => {
      const fromUrl = q.get(key);
      try {
        if (fromUrl) sessionStorage.setItem(key, fromUrl);
        return fromUrl ?? sessionStorage.getItem(key) ?? "";
      } catch {
        return fromUrl ?? "";
      }
    };
    const collected: Record<string, string> = {};
    UTM_KEYS.forEach((key) => {
      const v = pick(key);
      if (v) collected[key] = v;
    });
    setUtm(collected);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRevIdx((i) => (i + 1) % Math.min(4, product.reviews.length)), 5000);
    return () => clearInterval(id);
  }, [product.reviews.length]);

  useEffect(() => {
    track("ViewContent", {
      content_name: product.name.fr,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "MAD",
    });
    gtmEvent("view_item", { currency: "MAD", value: product.price, items: gtmItems(1) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, product.name.fr, product.price]);

  /** Items au format GA4 (identique au site principal). */
  const gtmItems = (quantity = qty, price = product.price): GtmItem[] => [
    {
      item_id: product.id,
      item_name: product.name.fr,
      item_variant: variant.label.fr,
      item_category: product.category.fr,
      price,
      quantity,
    },
  ];

  const startCheckout = () => {
    if (checkoutStarted.current) return;
    checkoutStarted.current = true;
    track("InitiateCheckout", {
      content_name: product.name.fr,
      content_ids: [product.id],
      value: total,
      currency: "MAD",
      num_items: qty,
    });
    gtmEvent("begin_checkout", { currency: "MAD", value: total, items: gtmItems() });
  };

  const goToForm = () => {
    track("AddToCart", {
      content_name: product.name.fr,
      content_ids: [product.id],
      value: total,
      currency: "MAD",
      num_items: qty,
    });
    gtmEvent("add_to_cart", { currency: "MAD", value: total, items: gtmItems() });
    document.getElementById("commander")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById("f-name")?.focus(), 500);
  };

  const prevPhoto = () => goToVariant(galleryIdx - 1);
  const nextPhoto = () => goToVariant(galleryIdx + 1);

  const waLink = () => {
    const msg =
      lang === "fr"
        ? `Bonjour ! Je souhaite commander : ${product.name.fr} (${tr(variant.label)}) — ${qty} pièce(s) — ${total} dh`
        : `سلام! بغيت نطلب : ${product.name.ar} (${tr(variant.label)}) — ${qty} قطعة — ${total} درهم`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  /* ── Envoi ───────────────────────────────────────────── */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr(t.errName);
    const norm = phone.replace(/\s+/g, "").replace(/^\+?212/, "0");
    if (!/^0[567]\d{8}$/.test(norm)) return setErr(t.errPhone);
    if (!cityCode) return setErr(t.errCity);

    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: norm,
          cityCode,
          items: [
            {
              name: product.name.fr,
              variant: variant.label.fr,
              quantity: qty,
              price: product.price,
              image: img(variant.img, 400),
            },
          ],
          subtotal,
          discount,
          shipping: 0,
          total,
          product: product.name.fr,
          model: product.id,
          variant: variant.label.fr,
          qty,
          lang,
          source: product.slug,
          utm,
          utmSource: utm.utm_source || "",
          utmContent: utm.utm_content || "",
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "err");

      setOrderNum(json.orderNum || "");
      track("Purchase", {
        content_name: product.name.fr,
        content_ids: [product.id],
        content_type: "product",
        value: total,
        currency: "MAD",
        num_items: qty,
      });
      gtmEvent("purchase", {
        transaction_id: json.orderNum || `MDO-${Date.now()}`,
        currency: "MAD",
        value: total,
        shipping: 0,
        items: gtmItems(),
      });
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("idle");
      setErr(t.errGeneric);
    }
  };

  /* ── Upsell ──────────────────────────────────────────── */
  const upsellProduct = getProduct(product.upsell);
  const upsellPrice = upsellProduct ? Math.round(upsellProduct.price / 2) : 0;

  const addUpsell = async () => {
    if (!upsellProduct) return;
    setUpsellState("adding");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\s+/g, "").replace(/^\+?212/, "0"),
          cityCode,
          items: [
            {
              name: `${upsellProduct.name.fr} (UPSELL -50%)`,
              variant: upsellProduct.variants[0].label.fr,
              quantity: 1,
              price: upsellPrice,
              image: img(upsellProduct.hero, 400),
            },
          ],
          subtotal: upsellProduct.price,
          discount: upsellProduct.price - upsellPrice,
          shipping: 0,
          total: upsellPrice,
          product: `${upsellProduct.name.fr} (UPSELL)`,
          model: upsellProduct.id,
          variant: upsellProduct.variants[0].label.fr,
          qty: 1,
          lang,
          source: `${product.slug}-upsell`,
          utm,
          utmSource: utm.utm_source || "",
          utmContent: utm.utm_content || "",
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error();
      track("Purchase", {
        content_name: `${upsellProduct.name.fr} UPSELL`,
        content_ids: [upsellProduct.id],
        value: upsellPrice,
        currency: "MAD",
        num_items: 1,
      });
      gtmEvent("purchase", {
        transaction_id: `${json.orderNum || Date.now()}-UPSELL`,
        currency: "MAD",
        value: upsellPrice,
        shipping: 0,
        items: [
          {
            item_id: upsellProduct.id,
            item_name: `${upsellProduct.name.fr} (UPSELL -50%)`,
            item_variant: upsellProduct.variants[0].label.fr,
            item_category: upsellProduct.category.fr,
            price: upsellPrice,
            quantity: 1,
          },
        ],
      });
      setUpsellState("added");
    } catch {
      setUpsellState("offer");
    }
  };

  /* ═══════════════════════════════════════════════════════
     CONFIRMATION
     ═══════════════════════════════════════════════════════ */
  if (status === "done") {
    return (
      <div dir={dir} className="min-h-screen">
        <TopBar lang={lang} setLang={setLang} t={t} />
        <section className="mx-auto max-w-xl px-4 py-14 text-center fade-up">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="font-display mb-3 text-3xl font-black">{t.doneTitle}</h1>
          <p className="mb-8 text-[#5b5346]">{t.doneMsg(orderNum)}</p>

          {upsellProduct && upsellState !== "added" && upsellState !== "declined" && (
            <div className="rounded-3xl border-2 border-[var(--gold)] bg-white p-5 text-start shadow-xl">
              <div className="mb-3 inline-block rounded-full gold-bg px-3 py-1 text-xs font-bold text-white">
                {t.upsellBadge}
              </div>
              <div className="flex items-center gap-4">
                <img src={img(upsellProduct.hero, 300)} alt={upsellProduct.name.fr} className="h-24 w-24 rounded-2xl object-cover shadow" />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-extrabold">
                    {upsellProduct.emoji} {tr(upsellProduct.name)}
                  </h3>
                  <p className="mb-2 text-sm text-[#6b6353]">{t.upsellDesc}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-black text-red-600">-50%</span>
                    <span className="text-sm text-[#9a9285] line-through">{upsellProduct.price} {t.dh}</span>
                    <span className="font-display text-2xl font-black gold-text">{upsellPrice} {t.dh}</span>
                  </div>
                </div>
              </div>
              <button onClick={addUpsell} disabled={upsellState === "adding"} className="mt-4 w-full rounded-full gold-bg py-3.5 text-lg font-bold text-white shadow-lg disabled:opacity-60">
                {upsellState === "adding" ? "…" : t.upsellAdd}
              </button>
              <button onClick={() => setUpsellState("declined")} className="mt-2 w-full text-sm font-bold text-[#8a8172]">
                {t.upsellNo}
              </button>
            </div>
          )}

          {upsellState === "added" && (
            <div className="fade-up rounded-3xl border-2 border-green-400 bg-green-50 p-6">
              <div className="mb-2 text-4xl">🎁</div>
              <h3 className="font-display text-xl font-extrabold text-green-800">{t.upsellAdded}</h3>
              <p className="text-sm text-green-700">{t.upsellAddedMsg}</p>
            </div>
          )}

          <a href={waLink()} target="_blank" rel="noopener" className="mt-8 inline-block rounded-full bg-[#25D366] px-8 py-4 text-lg font-bold text-white shadow-lg">
            💬 {t.doneWhats}
          </a>
        </section>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     LANDING PAGE
     ═══════════════════════════════════════════════════════ */
  return (
    <div dir={dir} className="min-h-screen pb-24">
      <TopBar lang={lang} setLang={setLang} t={t} />

      {/* ═══ BLOC ACHAT ═══ */}
      <section className="mx-auto max-w-[1240px] px-4 pb-10 pt-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* ── Diaporama ─────────────────────────────── */}
          <div id="photo" className="fade-up min-w-0 scroll-mt-20 lg:sticky lg:top-24 lg:self-start">
            <div
              className="group relative overflow-hidden rounded-[2px] bg-white shadow-[0_2px_24px_rgba(26,22,19,0.07)]"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const d = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(d) > 40) (d > 0 ? prevPhoto : nextPhoto)();
                touchX.current = null;
              }}
            >
              <span className="absolute start-4 top-4 z-10 rounded-full bg-[#1a1613] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">
                −{discountPct}%
              </span>

              <div className="relative aspect-square w-full">
                {product.variants.map((v, k) => (
                  <img
                    key={v.key}
                    src={img(v.img, 900)}
                    srcSet={`${img(v.img, 450)} 450w, ${img(v.img, 700)} 700w, ${img(v.img, 1000)} 1000w`}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    alt={`${product.name.fr} — ${tr(v.label)}`}
                    loading={k === 0 ? "eager" : "lazy"}
                    fetchPriority={k === 0 ? "high" : "low"}
                    decoding="async"
                    aria-hidden={galleryIdx !== k}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-out ${
                      galleryIdx === k ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label="Précédent"
                    className="absolute start-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-[#1a1613] shadow-md backdrop-blur transition hover:bg-white group-hover:flex"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextPhoto}
                    aria-label="Suivant"
                    className="absolute end-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-[#1a1613] shadow-md backdrop-blur transition hover:bg-white group-hover:flex"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Compteur + navigation (mobile & desktop) */}
            {gallery.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-5 text-sm text-[#8a8172]">
                <button onClick={prevPhoto} aria-label="Précédent" className="px-2 text-lg leading-none transition hover:text-[#1a1613]">
                  ‹
                </button>
                <span className="tabular-nums tracking-wide">
                  {galleryIdx + 1} <span className="text-[#c6bca8]">/</span> {gallery.length}
                </span>
                <button onClick={nextPhoto} aria-label="Suivant" className="px-2 text-lg leading-none transition hover:text-[#1a1613]">
                  ›
                </button>
              </div>
            )}

            {/* Miniatures */}
            {gallery.length > 1 && (
              <div className="mt-3 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {product.variants.map((v, i) => (
                  <button
                    key={v.key}
                    onClick={() => setVariantKey(v.key)}
                    aria-label={tr(v.label)}
                    title={tr(v.label)}
                    className={`h-[64px] w-[64px] shrink-0 snap-start overflow-hidden rounded-[2px] border transition sm:h-[74px] sm:w-[74px] ${
                      galleryIdx === i ? "border-[#1a1613]" : "border-[#e7ddca] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img(v.img, 170)} alt={tr(v.label)} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Colonne commande ───────────────────────── */}
          <div className="fade-up flex min-w-0 flex-col">
            <h1 className="font-display order-1 mb-3 text-[20px] font-bold leading-[1.1] tracking-tight md:text-[44px]">
              {tr(product.name)}
              {product.variants.length > 1 && (
                <span className="font-normal text-[#8a8172]"> — {tr(variant.label)}</span>
              )}
            </h1>

            <a href="#avis" className="order-1 mb-4 inline-flex items-center gap-2">
              <Stars n={5} />
              <span className="text-sm font-semibold text-[#5b5346]">{product.rating.toFixed(1).replace(".", ",")}</span>
              <span className="text-sm text-[#8a8172] underline underline-offset-2">
                {product.reviewCount} {t.reviews}
              </span>
            </a>

            <div className="order-1 mb-5 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-[40px] md:text-[55px] font-extrabold text-black">
                {product.price},00 {t.dh}
              </span>
              <span className="text-lg text-[#a09889] line-through">
                {product.compareAt},00 {t.dh}
              </span>
              <span className="inline-flex items-center gap-1 rounded-[2px] bg-[#1a1613] px-2.5 py-1 text-[11px] font-bold text-white">
                🏷 −{discountPct}%
              </span>
            </div>

            <ul className="order-5 mb-6 space-y-3.5 lg:order-2">
              {product.usps.map((u, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#4a4436]">
                  <span>{["✨", "💧", "🌿", "🎁"][i % 4]}</span>
                  <span>{tr(u)}</span>
                </li>
              ))}
            </ul>

            {/* Modèle */}
            {product.variants.length > 1 && (
              <div className="order-2 mb-6 lg:order-3">
                <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8172]">
                  {t.model} — <span className="text-[#1a1613]">{tr(variant.label)}</span>
                </div>
                <select
                  className="field"
                  value={variantKey}
                  onChange={(e) => setVariantKey(e.target.value)}
                  aria-label={t.model}
                >
                  {product.variants.map((v) => (
                    <option key={v.key} value={v.key}>
                      {tr(v.label)}
                    </option>
                  ))}
                </select>
                {variant.desc && <p className="mt-3 text-sm leading-relaxed text-[#6b6353]">{tr(variant.desc)}</p>}
              </div>
            )}

            {/* Packs */}
            <div className="order-3 mb-6 lg:order-4">
              <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8172]">
                <span>📦</span> {t.bundleTitle}
              </div>
              <div className="space-y-2">
                {product.bundles.map((b, i) => {
                  const bTotal = bundleTotal(b);
                  const saving = bundleSaving(b, product.price);
                  const active = bundleIdx === i;
                  return (
                    <button
                      key={b.qty}
                      onClick={() => setBundleIdx(i)}
                      className={`flex w-full items-center justify-between rounded-[3px] border px-4 py-3.5 text-start transition ${
                        active
                          ? "border-[var(--gold)] bg-[var(--gold)]/8 shadow-[0_1px_10px_rgba(201,162,75,0.18)]"
                          : "border-[#e7ddca] bg-white hover:border-[#cbbb9a]"
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition ${
                            active ? "border-[var(--gold-dark)] border-[5px]" : "border-[#cbbb9a]"
                          }`}
                        />
                        <span className="min-w-0">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="whitespace-nowrap font-semibold">{t.piece(b.qty)}</span>
                            {b.badge && (
                              <span className="whitespace-nowrap rounded-full bg-[#1a1613] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                                {tr(b.badge)}
                              </span>
                            )}
                          </span>
                          {saving > 0 && (
                            <span className="mt-0.5 block whitespace-nowrap text-[13px] font-bold text-green-700">
                              − {saving} {t.dh} {t.saved}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 text-end leading-tight">
                        <span className="font-display block whitespace-nowrap text-[19px] font-bold">
                          {bTotal} {t.dh}
                        </span>
                        {saving > 0 && (
                          <span className="block whitespace-nowrap text-xs text-[#a09889] line-through">
                            {product.price * b.qty} {t.dh}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Formulaire de commande ── */}
            <form
              id="commander"
              onSubmit={submit}
              onFocus={startCheckout}
              className="order-4 scroll-mt-24 space-y-2.5 rounded-[3px] border border-[#e7ddca] bg-white p-5 lg:order-5 shadow-[0_2px_18px_rgba(26,22,19,0.06)]"
            >
              <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a8172]">
                {t.formTitle}
              </p>

              {UTM_KEYS.map((key) => (
                <input key={key} type="hidden" name={key} value={utm[key] || ""} readOnly />
              ))}

              <input id="f-name" className="field" placeholder={t.fName} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <input className="field" type="tel" inputMode="tel" placeholder={t.fPhone} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />

              <div className="relative">
                <input
                  className="field"
                  placeholder={t.fCityPick}
                  value={selectedCity && !cityOpen ? selectedCity.name : cityQuery}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    setCityOpen(true);
                    setCityCode("");
                  }}
                  onFocus={() => setCityOpen(true)}
                  onBlur={() => setTimeout(() => setCityOpen(false), 150)}
                  autoComplete="off"
                />
                {cityOpen && (
                  <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-[3px] border border-[#e3d9c6] bg-white shadow-xl">
                    {filteredCities.length === 0 && <div className="px-4 py-3 text-sm text-[#8a8172]">{t.noCity}</div>}
                    {filteredCities.map((c) => (
                      <button
                        type="button"
                        key={c.code}
                        onMouseDown={() => {
                          setCityCode(c.code);
                          setCityQuery(c.name);
                          setCityOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm hover:bg-[var(--cream)]"
                      >
                        <span>{c.name}</span>
                        <span className="text-xs text-green-700">{t.free}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {err && <p className="rounded-[3px] bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">{err}</p>}

              <div className="flex items-center justify-between border-t border-[#f0e8d8] pt-3 text-sm">
                <span className="font-semibold">{t.total}</span>
                <span className="font-display text-[26px] font-bold text-[var(--gold-dark)]">
                  {total} {t.dh}
                </span>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-[3px] bg-[#1a1613] py-4 text-[15px] font-bold tracking-wide text-white transition hover:bg-[#2c2721] disabled:opacity-60"
              >
                {status === "sending" ? t.sending : `${t.submit} — ${total} ${t.dh}`}
              </button>

              <p className="text-center text-xs text-[#8a8172]">🔒 {t.cod} · {t.freeShip}</p>
            </form>

            {/* Livraison estimée */}
            {delivery && (
              <p className="order-6 mt-4 flex items-center gap-2.5 text-[12px] md:text-[15px] text-[#4a4436]">
                <span className="text-lg">🚚</span>
                <span>
                  {t.deliveryBetween(delivery.a, delivery.b)} — <strong>{t.free}</strong>
                </span>
              </p>
            )}
            <p className="order-6 mt-1.5 flex items-center gap-2.5 text-[12px] md:text-[15px] font-semibold text-[#b8791a]">
              <span className="text-lg">⚡</span> {t.lowStock(product.stock)}
            </p>

            {/* Avis en vitrine */}
            <div className="order-6 mt-5 border-t border-[#e7ddca] pt-4">
              <div className="flex items-start gap-3">
                <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 text-sm font-bold text-[var(--gold-dark)]">
                  {tr(product.reviews[revIdx].name).charAt(0)}
                </span>
                <div className="min-h-[52px] flex-1">
                  <p className="text-[15px] leading-snug text-[#4a4436]">{tr(product.reviews[revIdx].text)}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-[#8a8172]">
                    <span className="italic">{tr(product.reviews[revIdx].name)}</span>
                    <Stars n={product.reviews[revIdx].stars} className="scale-90" />
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-1.5">
                {product.reviews.slice(0, 4).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRevIdx(i)}
                    aria-label={`Avis ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === revIdx ? "w-4 bg-[#1a1613]" : "w-1.5 bg-[#d8cdb6]"}`}
                  />
                ))}
              </div>
            </div>

            {/* Accordéons */}
            <div className="order-6 mt-5 divide-y divide-[#e7ddca] border-y border-[#e7ddca]">
              <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center gap-3 font-semibold text-[#1a1613]">
                  <span>♡</span>
                  {t.qualityTitle}
                  <span className="ms-auto text-[#8a8172] transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-3">
                  {product.specs.map((sp, i) => (
                    <div key={i} className="flex justify-between gap-4 py-1.5 text-sm">
                      <span className="text-[#8a8172]">{tr(sp.label)}</span>
                      <span className="text-end text-[#1a1613]">{tr(sp.value)}</span>
                    </div>
                  ))}
                </div>
              </details>
              <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center gap-3 font-semibold text-[#1a1613]">
                  <span>📦</span>
                  {t.payDeliveryTitle}
                  <span className="ms-auto text-[#8a8172] transition group-open:rotate-180">⌄</span>
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {t.payDelivery.map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#4a4436]">
                      <span className="text-green-600">✓</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BANDEAU DÉFILANT ═══ */}
      <div className="overflow-hidden border-y border-[#e7ddca] bg-[var(--gold)]/15 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6b5a33]">
        <div className="ticker flex w-max gap-12 whitespace-nowrap px-6">
          {[...t.marquee, ...t.marquee].map((txt, i) => (
            <span key={i}>✦ {txt}</span>
          ))}
        </div>
      </div>

      {/* ═══ CONFIANCE ═══ */}
      <section className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4 lg:px-8">
        {[
          ["💵", t.cod, t.codDesc],
          ["📦", t.openBox, t.openBoxDesc],
          ["🚚", t.freeShip, "24h — 72h"],
          ["💬", t.support, t.supportDesc],
        ].map(([e, ti, de], i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{e}</span>
            <span className="text-sm font-bold text-[#4a4436]">{ti}</span>
            <span className="text-xs text-[#8a8172]">{de}</span>
          </div>
        ))}
      </section>

      {/* ═══ BÉNÉFICES ═══ */}
      <section className="border-y border-[#e7ddca] bg-white/60 py-12">
        <div className="mx-auto max-w-[1240px] px-4 lg:px-8">
          <h2 className="font-display mb-8 text-center text-[28px] font-bold tracking-tight">{t.whyTitle}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.benefits.map((b, i) => (
              <div key={i} className="rounded-[3px] border border-[#e7ddca] bg-white p-5 text-center">
                <div className="mb-2 text-3xl">{b.icon}</div>
                <h3 className="font-display text-[15px] font-bold leading-tight">{tr(b.title)}</h3>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[#6b6353]">
            {tr(product.subheadline)}
          </p>
          <div className="mt-7 text-center">
            <button
              onClick={goToForm}
              className="rounded-[3px] bg-[#1a1613] px-10 py-4 text-[15px] font-bold tracking-wide text-white transition hover:bg-[#2c2721]"
            >
              {t.cta} — {total} {t.dh}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ AVIS ═══ */}
      <section id="avis" className="mx-auto max-w-[1240px] scroll-mt-16 px-4 py-12 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-[40px] font-bold text-[var(--gold-dark)]">
            {product.rating.toFixed(1).replace(".", ",")}
          </span>
          <span>
            <Stars n={5} />
            <span className="block text-xs text-[#8a8172]">{t.basedOn(product.reviewCount)}</span>
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {product.reviews.slice(0, 6).map((r, i) => (
            <div key={i} className="rounded-[3px] border border-[#e7ddca] bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <Stars n={r.stars} />
                <span className="text-[11px] text-[#a09889]">{tr(r.ago)}</span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-[#4a4436]">{tr(r.text)}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-[var(--gold-dark)]">{tr(r.name)}</span>
                <span className="text-[#a09889]">· {tr(r.city)}</span>
                <span className="ms-auto rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700">✓ {t.verified}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DÉTAILS REPLIÉS ═══ */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <div className="divide-y divide-[#e7ddca] border-y border-[#e7ddca]">
          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-[#1a1613]">
              {tr(product.story.title)}
              <span className="text-[#8a8172] transition group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6353]">{tr(product.story.body)}</p>
          </details>

          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-[#1a1613]">
              {t.includedTitle}
              <span className="text-[#8a8172] transition group-open:rotate-180">⌄</span>
            </summary>
            <ul className="mt-3 space-y-1.5">
              {product.included.map((it, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#4a4436]">
                  <span className="text-green-600">✓</span>
                  <span>{tr(it)}</span>
                </li>
              ))}
            </ul>
          </details>

          <details className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-[#1a1613]">
              {t.compareTitle}
              <span className="text-[#8a8172] transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a1613] text-white">
                    <th className="p-2 text-start"></th>
                    <th className="p-2 text-center font-bold">{t.compareUs}</th>
                    <th className="p-2 text-center font-semibold text-white/70">{t.compareThem}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.compareRows.map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-[#faf6ef]" : ""}>
                      <td className="p-2 font-semibold text-[#4a4436]">{row[0]}</td>
                      <td className="p-2 text-center">
                        <span className="me-1 text-green-600">✓</span>
                        {row[1]}
                      </td>
                      <td className="p-2 text-center text-[#a09889]">
                        <span className="me-1 text-red-400">✕</span>
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {product.faq.map((f, i) => (
            <details key={i} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-[#1a1613]">
                {tr(f.q)}
                <span className="text-[#8a8172] transition group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6353]">{tr(f.a)}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 rounded-[3px] border border-[#e7ddca] bg-white p-6">
          <h3 className="font-display mb-4 text-center text-lg font-bold">{t.guaranteeTitle}</h3>
          <ul className="space-y-2.5">
            {t.guarantee.map(([e, txt], i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#4a4436]">
                <span className="text-lg">{e}</span>
                {txt}
              </li>
            ))}
          </ul>
          <button
            onClick={goToForm}
            className="mt-5 w-full rounded-[3px] bg-[#1a1613] py-4 text-[15px] font-bold tracking-wide text-white transition hover:bg-[#2c2721]"
          >
            {t.cta} — {total} {t.dh}
          </button>
        </div>
      </section>

      <footer className="border-t border-[#e7ddca] py-8 text-center text-sm text-[#8a8172]">
        © {new Date().getFullYear()} Maison d&apos;Or · {t.cod}
      </footer>

      {/* ═══ BARRE COLLANTE ═══ */}
      <div
        dir={dir}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e7ddca] bg-white/95 px-3 py-2.5 backdrop-blur"
      >
        <button
          onClick={goToForm}
          className="mx-auto flex w-full max-w-lg items-center justify-between rounded-[3px] bg-[#1a1613] px-6 py-3.5 text-white"
        >
          <span className="font-bold tracking-wide">{t.ctaShort}</span>
          <span className="font-display text-lg font-bold">
            {total} {t.dh}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Barre d'annonces + en-tête ─────────────────────────── */
function TopBar({
  lang,
  setLang,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof UI)["fr"] | (typeof UI)["ar"];
}) {
  return (
    <>
      <div className="overflow-hidden bg-[#1a1613] py-2 text-[11px] font-semibold tracking-wide text-white/90">
        <div className="ticker flex w-max gap-10 whitespace-nowrap px-4">
          {[...t.ticker, ...t.ticker].map((txt, i) => (
            <span key={i}>{txt}</span>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e7ddca] bg-[var(--cream)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="font-display text-xl font-extrabold gold-text">Maison d&apos;Or</span>
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="rounded-full border border-[var(--gold)] px-4 py-1.5 text-sm font-bold text-[var(--gold-dark)] transition hover:bg-[var(--gold)] hover:text-white"
          >
            {t.switchLabel}
          </button>
        </div>
      </header>
    </>
  );
}

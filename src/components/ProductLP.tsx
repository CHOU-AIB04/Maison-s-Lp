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
  variantGallery,
} from "@/lib/catalog";
import { UI } from "@/lib/ui-copy";
import { gtmEvent, type GtmItem } from "@/lib/gtm";
import { FORCELOG_CITIES } from "@/lib/cities";

type Status = "idle" | "sending" | "done";

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
  const [galleryIdx, setGalleryIdx] = useState(0);

  const variant = product.variants.find((v) => v.key === variantKey) || product.variants[0];
  const bundle = product.bundles[bundleIdx];
  const qty = bundle.qty;
  const subtotal = product.price * qty;
  const total = bundleTotal(bundle);
  const discount = bundleSaving(bundle, product.price);
  const discountPct = Math.round((1 - product.price / product.compareAt) * 100);

  /** Photos du modèle sélectionné (chaque variante a sa propre galerie) */
  const gallery = useMemo(() => variantGallery(product, variant), [product, variant]);

  useEffect(() => setGalleryIdx(0), [variantKey]);

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
  const [utm, setUtm] = useState({ source: "", content: "" });
  const checkoutStarted = useRef(false);

  const selectedCity = FORCELOG_CITIES.find((c) => c.code === cityCode);
  const filteredCities = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return FORCELOG_CITIES.slice(0, 60);
    return FORCELOG_CITIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 60);
  }, [cityQuery]);

  /* ── Éléments dynamiques (client-only) ───────────────── */
  const [delivery, setDelivery] = useState<{ a: string; b: string } | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fmt = (d: Date) => `${t.days[d.getDay()]} ${d.getDate()} ${t.months[d.getMonth()]}`;
    const a = new Date();
    a.setDate(a.getDate() + 2);
    const b = new Date();
    b.setDate(b.getDate() + 4);
    setDelivery({ a: fmt(a), b: fmt(b) });
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const end = Date.now() + (20 * 60 + Math.floor(Math.random() * 600)) * 1000;
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      setCountdown(
        `${String(Math.floor(left / 60000)).padStart(2, "0")}:${String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /** utm_source / utm_content : lus dans l'URL, conservés pour la session. */
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
    setUtm({ source: pick("utm_source"), content: pick("utm_content") });
  }, []);

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

  const pickPhoto = (i: number) => {
    setGalleryIdx(i);
    document.getElementById("photo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          utmSource: utm.source,
          utmContent: utm.content,
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
          utmSource: utm.source,
          utmContent: utm.content,
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

      <nav className="mx-auto max-w-6xl px-4 pt-3 text-xs text-[#8a8172]">
        <span>{t.home}</span>
        <span className="mx-1.5">›</span>
        <span>{tr(product.category)}</span>
        <span className="mx-1.5">›</span>
        <span className="font-semibold text-[#5b5346]">{tr(product.name)}</span>
      </nav>

      {/* ═══ BLOC ACHAT — photo + commande, sans scroll ═══ */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-3">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {/* Photos */}
          <div id="photo" className="fade-up scroll-mt-20 md:sticky md:top-20 md:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
              <span className="absolute start-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow">
                -{discountPct}%
              </span>
              <img
                src={img(gallery[galleryIdx], 900)}
                alt={`${product.name.fr} — ${tr(variant.label)}`}
                className="aspect-square w-full object-cover"
                fetchPriority="high"
              />
            </div>
            {gallery.length > 1 && (
              <div
                className="mt-3 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(gallery.length, 5)}, minmax(0, 1fr))` }}
              >
                {gallery.slice(0, 5).map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setGalleryIdx(i)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      galleryIdx === i ? "border-[var(--gold)]" : "border-[#e7ddca]"
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={img(g, 220)} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Commande */}
          <div className="fade-up">
            <a href="#avis" className="mb-2 inline-flex items-center gap-2">
              <Stars n={5} />
              <span className="text-sm font-bold text-[#5b5346]">{product.rating.toFixed(1).replace(".", ",")}</span>
              <span className="text-sm text-[#8a8172] underline">
                {product.reviewCount} {t.reviews}
              </span>
            </a>

            <h1 className="font-display mb-2 text-3xl font-black leading-tight md:text-4xl">
              {product.emoji} {tr(product.name)}
            </h1>

            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-black gold-text">
                {product.price} {t.dh}
              </span>
              <span className="text-lg text-[#a09889] line-through">
                {product.compareAt} {t.dh}
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-black text-red-600">-{discountPct}%</span>
            </div>

            {/* USP en puces courtes */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {product.usps.map((u, i) => (
                <span key={i} className="rounded-full border border-[#e7ddca] bg-white px-2.5 py-1 text-xs font-semibold text-[#4a4436]">
                  ✓ {tr(u)}
                </span>
              ))}
            </div>

            {/* Variantes */}
            {product.variants.length > 1 && (
              <div className="mb-5">
                <div className="mb-2 text-sm">
                  <span className="font-bold">{t.model} :</span>{" "}
                  <span className="text-[#8a8172]">{tr(variant.label)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.key}
                      onClick={() => setVariantKey(v.key)}
                      title={tr(v.label)}
                      className={`overflow-hidden rounded-2xl border-2 transition ${
                        variantKey === v.key ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/30" : "border-[#e3d9c6]"
                      }`}
                    >
                      <img src={img(v.img, 140)} alt={tr(v.label)} className="h-14 w-14 object-cover" />
                    </button>
                  ))}
                </div>
                {variant.desc && (
                  <p className="mt-2 text-sm leading-relaxed text-[#6b6353]">{tr(variant.desc)}</p>
                )}
              </div>
            )}

            {/* Packs */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black tracking-wide">
                <span>📦</span>
                <span>{t.bundleTitle}</span>
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
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-start transition ${
                        active ? "border-[var(--gold)] bg-[var(--gold)]/8 shadow-md" : "border-[#e3d9c6] bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-[var(--gold-dark)]" : "border-[#cbbb9a]"}`}>
                          {active && <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold-dark)]" />}
                        </span>
                        <span className="font-bold">{t.piece(b.qty)}</span>
                        {b.badge && (
                          <span className="rounded-full bg-[#1a1613] px-2 py-0.5 text-[10px] font-bold text-white">{tr(b.badge)}</span>
                        )}
                        {saving > 0 && (
                          <span className="text-xs font-bold text-green-700">− {saving} {t.dh}</span>
                        )}
                      </span>
                      <span className="text-end">
                        <span className="block font-display text-lg font-black">{bTotal} {t.dh}</span>
                        {saving > 0 && (
                          <span className="block text-xs text-[#a09889] line-through">{product.price * b.qty} {t.dh}</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── FORMULAIRE DIRECTEMENT ICI ── */}
            <form
              id="commander"
              onSubmit={submit}
              onFocus={startCheckout}
              className="scroll-mt-20 space-y-2.5 rounded-3xl border-2 border-[var(--gold)]/40 bg-white p-4 shadow-lg"
            >
              <p className="text-center text-sm font-bold text-[#4a4436]">
                💵 {t.formTitle} — {t.cod}
              </p>

              <input type="hidden" name="utm_source" value={utm.source} readOnly />
              <input type="hidden" name="utm_content" value={utm.content} readOnly />

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
                  <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-2xl border border-[#e3d9c6] bg-white shadow-xl">
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


              {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">{err}</p>}

              <div className="flex items-center justify-between rounded-2xl bg-[var(--cream)] px-4 py-2.5 text-sm">
                <span>
                  <span className="font-bold">{t.total}</span>
                  {discount > 0 && (
                    <span className="ms-2 text-xs font-bold text-green-700">− {discount} {t.dh}</span>
                  )}
                  <span className="ms-2 text-xs font-bold text-green-700">🚚 {t.free}</span>
                </span>
                <span className="font-display text-2xl font-black gold-text">{total} {t.dh}</span>
              </div>

              <button type="submit" disabled={status === "sending"} className="cta-pulse w-full rounded-full gold-bg py-4 text-lg font-black text-white shadow-xl disabled:opacity-60">
                {status === "sending" ? t.sending : `${t.submit} — ${total} ${t.dh}`}
              </button>

              <a href={waLink()} target="_blank" rel="noopener" className="block text-center text-xs font-bold text-[#25a34e] underline">
                {t.orWhats}
              </a>
            </form>

            {/* Réassurance compacte */}
            <div className="mt-3 space-y-1.5 text-sm">
              {delivery && (
                <p className="flex items-center gap-2 text-[#4a4436]">
                  <span>🚚</span>
                  <span>{t.deliveryBetween(delivery.a, delivery.b)} — <strong className="text-green-700">{t.free}</strong></span>
                </p>
              )}
              <p className="flex items-center gap-2 font-semibold text-[#b8791a]">
                <span>⚡</span> {t.lowStock(product.stock)}
              </p>
              {countdown && (
                <p className="flex items-center gap-2 text-[#4a4436]">
                  <span>⏳</span>
                  <span>{t.offerEndsIn} <strong className="font-mono">{countdown}</strong></span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONFIANCE ═══ */}
      <section className="border-y border-[#e7ddca] bg-white/70">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 text-center md:grid-cols-4">
          {[
            ["💵", t.cod, t.codDesc],
            ["📦", t.openBox, t.openBoxDesc],
            ["🚚", t.freeShip, "24h — 72h"],
            ["💬", t.support, t.supportDesc],
          ].map(([e, ti, de], i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-2xl">{e}</span>
              <span className="text-sm font-bold text-[#4a4436]">{ti}</span>
              <span className="text-xs text-[#8a8172]">{de}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LE PRODUIT EN IMAGES ═══ */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display mb-5 text-center text-2xl font-black">{t.galleryTitle}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((g, i) => (
            <button
              key={g}
              onClick={() => pickPhoto(i)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
            >
              <img
                src={img(g, 700)}
                alt={`${product.name.fr} ${i + 1}`}
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Nuancier cliquable */}
        {product.variants.length > 1 && (
          <div className="mt-6">
            <p className="mb-3 text-center text-sm font-bold text-[#4a4436]">
              {t.model} — {product.variants.length} {t.available}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setVariantKey(v.key);
                    document.getElementById("photo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-20 shrink-0"
                >
                  <img
                    src={img(v.img, 200)}
                    alt={tr(v.label)}
                    className={`aspect-square w-full rounded-2xl object-cover shadow-sm transition ${
                      variantKey === v.key ? "ring-2 ring-[var(--gold)]" : "opacity-90 hover:opacity-100"
                    }`}
                    loading="lazy"
                  />
                  <span className="mt-1 block text-center text-[11px] font-semibold text-[#6b6353]">{tr(v.label)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={goToForm} className="rounded-full gold-bg px-8 py-4 text-lg font-black text-white shadow-xl">
            {t.cta} — {total} {t.dh}
          </button>
        </div>
      </section>

      {/* ═══ BÉNÉFICES — 4 cartes courtes ═══ */}
      <section className="border-y border-[#e7ddca] bg-white/60 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 md:grid-cols-4">
          {product.benefits.map((b, i) => (
            <div key={i} className="rounded-2xl border border-[#f0e8d8] bg-white p-4 text-center shadow-sm">
              <div className="mb-1.5 text-3xl">{b.icon}</div>
              <h3 className="font-display text-sm font-bold leading-tight">{tr(b.title)}</h3>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-5 max-w-3xl px-4">
          <p className="text-center text-sm text-[#6b6353]">{tr(product.subheadline)}</p>
        </div>
      </section>

      {/* ═══ AVIS ═══ */}
      <section id="avis" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-4xl font-black gold-text">{product.rating.toFixed(1).replace(".", ",")}</span>
          <span>
            <Stars n={5} />
            <span className="block text-xs text-[#8a8172]">{t.basedOn(product.reviewCount)}</span>
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {product.reviews.slice(0, 6).map((r, i) => (
            <div key={i} className="rounded-2xl border border-[#f0e8d8] bg-white p-4 shadow-sm">
              <div className="mb-1.5 flex items-center justify-between">
                <Stars n={r.stars} />
                <span className="text-[11px] text-[#a09889]">{tr(r.ago)}</span>
              </div>
              <p className="mb-2 text-sm leading-relaxed text-[#4a4436]">{tr(r.text)}</p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-[var(--gold-dark)]">{tr(r.name)}</span>
                <span className="text-[#a09889]">· {tr(r.city)}</span>
                <span className="ms-auto rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700">✓ {t.verified}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DÉTAILS — tout replié ═══ */}
      <section className="mx-auto max-w-3xl px-4 pb-10">
        <div className="space-y-2.5">
          {/* Description */}
          <details className="group rounded-2xl border border-[#e7ddca] bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[#2c2721]">
              📖 {tr(product.story.title)}
              <span className="shrink-0 text-xl text-[var(--gold-dark)] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6353]">{tr(product.story.body)}</p>
          </details>

          {/* Contenu du colis */}
          <details className="group rounded-2xl border border-[#e7ddca] bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[#2c2721]">
              🎁 {t.includedTitle}
              <span className="shrink-0 text-xl text-[var(--gold-dark)] transition group-open:rotate-45">+</span>
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

          {/* Fiche produit */}
          <details className="group rounded-2xl border border-[#e7ddca] bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[#2c2721]">
              📋 {t.specsTitle}
              <span className="shrink-0 text-xl text-[var(--gold-dark)] transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3">
              {product.specs.map((s, i) => (
                <div key={i} className={`flex justify-between gap-4 rounded-lg px-2 py-2 text-sm ${i % 2 ? "bg-[#faf6ef]" : ""}`}>
                  <span className="font-semibold text-[#6b6353]">{tr(s.label)}</span>
                  <span className="text-end text-[#1a1613]">{tr(s.value)}</span>
                </div>
              ))}
            </div>
          </details>

          {/* Comparatif */}
          <details className="group rounded-2xl border border-[#e7ddca] bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-[#2c2721]">
              ⚖️ {t.compareTitle}
              <span className="shrink-0 text-xl text-[var(--gold-dark)] transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a1613] text-white">
                    <th className="p-2 text-start"></th>
                    <th className="p-2 text-center font-black">{t.compareUs}</th>
                    <th className="p-2 text-center font-semibold text-white/70">{t.compareThem}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.compareRows.map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-[#faf6ef]" : ""}>
                      <td className="p-2 font-semibold text-[#4a4436]">{row[0]}</td>
                      <td className="p-2 text-center"><span className="me-1 text-green-600">✓</span>{row[1]}</td>
                      <td className="p-2 text-center text-[#a09889]"><span className="me-1 text-red-400">✕</span>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* FAQ */}
          {product.faq.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-[#e7ddca] bg-white px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-bold text-[#2c2721]">
                {tr(f.q)}
                <span className="shrink-0 text-xl text-[var(--gold-dark)] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6353]">{tr(f.a)}</p>
            </details>
          ))}
        </div>

        {/* Garanties */}
        <div className="mt-6 rounded-2xl border border-[#e7ddca] bg-white p-5">
          <h3 className="font-display mb-3 text-center font-bold">{t.guaranteeTitle}</h3>
          <ul className="space-y-2">
            {t.guarantee.map(([e, txt], i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#4a4436]">
                <span className="text-lg">{e}</span>
                {txt}
              </li>
            ))}
          </ul>
          <button onClick={goToForm} className="mt-4 w-full rounded-full gold-bg py-3.5 font-black text-white shadow-lg">
            {t.cta} — {total} {t.dh}
          </button>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[#8a8172]">
        © {new Date().getFullYear()} Maison d&apos;Or · {t.cod}
      </footer>

      {/* ═══ BARRE COLLANTE ═══ */}
      <div dir={dir} className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e7ddca] bg-white/95 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <a href={waLink()} target="_blank" rel="noopener" aria-label="WhatsApp" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
              <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9 1 1-4.8-.3-.4C5.5 18.6 5 16.8 5 15 5 9 10 4 16 4s11 5 11 11-5 10-11 10zm6.1-7.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6s-.8-1.9-1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2.9 3 1 4.1.9.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z" />
            </svg>
          </a>
          <button onClick={goToForm} className="flex flex-1 items-center justify-between rounded-full gold-bg px-5 py-3 text-white shadow-lg">
            <span className="font-bold">{t.ctaShort}</span>
            <span className="font-display font-black">{total} {t.dh}</span>
          </button>
        </div>
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

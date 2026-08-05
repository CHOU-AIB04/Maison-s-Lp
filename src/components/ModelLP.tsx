"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Model, CITIES, WHATSAPP, EXTRA_ITEM_DISCOUNT, UPSELL_PCT, img } from "@/lib/models";

type Lang = "ar" | "fr";

const DICT = {
  ar: {
    dir: "rtl" as const,
    switch: "FR",
    brand: "Maison d'Or",
    priceNote: "توصيل مجاني 🚚 · الدفع عند الاستلام 💵",
    freeShip: "توصيل مجاني",
    cta: "اطلبي الآن 🛒",
    trust1: "الدفع عند الاستلام",
    trust2: "توصيل مجاني لكل المغرب",
    trust3: "جودة مضمونة",
    qtyDiscount: (pct: number) => `🎉 القطعة الثانية فما فوق بخصم ${pct}%!`,
    whyTitle: "لماذا هذا الطقم؟",
    why: [
      ["✨", "ذهب مقاوم للصدأ", "يبقى دائمًا جديدًا ولا يتغيّر لونه"],
      ["💎", "تصميم راقٍ وحصري", "موديل يميّزكِ عن غيرك"],
      ["🎁", "هدية مثالية", "طقم كامل: عقد + سوار في علبة أنيقة"],
      ["🚚", "توصيل مجاني", "لكل المغرب، مع الدفع عند الاستلام"],
    ],
    galleryTitle: "شاهدي التفاصيل",
    reviewsTitle: "آراء عميلاتنا 💛",
    reviews: [
      ["سارة · الدار البيضاء", "⭐⭐⭐⭐⭐", "جميل جدًا! الجودة رائعة والتوصيل كان سريعًا 🥰"],
      ["إيمان · مراكش", "⭐⭐⭐⭐⭐", "خدمة ممتازة، دفعت عند الاستلام. أنصح به ✨"],
      ["ياسمين · الرباط", "⭐⭐⭐⭐⭐", "التصميم رائع ولمعانه خيالي 💛"],
    ],
    formTitle: "أكملي طلبك",
    formSub: "املئي معلوماتك وسنتواصل معكِ لتأكيد الطلب",
    fName: "الاسم الكامل",
    fPhone: "رقم الهاتف (واتساب)",
    fCity: "المدينة",
    fCityPick: "اختاري المدينة",
    fColor: "اللون",
    fQty: "الكمية",
    total: "المجموع",
    discount: "الخصم",
    submit: "أكّدي الطلب ✅",
    sending: "جارٍ تسجيل الطلب...",
    orWhats: "أو اطلبي عبر واتساب",
    errName: "أدخلي الاسم",
    errPhone: "رقم هاتف غير صحيح (06 أو 07)",
    errCity: "اختاري المدينة",
    doneTitle: "تم تأكيد طلبك! ✅",
    doneMsg: "شكرًا جزيلًا! سنتصل بكِ قريبًا لتأكيد الطلب والتوصيل.",
    doneWhats: "تواصلي معنا على واتساب 💬",
    upsellBadge: "عرض خاص لكِ الآن فقط 🎁",
    upsellTitle: (m: string) => `أضيفي ${m} إلى طلبك`,
    upsellDesc: (pct: number) => `بخصم ${pct}% خاص بكِ الآن — القطعة الثانية بنصف الثمن!`,
    upsellWas: "بدلاً من",
    upsellAdd: "أضيفيها إلى طلبي ✅",
    upsellNo: "لا شكرًا، أكملي بدونها",
    upsellAddedTitle: "تمت الإضافة إلى طلبك! 🎉",
    upsellAddedMsg: "سنؤكد لكِ الموديلين معًا في نفس التوصيل.",
    pieces: (n: number) => (n === 1 ? "قطعة واحدة" : `${n} قطع`),
    dh: "درهم",
  },
  fr: {
    dir: "ltr" as const,
    switch: "ع",
    brand: "Maison d'Or",
    priceNote: "Livraison gratuite 🚚 · Paiement à la réception 💵",
    freeShip: "Livraison gratuite",
    cta: "Commander maintenant 🛒",
    trust1: "Paiement à la réception",
    trust2: "Livraison gratuite partout au Maroc",
    trust3: "Qualité garantie",
    qtyDiscount: (pct: number) => `🎉 -${pct}% sur chaque pièce dès la 2ᵉ !`,
    whyTitle: "Pourquoi cet ensemble ?",
    why: [
      ["✨", "Plaqué or résistant", "Reste comme neuf, ne ternit pas"],
      ["💎", "Design exclusif", "Un modèle qui vous distingue"],
      ["🎁", "Cadeau idéal", "Pack complet collier + bracelet en coffret"],
      ["🚚", "Livraison gratuite", "Partout au Maroc, paiement à la réception"],
    ],
    galleryTitle: "Découvrez les détails",
    reviewsTitle: "Elles ont adoré 💛",
    reviews: [
      ["Sara . Casablanca", "⭐⭐⭐⭐⭐", "Très joli ! La qualité est top et la livraison rapide 🥰"],
      ["Imane . Marrakech", "⭐⭐⭐⭐⭐", "Service impeccable, payé à la réception. Je recommande ✨"],
      ["Yasmine . Rabat", "⭐⭐⭐⭐⭐", "Le modèle est magnifique et l'éclat incroyable 💛"],
    ],
    formTitle: "Finalisez votre commande",
    formSub: "Remplissez vos infos, on vous contacte pour confirmer la commande",
    fName: "Nom complet",
    fPhone: "Téléphone (WhatsApp)",
    fCity: "Ville",
    fCityPick: "Choisissez votre ville",
    fColor: "Couleur",
    fQty: "Quantité",
    total: "Total",
    discount: "Réduction",
    submit: "Confirmer la commande ✅",
    sending: "Enregistrement...",
    orWhats: "ou commander via WhatsApp",
    errName: "Entrez votre nom",
    errPhone: "Numéro invalide (06 ou 07)",
    errCity: "Choisissez votre ville",
    doneTitle: "Commande confirmée ! ✅",
    doneMsg: "Merci beaucoup ! On vous appelle très vite pour confirmer la commande et la livraison.",
    doneWhats: "Contactez-nous sur WhatsApp 💬",
    upsellBadge: "Offre spéciale, maintenant seulement 🎁",
    upsellTitle: (m: string) => `Ajoutez aussi ${m}`,
    upsellDesc: (pct: number) => `Avec ${pct}% de réduction rien que pour vous — la 2ᵉ pièce à moitié prix !`,
    upsellWas: "au lieu de",
    upsellAdd: "Ajouter à ma commande ✅",
    upsellNo: "Non merci, continuer",
    upsellAddedTitle: "Ajouté à votre commande ! 🎉",
    upsellAddedMsg: "On vous confirmera les deux modèles ensemble, dans la même livraison.",
    pieces: (n: number) => (n === 1 ? "1 pièce" : `${n} pièces`),
    dh: "DH",
  },
};

export default function ModelLP({ model }: { model: Model }) {
  const [lang, setLang] = useState<Lang>("ar");
  const t = DICT[lang];
  const dir = t.dir;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [color, setColor] = useState(model.colors[0].key);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState("");
  const [upsell, setUpsell] = useState<"offer" | "adding" | "added" | "declined">("offer");

  const activeColor = model.colors.find((c) => c.key === color) || model.colors[0];
  const heroImg = activeColor.img || model.hero;

  const gross = qty * model.price;
  const qtyDisc = EXTRA_ITEM_DISCOUNT * Math.max(0, qty - 1); // -30 DH par article dès le 2e
  const total = gross - qtyDisc;
  const qtyPct = model.qtyPct; // % communiqué (Swan 21, Tulip 20)

  const up = model.upsell;
  const upsellPrice = Math.round(up.price * (1 - UPSELL_PCT / 100));
  const upsellPct = UPSELL_PCT;

  const scrollToForm = () => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });

  const waLink = () => {
    const msg =
      lang === "ar"
        ? `مرحبًا! أودّ طلب ${model.nameAr} ${model.emoji}\nالاسم: ${name || "-"}\nالمدينة: ${city || "-"}\nاللون: ${color}\nالكمية: ${qty}`
        : `Bonjour ! Je veux commander ${model.nameFr} ${model.emoji}\nNom: ${name || "-"}\nVille: ${city || "-"}\nCouleur: ${color}\nQté: ${qty}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  const fbqTrack = (value: number, product: string, items: number) => {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof window !== "undefined" && w.fbq) {
      w.fbq("track", "Purchase", { value, currency: "MAD", content_name: product, content_type: "product", num_items: items });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr(t.errName);
    const norm = phone.replace(/\s+/g, "").replace(/^\+?212/, "0");
    if (!/^0[67]\d{8}$/.test(norm)) return setErr(t.errPhone);
    if (!city) return setErr(t.errCity);

    setStatus("sending");
    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: norm, city, color, qty,
          product: model.nameFr, model: model.id,
          price: model.price, delivery: 0, subtotal: gross, discount: qtyDisc, total, lang,
        }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "err");
      fbqTrack(total, model.nameFr, qty);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("idle");
      setErr(lang === "ar" ? "وقع مشكل، عاودي حاولي" : "Une erreur est survenue, réessayez");
    }
  };

  const addUpsell = async () => {
    setUpsell("adding");
    const norm = phone.replace(/\s+/g, "").replace(/^\+?212/, "0");
    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: norm, city, color: "", qty: 1,
          product: `${up.nameFr} (UPSELL -${UPSELL_PCT}%)`, model: up.id,
          price: upsellPrice, delivery: 0, subtotal: upsellPrice, total: upsellPrice, lang,
        }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error();
      fbqTrack(upsellPrice, up.nameFr, 1);
      setUpsell("added");
    } catch {
      setUpsell("offer");
    }
  };

  const Price = ({ v }: { v: number }) => <>{v} {t.dh}</>;

  return (
    <div dir={dir} className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-[var(--cream)]/90 backdrop-blur border-b border-[#e7ddca]">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <span className="font-display text-xl font-extrabold gold-text">{t.brand}</span>
          <button onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className="rounded-full border border-[var(--gold)] px-4 py-1.5 text-sm font-bold text-[var(--gold-dark)] hover:bg-[var(--gold)] hover:text-white transition">
            {t.switch}
          </button>
        </div>
      </header>

      {status === "done" ? (
        <section className="mx-auto max-w-xl px-4 py-16 text-center fade-up">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-extrabold mb-2">{t.doneTitle}</h1>
          <p className="text-[#5b5346] mb-8">{t.doneMsg}</p>

          {/* UPSELL */}
          {upsell !== "added" ? (
            <div className="rounded-3xl border-2 border-[var(--gold)] bg-white p-5 text-start shadow-xl">
              <div className="mb-3 inline-block rounded-full gold-bg px-3 py-1 text-xs font-bold text-white">{t.upsellBadge}</div>
              <div className="flex items-center gap-4">
                <img src={img(up.img, 200)} alt={up.nameFr} className="h-24 w-24 rounded-2xl object-cover shadow" />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-extrabold">{up.emoji} {t.upsellTitle(lang === "ar" ? up.nameAr : up.nameFr)}</h3>
                  <p className="text-sm text-[#6b6353] mb-2">{t.upsellDesc(upsellPct)}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-black text-red-600">-{upsellPct}%</span>
                    <span className="text-sm text-[#9a9285] line-through">{up.price} {t.dh}</span>
                    <span className="font-display text-2xl font-black gold-text"><Price v={upsellPrice} /></span>
                  </div>
                </div>
              </div>
              <button onClick={addUpsell} disabled={upsell === "adding"}
                className="mt-4 w-full rounded-full gold-bg py-3.5 text-lg font-bold text-white shadow-lg disabled:opacity-60">
                {upsell === "adding" ? "..." : t.upsellAdd}
              </button>
              <button onClick={() => setUpsell("declined")} className="mt-2 w-full text-sm font-bold text-[#8a8172]">{t.upsellNo}</button>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-green-400 bg-green-50 p-6 fade-up">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-display text-xl font-extrabold text-green-800">{t.upsellAddedTitle}</h3>
              <p className="text-sm text-green-700">{t.upsellAddedMsg}</p>
            </div>
          )}

          <a href={waLink()} target="_blank" className="mt-8 inline-block rounded-full bg-[#25D366] px-8 py-4 text-lg font-bold text-white shadow-lg">{t.doneWhats}</a>
        </section>
      ) : (
        <>
          {/* hero */}
          <section className="mx-auto max-w-5xl px-4 pt-8 pb-6">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="fade-up order-2 md:order-1">
                <span className="inline-block rounded-full gold-bg px-4 py-1.5 text-sm font-bold text-white mb-4">{model.emoji} {lang === "ar" ? model.nameAr.split("·")[0] : model.nameFr.split("·")[0]}</span>
                <h1 className="font-display text-4xl md:text-5xl font-black leading-tight mb-4">{lang === "ar" ? model.nameAr : model.nameFr}</h1>
                <p className="text-lg text-[#5b5346] mb-6">{lang === "ar" ? model.subAr : model.subFr}</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-4xl font-black gold-text"><Price v={model.price} /></span>
                  <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">🚚 {t.freeShip}</span>
                </div>
                <p className="text-sm text-[#8a8172] mb-3">{t.priceNote}</p>
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-sm font-bold text-green-700">{t.qtyDiscount(model.qtyPct)}</div>
                <button onClick={scrollToForm} className="cta-pulse inline-block rounded-full gold-bg px-8 py-4 text-lg font-bold text-white shadow-xl">{t.cta}</button>
              </div>
              <div className="order-1 md:order-2 fade-up">
                <img src={img(heroImg, 900)} alt={model.nameFr} className="w-full rounded-3xl shadow-2xl aspect-square object-cover" />
                <div className="mt-3 flex justify-center gap-2">
                  {model.colors.map((c) => (
                    <button key={c.key} onClick={() => setColor(c.key)}
                      className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${color === c.key ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/30" : "border-[#e3d9c6]"}`}>
                      <img src={img(c.img, 200)} alt={c.key} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* trust */}
          <section className="border-y border-[#e7ddca] bg-white/60">
            <div className="mx-auto max-w-5xl grid grid-cols-3 gap-2 px-4 py-5 text-center">
              {[["💵", t.trust1], ["🚚", t.trust2], ["✅", t.trust3]].map(([e, txt], i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{e}</span>
                  <span className="text-xs md:text-sm font-bold text-[#5b5346]">{txt}</span>
                </div>
              ))}
            </div>
          </section>

          {/* why */}
          <section className="mx-auto max-w-5xl px-4 py-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-center mb-8">{t.whyTitle}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.why.map(([e, ti, de], i) => (
                <div key={i} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm border border-[#f0e8d8]">
                  <span className="text-3xl">{e}</span>
                  <div><h3 className="font-display font-bold text-lg">{ti}</h3><p className="text-sm text-[#6b6353]">{de}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* gallery */}
          <section className="mx-auto max-w-5xl px-4 py-6">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-center mb-6">{t.galleryTitle}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {model.gallery.map((src, i) => (
                <img key={i} src={img(src, 600)} alt={`${model.id} ${i}`} className="aspect-square w-full rounded-2xl object-cover shadow-sm" />
              ))}
            </div>
          </section>

          {/* reviews */}
          <section className="mx-auto max-w-5xl px-4 py-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-center mb-8">{t.reviewsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {t.reviews.map(([who, stars, txt], i) => (
                <div key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-[#f0e8d8]">
                  <div className="text-sm mb-2">{stars}</div>
                  <p className="text-[#4a4436] mb-3">{txt}</p>
                  <span className="text-xs font-bold text-[var(--gold-dark)]">{who}</span>
                </div>
              ))}
            </div>
          </section>

          {/* order form */}
          <section id="order" className="bg-white/70 border-t border-[#e7ddca] py-14 scroll-mt-16">
            <div className="mx-auto max-w-lg px-4">
              <h2 className="font-display text-3xl font-black text-center mb-1">{t.formTitle}</h2>
              <p className="text-center text-[#6b6353] mb-6">{t.formSub}</p>

              <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[var(--cream)] p-3 border border-[#f0e8d8]">
                <img src={img(heroImg, 200)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-display font-bold">{model.emoji} {lang === "ar" ? model.nameAr.split("·")[0] : model.nameFr.split("·")[0]}</div>
                  <div className="text-sm text-[#8a8172]">{t.pieces(qty)} · {lang === "ar" ? activeColor.ar : activeColor.fr}</div>
                </div>
                <div className="font-display text-xl font-black gold-text"><Price v={total} /></div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <input className="field" placeholder={t.fName} value={name} onChange={(e) => setName(e.target.value)} />
                <input className="field" type="tel" inputMode="tel" placeholder={t.fPhone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <select className="field" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">{t.fCityPick}</option>
                  {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#6b6353]">{t.fColor}</label>
                  <div className="flex flex-wrap gap-2">
                    {model.colors.map((c) => (
                      <button type="button" key={c.key} onClick={() => setColor(c.key)}
                        className={`flex items-center gap-2 rounded-2xl border-2 p-1.5 pe-3 text-sm font-bold transition ${color === c.key ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-[#e3d9c6] bg-white"}`}>
                        <img src={img(c.img, 120)} alt="" className="h-9 w-9 rounded-lg object-cover" />
                        {lang === "ar" ? c.ar : c.fr}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#6b6353]">{t.fQty}</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 rounded-full border border-[#e3d9c6] bg-white text-xl font-bold">−</button>
                    <span className="w-8 text-center font-display text-xl font-black">{qty}</span>
                    <button type="button" onClick={() => setQty(Math.min(5, qty + 1))} className="h-11 w-11 rounded-full border border-[#e3d9c6] bg-white text-xl font-bold">+</button>
                  </div>
                  <p className="mt-2 text-sm font-bold text-green-700">{t.qtyDiscount(qtyPct)}</p>
                </div>

                {err && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">{err}</p>}

                <div className="rounded-2xl bg-[var(--cream)] px-4 py-3 border border-[#f0e8d8] space-y-1.5 text-sm">
                  {qtyDisc > 0 && (
                    <div className="flex justify-between font-bold text-green-700">
                      <span>{t.discount} (-{qtyPct}% × {qty - 1})</span>
                      <span>−{qtyDisc} {t.dh}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-[#e7ddca] pt-1.5">
                    <div>
                      <span className="font-bold text-base">{t.total}</span>
                      <span className="ms-2 text-xs font-bold text-green-700">🚚 {t.freeShip}</span>
                    </div>
                    <span className="font-display text-2xl font-black gold-text"><Price v={total} /></span>
                  </div>
                </div>

                <button type="submit" disabled={status === "sending"}
                  className="w-full rounded-full gold-bg py-4 text-lg font-bold text-white shadow-xl disabled:opacity-60">
                  {status === "sending" ? t.sending : t.submit}
                </button>
              </form>

              <div className="mt-4 text-center">
                <a href={waLink()} target="_blank" className="text-sm font-bold text-[#25a34e] underline">{t.orWhats}</a>
              </div>
            </div>
          </section>

          <footer className="py-8 text-center text-sm text-[#8a8172]">© {new Date().getFullYear()} Maison d&apos;Or · {t.trust1}</footer>

          {/* CTA collant en bas */}
          <div dir={dir} className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e7ddca] bg-white/95 backdrop-blur px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-auto flex max-w-lg items-center gap-2">
              <a href={waLink()} target="_blank" aria-label="WhatsApp"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9 1 1-4.8-.3-.4C5.5 18.6 5 16.8 5 15 5 9 10 4 16 4s11 5 11 11-5 10-11 10zm6.1-7.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3c-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6s-.8-1.9-1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2.9 3 1 4.1.9.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>
              </a>
              <button onClick={scrollToForm} className="flex flex-1 items-center justify-between rounded-full gold-bg px-5 py-3 text-white shadow-lg">
                <span className="font-bold">{t.cta}</span>
                <span className="font-display font-black">{model.price} {t.dh}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

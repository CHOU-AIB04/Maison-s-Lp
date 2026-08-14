"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/catalog";

type Status = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: string;
  orderNum?: string;
  status: Status;
  date: string;
  name: string;
  phone: string;
  city: string;
  product: string;
  variant?: string;
  color?: string;
  image?: string;
  items?: { name: string; variant?: string; quantity: number; price?: number; image?: string }[];
  qty: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  total: number;
  model?: string;
  source?: string;
  utmSource?: string;
  utmContent?: string;
  utm?: Record<string, string>;
};

const STATUSES: { value: Status; label: string; fg: string; bg: string; dot: string }[] = [
  { value: "new", label: "Nouvelle", fg: "#1d4ed8", bg: "#eff6ff", dot: "#3b82f6" },
  { value: "confirmed", label: "Confirmée", fg: "#0f766e", bg: "#f0fdfa", dot: "#14b8a6" },
  { value: "shipped", label: "Expédiée", fg: "#b45309", bg: "#fffbeb", dot: "#f59e0b" },
  { value: "delivered", label: "Livrée", fg: "#15803d", bg: "#f0fdf4", dot: "#22c55e" },
  { value: "cancelled", label: "Annulée", fg: "#b91c1c", bg: "#fef2f2", dot: "#ef4444" },
];
const meta = (s: Status) => STATUSES.find((x) => x.value === s) || STATUSES[0];
const money = (n: number) => `${Math.round(n || 0).toLocaleString("fr-FR")} DH`;
const waLink = (p: string) => `https://wa.me/212${(p || "").replace(/^0/, "")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default function AdminApp({ apiKey, onLogout }: { apiKey: string; onLogout?: () => void }) {
  const k = apiKey;
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [auth, setAuth] = useState<"loading" | "ok" | "denied">("loading");
  const [tab, setTab] = useState<"commandes" | "dashboard" | "simulation">("commandes");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [busy, setBusy] = useState("");

  const load = () => {
    fetch(`/api/orders?k=${encodeURIComponent(k)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => { setOrders(j.orders || []); setAuth("ok"); })
      .catch(() => setAuth("denied"));
  };
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  const setStatus = async (id: string, status: Status) => {
    setBusy(id);
    setOrders((o) => o?.map((x) => (x.id === id ? { ...x, status } : x)) || o);
    try {
      await fetch(`/api/orders?k=${encodeURIComponent(k)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } finally {
      setBusy("");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette commande ?")) return;
    setBusy(id);
    setOrders((o) => o?.filter((x) => x.id !== id) || o);
    try {
      await fetch(`/api/orders?k=${encodeURIComponent(k)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } finally {
      setBusy("");
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length || 0 };
    STATUSES.forEach((s) => (c[s.value] = orders?.filter((o) => o.status === s.value).length || 0));
    return c;
  }, [orders]);

  const shown = useMemo(
    () => (orders || []).filter((o) => filter === "all" || o.status === filter),
    [orders, filter]
  );

  if (auth === "denied")
    return <div className="p-10 text-center font-bold text-red-600">Accès refusé — clé invalide.</div>;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8" dir="ltr">
      {/* header + tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black gold-text">Admin · Maison d&apos;Or</h1>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-full gold-bg px-4 py-2 text-sm font-bold text-white">↻ Actualiser</button>
          {onLogout && <button onClick={onLogout} className="rounded-full border border-[#e7ddca] bg-white px-4 py-2 text-sm font-bold text-[#6b6353]">Déconnexion</button>}
        </div>
      </div>
      <div className="mb-6 flex gap-2">
        {([["commandes", "📦 Commandes"], ["dashboard", "📊 Dashboard"], ["simulation", "🧮 Simulation"]] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === t ? "gold-bg text-white shadow" : "bg-white text-[#6b6353] border border-[#e7ddca]"}`}>
            {l}{t === "commandes" && counts.new > 0 && <span className="ms-2 rounded-full bg-blue-600 px-2 text-xs text-white">{counts.new}</span>}
          </button>
        ))}
      </div>

      {orders === null ? (
        <div className="p-10 text-center text-[#8a8172]">Chargement…</div>
      ) : tab === "commandes" ? (
        <OrdersPanel orders={shown} counts={counts} filter={filter} setFilter={setFilter} setStatus={setStatus} deleteOrder={deleteOrder} busy={busy} />
      ) : tab === "dashboard" ? (
        <DashboardPanel orders={orders} />
      ) : (
        <SimulationPanel orders={orders} />
      )}
    </div>
  );
}

/* ═══════════════ COMMANDES ═══════════════ */
function OrdersPanel({ orders, counts, filter, setFilter, setStatus, deleteOrder, busy }: {
  orders: Order[]; counts: Record<string, number>;
  filter: "all" | Status; setFilter: (f: "all" | Status) => void;
  setStatus: (id: string, s: Status) => void; deleteOrder: (id: string) => void; busy: string;
}) {
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")} label={`Toutes (${counts.all})`} />
        {STATUSES.map((s) => (
          <Chip key={s.value} active={filter === s.value} onClick={() => setFilter(s.value)}
            label={`${s.label} (${counts[s.value]})`} dot={s.dot} />
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#f0e8d8] bg-white p-12 text-center text-[#8a8172]">
          <div className="mb-2 text-4xl">🛍️</div>Aucune commande {filter !== "all" ? "dans ce statut" : "pour le moment"}.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const m = meta(o.status);
            return (
              <div key={o.id} className="rounded-2xl border border-[#f0e8d8] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ color: m.fg, background: m.bg }}>● {m.label}</span>
                      <span className="text-xs text-[#8a8172]">{fmtDate(o.date)}</span>
                      <span className="text-xs font-mono text-[#b3aa98]">{o.orderNum || o.id}</span>
                    </div>
                    <div className="mt-1.5 font-display text-lg font-bold">{o.name}</div>
                    <div className="text-sm text-[#6b6353]">
                      <a href={waLink(o.phone)} target="_blank" className="font-bold text-[#25a34e] underline">{o.phone}</a>
                      {" · "}{o.city}
                    </div>
                    {o.items && o.items.length ? (
                      <div className="mt-2 space-y-1.5">
                        {o.items.map((it, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {it.image ? <img src={it.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" /> : null}
                            <span className="text-sm"><span className="font-bold">{it.name}</span>{it.variant ? <span className="text-[#8a8172]"> · {it.variant}</span> : null}<span className="text-[#8a8172]"> · ×{it.quantity}</span></span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        {o.image ? <img src={o.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" /> : null}
                        <span><span className="font-bold">{o.product}</span>{o.variant ? <span className="text-[#8a8172]"> · {o.variant}</span> : null}<span className="text-[#8a8172]"> · ×{o.qty}</span></span>
                      </div>
                    )}
                    {(() => {
                      const u = o.utm || {};
                      const parts = [
                        u.utm_source && `src: ${u.utm_source}`,
                        u.utm_campaign && `camp: ${u.utm_campaign}`,
                        (u.campaign_id || u.utm_id) && `camp_id: ${u.campaign_id || u.utm_id}`,
                        u.adset_id && `adset: ${u.adset_id}`,
                        (u.ad_id || u.utm_content || o.utmContent) && `ad: ${u.ad_id || u.utm_content || o.utmContent}`,
                      ].filter(Boolean);
                      if (!parts.length && o.source) parts.push(`src: ${o.source}`);
                      return parts.length ? (
                        <div className="mt-1 break-all font-mono text-[11px] text-[#b3aa98]">{parts.join(" · ")}</div>
                      ) : null;
                    })()}
                  </div>
                  <div className="text-end">
                    <div className="font-display text-xl font-black gold-text">{money(o.total)}</div>
                    {o.discount ? <div className="text-xs font-bold text-green-700">remise −{money(o.discount)}</div> : null}
                  </div>
                </div>
                {/* actions statut */}
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#f3ecdd] pt-3">
                  {STATUSES.map((s) => (
                    <button key={s.value} disabled={busy === o.id || o.status === s.value}
                      onClick={() => setStatus(o.id, s.value)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-100 ${o.status === s.value ? "ring-1" : "border border-[#e7ddca] bg-white hover:bg-[var(--cream)]"}`}
                      style={o.status === s.value ? { color: s.fg, background: s.bg } : {}}>
                      {s.label}
                    </button>
                  ))}
                  <button disabled={busy === o.id} onClick={() => deleteOrder(o.id)}
                    className="ms-auto rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50">
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Chip({ active, onClick, label, dot }: { active: boolean; onClick: () => void; label: string; dot?: string }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${active ? "gold-bg text-white" : "bg-white text-[#6b6353] border border-[#e7ddca]"}`}>
      {dot && <span className="h-2 w-2 rounded-full" style={{ background: active ? "#fff" : dot }} />}
      {label}
    </button>
  );
}

/* ═══════════════ DASHBOARD ═══════════════ */
function DashboardPanel({ orders }: { orders: Order[] }) {
  const active = orders.filter((o) => o.status !== "cancelled");
  const now = Date.now();
  const within = (days: number, o: Order) => now - new Date(o.date).getTime() <= days * 864e5;

  const last7 = active.filter((o) => within(7, o));
  const ca7 = last7.reduce((s, o) => s + (o.total || 0), 0);
  const avg = active.length ? active.reduce((s, o) => s + (o.total || 0), 0) / active.length : 0;
  const toProcess = orders.filter((o) => o.status === "new").length;

  // commandes / jour (14 j, hors annulées)
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now - (13 - i) * 864e5);
    const key = d.toISOString().slice(0, 10);
    return { key, label: `${key.slice(8, 10)}/${key.slice(5, 7)}`, n: active.filter((o) => o.date.slice(0, 10) === key).length };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.n));

  // ventes par produit
  const byProduct = useMemo(() => {
    const m: Record<string, { qty: number; ca: number }> = {};
    active.forEach((o) => {
      const key = o.product || "—";
      m[key] = m[key] || { qty: 0, ca: 0 };
      m[key].qty += o.qty || 0;
      m[key].ca += o.total || 0;
    });
    return Object.entries(m).sort((a, b) => b[1].ca - a[1].ca);
  }, [orders]);

  const byStatus = STATUSES.map((s) => ({ ...s, n: orders.filter((o) => o.status === s.value).length }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Chiffre d'affaires" value={money(ca7)} sub="7 derniers jours · hors annulées" />
        <Kpi label="Commandes" value={String(last7.length)} sub="7 derniers jours" />
        <Kpi label="Panier moyen" value={active.length ? money(avg) : "—"} sub="hors annulées" />
        <Kpi label="À traiter" value={String(toProcess)} sub="commandes nouvelles" accent />
      </div>

      {/* commandes / jour */}
      <div className="rounded-2xl border border-[#f0e8d8] bg-white p-5">
        <h2 className="font-display font-black">Commandes par jour</h2>
        <p className="mb-4 text-sm text-[#8a8172]">14 derniers jours (hors annulées)</p>
        <div className="flex items-end gap-1.5" style={{ height: 140 }}>
          {days.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label} : ${d.n}`}>
              <span className="text-[10px] font-bold text-[#6b6353]">{d.n || ""}</span>
              <div className="w-full rounded-t gold-bg" style={{ height: `${(d.n / maxDay) * 100}%`, minHeight: d.n ? 4 : 2, opacity: d.n ? 1 : 0.25 }} />
              <span className="text-[9px] text-[#b3aa98]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ventes par produit */}
        <div className="rounded-2xl border border-[#f0e8d8] bg-white p-5">
          <h2 className="mb-1 font-display font-black">Ventes par produit</h2>
          <p className="mb-4 text-sm text-[#8a8172]">Classées par CA (hors annulées)</p>
          {byProduct.length === 0 ? (
            <p className="py-6 text-center text-[#8a8172]">Aucune vente pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {byProduct.map(([name, v]) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-[var(--cream)] px-3 py-2">
                  <span className="font-bold">{name}</span>
                  <span className="text-sm text-[#6b6353]">×{v.qty} · <b className="gold-text">{money(v.ca)}</b></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* répartition par statut */}
        <div className="rounded-2xl border border-[#f0e8d8] bg-white p-5">
          <h2 className="mb-4 font-display font-black">Répartition par statut</h2>
          <div className="grid grid-cols-2 gap-2">
            {byStatus.map((s) => (
              <div key={s.value} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: s.bg }}>
                <span className="flex items-center gap-2 text-sm font-bold" style={{ color: s.fg }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.dot }} />{s.label}
                </span>
                <span className="font-display font-black" style={{ color: s.fg }}>{s.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${accent ? "border-[var(--gold)] bg-[var(--gold)]/5" : "border-[#f0e8d8] bg-white"}`}>
      <div className="text-xs font-bold uppercase tracking-wide text-[#8a8172]">{label}</div>
      <div className="font-display text-2xl font-black md:text-3xl">{value}</div>
      <div className="mt-0.5 text-xs text-[#b3aa98]">{sub}</div>
    </div>
  );
}

/* ═══════════════ SIMULATION RENTABILITÉ ═══════════════ */
const SIM_KEY = "mdor_sim";
type SimState = {
  cpa: number; // coût pub Meta par commande (form submit)
  rate: number; // taux de livraison COD en %
  ship: number; // frais de livraison payés par commande livrée
  ret: number; // frais retour par commande non livrée
  target: number; // objectif de profit
  cogs: Record<string, number>; // prix d'achat par produit
  price: Record<string, number>; // prix de vente (override) par produit
};
const SIM_DEFAULT: SimState = { cpa: 40, rate: 65, ship: 25, ret: 10, target: 5000, cogs: {}, price: {} };

function SimNum({ label, value, onChange, suffix, hint }: { label: string; value: number; onChange: (n: number) => void; suffix?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-[#6b6353]">{label}</span>
      <div className="flex items-center rounded-xl border border-[#e3d9c6] bg-white px-3">
        <input type="number" value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent py-2.5 text-sm font-bold outline-none" />
        {suffix && <span className="ms-1 text-xs text-[#8a8172]">{suffix}</span>}
      </div>
      {hint && <span className="mt-0.5 block text-[10px] text-[#b3aa98]">{hint}</span>}
    </label>
  );
}

function SimulationPanel({ orders }: { orders: Order[] }) {
  const [s, setS] = useState<SimState>(SIM_DEFAULT);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIM_KEY);
      if (raw) setS({ ...SIM_DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);
  const save = (next: SimState) => {
    setS(next);
    try { localStorage.setItem(SIM_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const upd = (patch: Partial<SimState>) => save({ ...s, ...patch });

  // CPA réel estimé depuis les commandes livrées (indicatif)
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const money = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} DH`;
  const r = Math.min(1, Math.max(0, s.rate / 100));

  const rows = PRODUCTS.map((p) => {
    const price = s.price[p.slug] ?? p.price;
    const cogs = s.cogs[p.slug] ?? 0;
    const margeLivree = price - cogs - s.ship; // avant pub
    const profitCmd = r * margeLivree - s.cpa - (1 - r) * s.ret; // par commande passée (form)
    const profitVente = r > 0 ? profitCmd / r : profitCmd; // par commande livrée
    const beCPA = r * margeLivree - (1 - r) * s.ret; // CPA max (breakeven)
    const ventes = profitVente > 0 ? Math.ceil(s.target / profitVente) : null;
    const cmds = ventes != null && r > 0 ? Math.ceil(ventes / r) : null;
    const budget = cmds != null ? cmds * s.cpa : null;
    return { p, price, cogs, margeLivree, profitCmd, profitVente, beCPA, ventes, cmds, budget };
  });

  return (
    <div className="space-y-6">
      {/* Paramètres */}
      <div className="rounded-2xl border border-[#f0e8d8] bg-white p-5">
        <h2 className="mb-1 font-display font-black">Paramètres (COD)</h2>
        <p className="mb-4 text-sm text-[#8a8172]">Enregistrés sur ton appareil. {delivered > 0 ? `(${delivered} livrées à ce jour)` : ""}</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SimNum label="Coût pub Meta / commande" value={s.cpa} onChange={(n) => upd({ cpa: n })} suffix="DH" hint="CPA au form submit" />
          <SimNum label="Taux de livraison" value={s.rate} onChange={(n) => upd({ rate: n })} suffix="%" hint="commandes livrées / passées" />
          <SimNum label="Frais livraison" value={s.ship} onChange={(n) => upd({ ship: n })} suffix="DH" hint="payé par commande livrée" />
          <SimNum label="Frais retour" value={s.ret} onChange={(n) => upd({ ret: n })} suffix="DH" hint="colis non livré" />
        </div>
      </div>

      {/* Table produits */}
      <div className="overflow-x-auto rounded-2xl border border-[#f0e8d8] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[var(--cream)] text-left text-[#6b6353]">
            <tr>
              <th className="p-3">Produit</th>
              <th className="p-3">Prix vente</th>
              <th className="p-3">Prix achat</th>
              <th className="p-3">Marge/livrée</th>
              <th className="p-3">CPA max</th>
              <th className="p-3">Profit/commande</th>
              <th className="p-3">Profit/vente</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, price, cogs, margeLivree, profitCmd, profitVente, beCPA }) => (
              <tr key={p.slug} className="border-t border-[#f3ecdd]">
                <td className="p-3 font-bold">{p.name.fr}</td>
                <td className="p-3">
                  <input type="number" value={price} onChange={(e) => upd({ price: { ...s.price, [p.slug]: parseFloat(e.target.value) || 0 } })}
                    className="w-20 rounded-lg border border-[#e3d9c6] px-2 py-1 font-bold" />
                </td>
                <td className="p-3">
                  <input type="number" placeholder="0" value={s.cogs[p.slug] ?? ""} onChange={(e) => upd({ cogs: { ...s.cogs, [p.slug]: parseFloat(e.target.value) || 0 } })}
                    className="w-20 rounded-lg border border-[#e3d9c6] px-2 py-1 font-bold" />
                </td>
                <td className="p-3">{money(margeLivree)}</td>
                <td className="p-3 font-bold" style={{ color: beCPA > 0 ? "#15803d" : "#b91c1c" }}>{money(beCPA)}</td>
                <td className="p-3 font-black" style={{ color: profitCmd >= 0 ? "#15803d" : "#b91c1c" }}>{money(profitCmd)}</td>
                <td className="p-3 font-black" style={{ color: profitVente >= 0 ? "#15803d" : "#b91c1c" }}>{cogs ? money(profitVente) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#8a8172]">
        <b>Marge/livrée</b> = prix − achat − livraison · <b>CPA max</b> = ce que tu peux payer Meta/commande sans perdre · <b>Profit/commande</b> = net par form rempli (pub incluse, non-livrées déduites) · <b>Profit/vente</b> = net par commande livrée.
      </p>

      {/* Objectif */}
      <div className="rounded-2xl border-2 border-[var(--gold)] bg-white p-5">
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <div className="w-40">
            <SimNum label="🎯 Objectif de profit" value={s.target} onChange={(n) => upd({ target: n })} suffix="DH" />
          </div>
          <span className="pb-2 text-sm text-[#8a8172]">→ combien vendre par produit :</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {rows.map(({ p, profitVente, ventes, cmds, budget }) => (
            <div key={p.slug} className="rounded-xl bg-[var(--cream)] p-3">
              <div className="font-bold">{p.name.fr}</div>
              {profitVente > 0 && ventes != null ? (
                <div className="mt-1 text-sm text-[#4a4436]">
                  <div><b className="gold-text">{ventes}</b> ventes livrées</div>
                  <div className="text-xs text-[#8a8172]">≈ {cmds} commandes · budget pub ≈ {money(budget || 0)}</div>
                </div>
              ) : (
                <div className="mt-1 text-sm font-bold text-red-600">Non rentable (remplis prix d&apos;achat / baisse CPA)</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


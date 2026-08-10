"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
  qty: number;
  subtotal?: number;
  discount?: number;
  delivery?: number;
  total: number;
  model?: string;
  source?: string;
  utmSource?: string;
  utmContent?: string;
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

function Admin() {
  const params = useSearchParams();
  const k = params.get("k") || "";
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [auth, setAuth] = useState<"loading" | "ok" | "denied">("loading");
  const [tab, setTab] = useState<"commandes" | "dashboard">("commandes");
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
        <button onClick={load} className="rounded-full gold-bg px-4 py-2 text-sm font-bold text-white">↻ Actualiser</button>
      </div>
      <div className="mb-6 flex gap-2">
        {([["commandes", "📦 Commandes"], ["dashboard", "📊 Dashboard"]] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === t ? "gold-bg text-white shadow" : "bg-white text-[#6b6353] border border-[#e7ddca]"}`}>
            {l}{t === "commandes" && counts.new > 0 && <span className="ms-2 rounded-full bg-blue-600 px-2 text-xs text-white">{counts.new}</span>}
          </button>
        ))}
      </div>

      {orders === null ? (
        <div className="p-10 text-center text-[#8a8172]">Chargement…</div>
      ) : tab === "commandes" ? (
        <OrdersPanel orders={shown} counts={counts} filter={filter} setFilter={setFilter} setStatus={setStatus} busy={busy} />
      ) : (
        <DashboardPanel orders={orders} />
      )}
    </div>
  );
}

/* ═══════════════ COMMANDES ═══════════════ */
function OrdersPanel({ orders, counts, filter, setFilter, setStatus, busy }: {
  orders: Order[]; counts: Record<string, number>;
  filter: "all" | Status; setFilter: (f: "all" | Status) => void;
  setStatus: (id: string, s: Status) => void; busy: string;
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
                    <div className="mt-1 text-sm">
                      <span className="font-bold">{o.product}</span>
                      {o.variant && <span className="text-[#8a8172]"> · {o.variant}</span>}
                      <span className="text-[#8a8172]"> · ×{o.qty}</span>
                    </div>
                    {(o.utmContent || o.source) && (
                      <div className="mt-1 text-xs text-[#b3aa98]">src: {o.source || "—"}{o.utmContent ? ` · ad ${o.utmContent}` : ""}</div>
                    )}
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

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement…</div>}>
      <Admin />
    </Suspense>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Order = {
  date: string;
  name: string;
  phone: string;
  city: string;
  color: string;
  qty: number;
  total: number;
  delivery?: number;
  product: string;
  model?: string;
  lang: string;
  utmSource?: string;
  utmContent?: string;
};

function Dashboard() {
  const params = useSearchParams();
  const k = params.get("k") || "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

  const load = () => {
    fetch(`/api/orders?k=${encodeURIComponent(k)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        setOrders(j.orders || []);
        setStatus("ok");
      })
      .catch(() => setStatus("denied"));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  if (status === "denied")
    return <div className="p-10 text-center text-red-600 font-bold">Accès refusé — clé invalide.</div>;

  const totalMAD = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8" dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-2xl font-black gold-text">Commandes · Maison d&apos;Or</h1>
        <button onClick={load} className="rounded-full gold-bg px-4 py-2 text-sm font-bold text-white">↻ Actualiser</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e8d8]">
          <div className="text-xs text-[#8a8172]">Commandes</div>
          <div className="font-display text-3xl font-black">{orders.length}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e8d8]">
          <div className="text-xs text-[#8a8172]">CA potentiel</div>
          <div className="font-display text-3xl font-black gold-text">{totalMAD} DH</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e8d8]">
          <div className="text-xs text-[#8a8172]">Pièces</div>
          <div className="font-display text-3xl font-black">{orders.reduce((s, o) => s + (o.qty || 0), 0)}</div>
        </div>
      </div>

      {status === "loading" ? (
        <div className="p-10 text-center text-[#8a8172]">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="p-10 text-center text-[#8a8172]">Aucune commande pour l&apos;instant.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#f0e8d8] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[var(--cream)] text-left">
              <tr className="text-[#6b6353]">
                <th className="p-3">Date</th><th className="p-3">Nom</th><th className="p-3">Téléphone</th>
                <th className="p-3">Modèle</th><th className="p-3">Ville</th><th className="p-3">Couleur</th><th className="p-3">Qté</th><th className="p-3">Total</th><th className="p-3">Source</th><th className="p-3">Créa</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-[#f3ecdd]">
                  <td className="p-3 whitespace-nowrap text-[#8a8172]">{new Date(o.date).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3 font-bold">{o.name}</td>
                  <td className="p-3"><a href={`https://wa.me/212${o.phone.replace(/^0/, "")}`} target="_blank" className="text-[#25a34e] font-bold underline">{o.phone}</a></td>
                  <td className="p-3">{o.model === "tulip" ? "🌷 Tulip" : "🦢 Swan"}</td>
                  <td className="p-3">{o.city}</td>
                  <td className="p-3">{o.color}</td>
                  <td className="p-3 text-center">{o.qty}</td>
                  <td className="p-3 font-bold">{o.total} DH</td>
                  <td className="p-3 text-xs text-[#8a8172]">{o.utmSource || "—"}</td>
                  <td className="p-3 text-xs text-[#8a8172]">{o.utmContent || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement…</div>}>
      <Dashboard />
    </Suspense>
  );
}

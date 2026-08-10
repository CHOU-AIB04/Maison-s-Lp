"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminApp from "@/components/AdminApp";

/** Compat : /commandes?k=<clé> pointe vers le même admin que /admin. */
function Legacy() {
  const k = useSearchParams().get("k") || "";
  if (!k)
    return (
      <div className="p-10 text-center text-[#8a8172]">
        Accès admin : <a className="font-bold gold-text underline" href="/admin">/admin</a>
      </div>
    );
  return <AdminApp apiKey={k} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement…</div>}>
      <Legacy />
    </Suspense>
  );
}

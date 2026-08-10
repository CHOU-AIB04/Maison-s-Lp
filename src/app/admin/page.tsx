"use client";

import { useEffect, useState } from "react";
import AdminApp from "@/components/AdminApp";

const LS_KEY = "mdor_admin_key";

export default function AdminPage() {
  const [key, setKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (saved) setKey(saved);
    setReady(true);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setChecking(true);
    try {
      const r = await fetch(`/api/orders?k=${encodeURIComponent(pw)}`);
      if (r.ok) {
        localStorage.setItem(LS_KEY, pw);
        setKey(pw);
      } else {
        setErr("Mot de passe incorrect.");
      }
    } catch {
      setErr("Erreur réseau, réessayez.");
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setKey(null);
    setPw("");
  };

  if (!ready) return null;

  if (!key) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-[#f0e8d8] bg-white p-8 shadow-lg">
          <div className="mb-1 text-center font-display text-2xl font-black gold-text">Maison d&apos;Or</div>
          <div className="mb-6 text-center text-sm text-[#8a8172]">Espace administration</div>
          <input
            type="password"
            className="field"
            placeholder="Mot de passe"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          {err && <p className="mt-2 text-sm font-bold text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={checking || !pw}
            className="mt-4 w-full rounded-full gold-bg py-3 font-bold text-white shadow disabled:opacity-60"
          >
            {checking ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    );
  }

  return <AdminApp apiKey={key} onLogout={logout} />;
}

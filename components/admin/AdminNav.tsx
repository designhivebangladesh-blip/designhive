"use client";

import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between border-b border-gold-400/15 pb-6">
      <div>
        <p className="font-display text-lg font-semibold text-parchment">
          Designhive Admin
        </p>
        <p className="text-xs text-parchment/50">Business, workflow & site admin</p>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-full border border-gold-400/25 px-4 py-2 text-xs font-semibold text-parchment/80 hover:text-parchment"
      >
        Sign out
      </button>
    </div>
  );
}

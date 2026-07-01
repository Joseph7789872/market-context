"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserWatchlist } from "@/lib/types";

const labels: Array<{ key: keyof UserWatchlist["alertPreferences"]; label: string }> = [
  { key: "filings", label: "Filings" },
  { key: "earnings", label: "Earnings" },
  { key: "xContext", label: "X Context" }
];

export function AlertToggles({
  companyId,
  initialPreferences
}: {
  companyId: string;
  initialPreferences: UserWatchlist["alertPreferences"];
}) {
  const router = useRouter();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  async function toggle(key: keyof UserWatchlist["alertPreferences"]) {
    const next = { ...preferences, [key]: !preferences[key] };
    setPendingKey(key);

    try {
      const response = await fetch(`/api/watchlist/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertPreferences: next })
      });

      if (!response.ok) throw new Error("Request failed");
      setPreferences(next);
      router.refresh();
    } catch {
      // Leave preferences in their previous state; the user can retry.
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div className="reaction-grid">
      {labels.map(({ key, label }) => (
        <button
          className="reaction"
          type="button"
          key={key}
          onClick={() => toggle(key)}
          disabled={pendingKey === key}
        >
          <span>{label}</span>
          <strong>{preferences[key] ? "On" : "Off"}</strong>
        </button>
      ))}
    </div>
  );
}

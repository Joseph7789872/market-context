"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "./icons";

export function WatchButton({
  companyId,
  initialWatching,
  isAuthenticated,
  redirectTo
}: {
  companyId: string;
  initialWatching: boolean;
  isAuthenticated: boolean;
  redirectTo: string;
}) {
  const router = useRouter();
  const [watching, setWatching] = useState(initialWatching);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      return;
    }

    setPending(true);
    const nextWatching = !watching;

    try {
      const response = nextWatching
        ? await fetch("/api/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyId })
          })
        : await fetch(`/api/watchlist/${companyId}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Request failed");
      setWatching(nextWatching);
      router.refresh();
    } catch {
      // Leave the button in its previous state; the user can retry.
    } finally {
      setPending(false);
    }
  }

  return (
    <button className="button primary" type="button" onClick={handleClick} disabled={pending}>
      <Icons.Star size={15} />
      {watching ? "Watching" : "Watch"}
    </button>
  );
}

"use client";

import { TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <Topbar title="Something went wrong" subtitle="MarketContext hit an unexpected error." />
      <section className="content">
        <div className="detail-panel empty">
          <TriangleAlert size={28} className="down" />
          <h2>We couldn&apos;t load this page</h2>
          <p className="summary">
            {error.message || "An unexpected error occurred while rendering this view."}
          </p>
          <button className="button primary" type="button" onClick={reset}>
            Try again
          </button>
        </div>
      </section>
    </AppShell>
  );
}

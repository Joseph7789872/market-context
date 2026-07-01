import Link from "next/link";
import { Compass } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";

export default function NotFound() {
  return (
    <AppShell>
      <Topbar title="Page not found" subtitle="This route doesn't exist in MarketContext." />
      <section className="content">
        <div className="detail-panel empty">
          <Compass size={28} className="muted" />
          <h2>404 — Nothing here</h2>
          <p className="summary">The page you're looking for was moved, renamed, or never existed.</p>
          <Link className="button primary" href="/">
            Back to Live Feed
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

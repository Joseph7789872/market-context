import { AppShell } from "@/components/app-shell";
import { AuthStatus } from "@/components/auth-status";
import { Icons } from "@/components/icons";
import { Topbar } from "@/components/topbar";

const trustedClusters = [
  "Official company accounts",
  "Executives",
  "Financial journalists",
  "Analysts",
  "Major investors",
  "Sector specialists"
];

export default function SettingsPage() {
  return (
    <AppShell active="Settings" authSlot={<AuthStatus />}>
      <Topbar title="Settings" subtitle="Source policy and alert defaults." />
      <section className="content">
        <div className="detail-grid">
          <article className="detail-panel">
            <h2>Trust Defaults</h2>
            <div className="reaction-grid">
              <div className="reaction">
                <span>Market events</span>
                <strong>Trusted source first</strong>
              </div>
              <div className="reaction">
                <span>X matching</span>
                <strong>Credibility weighted</strong>
              </div>
              <div className="reaction">
                <span>Advice mode</span>
                <strong>Disabled</strong>
              </div>
            </div>

            <h2>X Account Clusters</h2>
            <div className="post-list">
              {trustedClusters.map((cluster) => (
                <div className="x-post" key={cluster}>
                  <div className="post-meta">
                    <strong>{cluster}</strong>
                    <span className="pill confirmed">boosted</span>
                  </div>
                  <p className="muted">Included in credibility ranking when posts are relevant to a confirmed event.</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="side-panel">
            <h3>Provider Status</h3>
            <div className="watch-row">
              <span>Financial news</span>
              <Icons.ShieldCheck size={17} />
            </div>
            <div className="watch-row">
              <span>SEC EDGAR</span>
              <Icons.ShieldCheck size={17} />
            </div>
            <div className="watch-row">
              <span>X MCP wrapper</span>
              <Icons.Twitter size={17} />
            </div>
            <p className="summary">
              Production connectors should replace demo providers behind the same internal interfaces.
            </p>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

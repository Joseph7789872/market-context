import Link from "next/link";
import { Icons } from "./icons";

const nav = [
  { href: "/", label: "Live Feed", icon: Icons.Radio },
  { href: "/watchlist", label: "Watchlist", icon: Icons.Star },
  { href: "/companies/NVDA", label: "Ticker", icon: Icons.ChartCandlestick },
  { href: "/settings", label: "Settings", icon: Icons.Settings }
];

export function AppShell({
  children,
  active = "Live Feed",
  authSlot
}: {
  children: React.ReactNode;
  active?: string;
  authSlot?: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="MarketContext home">
          <span className="brand-mark">
            <Icons.Activity size={18} />
          </span>
          <span>MarketContext</span>
        </Link>

        <nav className="nav-list" aria-label="Primary navigation">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active === item.label ? "active" : ""}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="filter-list">
          <span className="sidebar-label">Signal Policy</span>
          <span className="pill confirmed">Confirmed first</span>
          <span className="pill developing">Developing labeled</span>
          <span className="pill speculative">Rumor separated</span>
        </div>

        {authSlot}
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

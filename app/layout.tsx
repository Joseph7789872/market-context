import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketContext",
  description: "Trusted market events connected to high-signal X context."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/ui";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Manipur 2027 · The Political Atlas",
    template: "%s · Manipur 2027",
  },
  description:
    "A source-led exploration of Manipur's geography, sixty constituencies and changing electoral landscape.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`@font-face{font-family:AtlasSans;src:url("${process.env.NEXT_PUBLIC_BASE_PATH || ""}/fonts/sans.woff2") format("woff2");font-weight:100 900;font-display:swap}@font-face{font-family:AtlasSerif;src:url("${process.env.NEXT_PUBLIC_BASE_PATH || ""}/fonts/serif.woff2") format("woff2");font-weight:400 800;font-display:swap}`}</style>
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

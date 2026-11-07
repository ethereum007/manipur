import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/ui";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://mandateterrain.com"),
  applicationName: "Mandate Terrain",
  openGraph:{type:"website",locale:"en_IN",siteName:"Mandate Terrain",title:"Mandate Terrain · Political Research & Consulting",description:"Election research, constituency intelligence and policy analysis for India."},
  title: {
    default: "Mandate Terrain · Political Research & Consulting",
    template: "%s · Mandate Terrain",
  },
  description:
    "Independent political research and consulting. Explore election coverage, constituency intelligence and public records.",
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

import Link from "next/link";
import { PageIntro } from "@/components/ui";
export const metadata = { title: "North East Election Research" };

export default function NorthEast() {
  return <>
    <PageIntro label="UPCOMING ELECTIONS / NORTH EAST" title="North East" description="State research collections and election coverage for North East India." />
    <section className="mt-wrap mt-section mt-hub" aria-label="States">
      <Link className="mt-secondary" href="/upcoming-elections/">← Upcoming Elections</Link>
      <Link className="mt-feature" href="/upcoming-elections/north-east/manipur/">
        <div><p className="mt-kicker">Historical research collection</p><h2>Manipur</h2><p>Explore all sixty constituencies, historical election records and public disclosures. Analysis for 2027 is deferred.</p></div>
        <span className="mt-feature-arrow" aria-hidden="true">↗</span>
      </Link>
    </section>
  </>;
}

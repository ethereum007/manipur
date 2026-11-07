import Link from "next/link";
import { PageIntro } from "@/components/ui";
export const metadata = { title: "Upcoming Elections" };

export default function UpcomingElections() {
  return <>
    <PageIntro label="ELECTION WATCH / INDIA" title="Upcoming Elections" description="Find research by region and state. Election years and dates will be listed with their official sources as coverage expands." />
    <section className="mt-wrap mt-section mt-hub" aria-label="Regions">
      <Link className="mt-feature" href="/upcoming-elections/north-east/">
        <div><p className="mt-kicker">Region 01</p><h2>North East</h2><p>Explore the Manipur research collection.</p></div>
        <span className="mt-feature-arrow" aria-hidden="true">↗</span>
      </Link>
    </section>
  </>;
}

import Link from "next/link";
import { AssemblyCalendar } from "@/components/assembly-calendar";

export default function Home() {
  return (
    <div className="mt-front">
      <section className="mt-hero">
        <svg className="mt-contours" viewBox="0 0 760 650" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => {
            const s = 0.18 + i * 0.064;
            return <path key={i} transform={`translate(490 300) rotate(-24) scale(${s})`}
              d="M -280 -20 C -270 -140 -160 -215 -46 -188 C 80 -158 164 -234 236 -112 C 285 -28 165 36 156 104 C 141 215 29 204 -54 153 C -136 102 -295 111 -280 -20Z" />;
          })}
          <circle cx="490" cy="300" r="5" fill="currentColor" />
          <path d="M 490 282 v36 M 472 300 h36" />
        </svg>
        <div className="mt-wrap mt-hero-content">
          <p className="mt-kicker">Independent political research &amp; consulting</p>
          <h1>Read the terrain.<br /><em>Understand the mandate.</em></h1>
          <p className="mt-lede">Election research, constituency intelligence and policy analysis. Built from public records, with sources and gaps you can see.</p>
          <div className="mt-actions">
            <Link className="mt-button" href="/upcoming-elections/">Explore upcoming elections <span aria-hidden="true">↗</span></Link>
            <a className="mt-secondary" href="#approach">How we work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="mt-wrap mt-hero-foot"><span>MANDATE TERRAIN / INDIA</span><span>ELECTIONS · CONSTITUENCIES · POLICY</span></div>
      </section>
      <section className="mt-wrap mt-section" id="election-watch">
        <p className="mt-kicker">01 / Election watch</p>
        <div className="mt-section-head"><h2>Upcoming elections</h2><Link href="/upcoming-elections/">View election hub ↗</Link></div>
        <AssemblyCalendar />
        <Link className="mt-feature" href="/upcoming-elections/north-east/">
          <div><p className="mt-kicker">Region 01</p><h3>North East</h3><p>Start with Manipur’s historical results, constituency dossiers and candidate disclosures.</p></div>
          <span className="mt-feature-arrow" aria-hidden="true">↗</span>
        </Link>
        <Link className="mt-secondary" href="/upcoming-elections/north-east/manipur/">Go directly to Manipur research ↗</Link>
      </section>
      <section className="mt-wrap mt-section" id="approach">
        <p className="mt-kicker">02 / Research &amp; consulting</p>
        <h2>Start with the record.</h2>
        <div className="mt-grid">
          <article><span>01</span><h3>Election research</h3><p>Trace results and shifts across election cycles, with comparable figures and clear denominators.</p></article>
          <article><span>02</span><h3>Constituency intelligence</h3><p>Bring electoral history, candidate records and local geography together in one place.</p></article>
          <article><span>03</span><h3>Policy &amp; governance</h3><p>Follow public commitments, budgets and evidence of delivery as separate parts of the record.</p></article>
        </div>
      </section>
    </div>
  );
}

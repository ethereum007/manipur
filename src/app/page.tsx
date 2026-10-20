import Link from "next/link";
import { GeoMap } from "@/components/geo";
import { Reveal } from "@/components/reveal";
import { SeatChart } from "@/components/seat-chart";
import { SectionLink, SourceNote } from "@/components/ui";
import { results, seatTotals } from "@/lib/data";
export default function Home() {
  const overviewYear = seatTotals(2022).length ? 2022 : 2017;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            A state. Sixty constituencies. A changing landscape.
          </p>
          <h1>
            MANIPUR
            <br />
            <span>2027</span>
          </h1>
          <p className="hero-subtitle">Manipur Analysis</p>
          <p className="hero-description">
            Explore the geography, people, elections and political
            transformations shaping one of India’s most complex states.
          </p>
          <Link href="/atlas" className="primary-link">
            Explore the electoral atlas <span>↗</span>
          </Link>
        </div>
        <div className="hero-map">
          <div className="map-orbit" />
          <GeoMap hero />
          <p className="hero-map-caption">
            THE LAND BENEATH THE POLITICS
            <br />
            <span>Relief context · Reference boundaries, not a survey</span>
          </p>
        </div>
        <div className="hero-bottom">
          <span>AN INDEPENDENT RESEARCH PUBLICATION</span>
          <span>2012 / 2017 / 2022 / 2024</span>
          <Link href="/sources">Every number has a source ↗</Link>
        </div>
      </section>
      <section className="research-home-feature"><h2>The 2024 vote.<br/><em>All sixty segments.</em></h2><div><p>Who led locally, by how many votes, and what the evidence can tell us about 2027. Explore the interactive Parliamentary map, complete candidate tables and constituency research notes.</p><Link className="text-link" href="/analysis/segments">Explore 2024 results constituency by constituency ↗</Link></div></section><div className="briefing-entry">
        <p className="eyebrow">THE ATLAS, IN FIVE MINUTES</p>
        <Link className="text-link" href="/briefing">
          Open the executive walkthrough, presenter notes and PDF handout ↗
        </Link>
      </div>
      <section className="research-home-feature"><h2>Beyond the result.<br/><em>Inside the evidence.</em></h2><div><p>Ten detailed studies connect electoral change with public money, institutions and recovery. Explore all sixty constituency research notes and the interactive election analysis lab.</p><Link className="text-link" href="/analysis">Open the research desk ↗</Link></div></section>
      <div className="paper-strip">
        <span>
          60 <small>Assembly constituencies</small>
        </span>
        <span>
          3 <small>Assembly elections</small>
        </span>
        <span>
          2 <small>Parliamentary constituencies</small>
        </span>
        <span>
          {results.length.toLocaleString()}{" "}
          <small>Reconciled candidate-election records</small>
        </span>
      </div>
      <Reveal className="editorial-section geography-story">
        <div className="chapter-number">01 / THE LAND</div>
        <div className="story-grid">
          <h2>
            To understand
            <br />
            the vote,
            <br />
            <em>read the land.</em>
          </h2>
          <div className="story-copy">
            <p className="lead">
              A valley surrounded by hills. A border with Myanmar. A landscape
              that shapes access, administration and representation.
            </p>
            <p>
              Geography is a starting point, not an explanation for how people
              vote. The Imphal Valley and surrounding hill systems contain
              diverse communities, institutions and political histories.
            </p>
            <SectionLink href="/discover">Discover Manipur</SectionLink>
            <SourceNote>
              <a href="https://manipur.gov.in/">Government of Manipur</a> ·
              State geography. Terrain: Esri World Shaded Relief. Boundaries:
              DataMeet, with documented limitations.
            </SourceNote>
          </div>
        </div>
      </Reveal>
      <Reveal className="editorial-section election-story">
        <div className="chapter-number">02 / THE ELECTORAL RECORD</div>
        <div className="election-story-grid">
          <div>
            <h2>
              Sixty seats.
              <br />
              <em>Different stories.</em>
            </h2>
            <p className="lead">
              A legislature changes one constituency at a time.
            </p>
            <p>
              Trace winners, margins and candidate continuity across three
              Assembly elections. Read election-day outcomes separately from
              later defections and government formation.
            </p>
            <SectionLink href="/atlas">Compare the elections</SectionLink>
          </div>
          <div className="chart-feature">
            <div className="chart-heading">
              <h3>The {overviewYear} Assembly</h3>
              <span>SEATS WON / 60</span>
            </div>
            <SeatChart year={overviewYear} compare />
            <p className="chart-caption">
              31 seats constitute an outright majority.
            </p>
          </div>
        </div>
      </Reveal>
      <Reveal className="editorial-section people-story">
        <div className="chapter-number">03 / PEOPLE & POWER</div>
        <Link
          href="/candidates/nongthombam-biren-singh"
          className="profile-teaser"
        >
          <div>
            <h2>
              Behind every result,
              <br />
              <em>a political career.</em>
            </h2>
            <p>
              Explore candidates through their electoral records, publicly
              disclosed affidavits and documented offices.
            </p>
            <span className="text-link">
              Open a candidate profile <span>↗</span>
            </span>
          </div>
          <div className="profile-teaser-art">
            <span>THE PUBLIC RECORD</span>
            <strong>
              N. Biren
              <br />
              <em>Singh</em>
            </strong>
            <small>Heingang · Candidate profile</small>
          </div>
        </Link>
      </Reveal>
      <Reveal className="editorial-section reading-room">
        <div className="chapter-number">THE READING ROOM</div>
        <h2>
          A changing state.
          <br />
          <em>An open question.</em>
        </h2>
        <div className="reading-grid">
          <Link href="/governance">
            <span>CONFLICT & GOVERNANCE</span>
            <h3>Manipur since May 2023</h3>
            <p>
              A careful chronology, with evidence classifications and explicit
              reporting cutoffs.
            </p>
            <b>Read the chronology ↗</b>
          </Link>
          <Link href="/elections">
            <span>THE PARLIAMENTARY RECORD</span>
            <h3>The 2024 election</h3>
            <p>
              Two constituencies. A different electoral contest. Comparisons
              need context.
            </p>
            <b>Explore the results ↗</b>
          </Link>
          <Link href="/outlook">
            <span>THE ROAD AHEAD</span>
            <h3>Looking toward 2027</h3>
            <p>
              Transparent scenarios and unresolved questions, without numerical
              predictions.
            </p>
            <b>Examine the uncertainties ↗</b>
          </Link>
        </div>
      </Reveal>
    </>
  );
}

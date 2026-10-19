import { PageIntro } from "@/components/ui";
import { GeoMap } from "@/components/geo";
import { ResearchSource } from "@/components/research-source";
import { notes } from "@/lib/research";
import Link from "next/link";
export const metadata = { title: "Discover Manipur" };
export default function Discover() {
  return (
    <>
      <PageIntro
        label="DISCOVER MANIPUR"
        title="The land. The people. The context."
        description="Read geography and history alongside the electoral record, with explicit reference years and source limits."
      />
      <section className="discover-opening">
        <div>
          <h2>
            A landscape
            <br />
            <em>of connections.</em>
          </h2>
          {notes.geography.map((g) => (
            <article key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
              <ResearchSource id={g.source} />
            </article>
          ))}
        </div>
        <GeoMap hero />
      </section>
      <section className="profile-section">
        <div>
          <p className="eyebrow">HISTORICAL CONTEXT</p>
          <h2>
            A state,
            <br />
            <em>over time.</em>
          </h2>
          <p>
            This initial chronology covers verified institutional milestones.
            Precolonial history, the 1891 war and post-statehood security
            history need additional primary and academic sourcing.
          </p>
        </div>
        <div className="career-timeline">
          {notes.history.map((e) => (
            <article key={e.date}>
              <strong className="timeline-year">{e.date.slice(0, 4)}</strong>
              <div>
                <span className="timeline-kind">{e.date}</span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <ResearchSource id={e.source} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="profile-section">
        <h2>
          People are more
          <br />
          <em>than categories.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Community, language, religion, geography and political affiliation
            are different attributes. They must not be treated as
            interchangeable, or used to infer a person's vote or beliefs.
          </p>
          <p>
            The cultural and social research programme includes Meitei, Meitei
            Pangal, Naga, Kuki-Zo and other recognized communities. Detailed
            profiles and demographic breakdowns remain unpublished pending
            source review. No community is presented as a homogeneous political
            bloc.
          </p>
          <Link className="text-link" href="/development">
            Explore dated development indicators ↗
          </Link>
        </div>
      </section>
    </>
  );
}

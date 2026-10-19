import Link from "next/link";
import { notFound } from "next/navigation";
import {
  constituencies,
  contest,
  number,
  years,
  electionSource,
  candidateSlug,
} from "@/lib/data";
import { PageIntro, SourceNote, Missing } from "@/components/ui";
export function generateStaticParams() {
  return constituencies.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = constituencies.find((c) => c.slug === slug);
  return { title: c?.name || "Constituency" };
}
export default async function Constituency({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = constituencies.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <div className="breadcrumb">
        <Link href="/constituencies">Constituencies</Link>
        <span>/</span>AC {String(c.id).padStart(2, "0")}
      </div>
      <PageIntro
        label={
          "ASSEMBLY CONSTITUENCY " +
          String(c.id).padStart(2, "0") +
          " / " +
          c.reservation
        }
        title={c.name + "."}
        description="Three Assembly elections, read through the candidate-level public record."
      />
      <section className="directory-section">
        <div className="history-grid">
          {years.map((y) => {
            const rows = contest(y, c.id);
            return (
              <article key={y}>
                <h2>{y}</h2>
                {rows.length ? (
                  <>
                    <p className="lead">{rows[0].candidate}</p>
                    <p>{rows[0].party} · elected</p>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Party</th>
                            <th>Votes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.candidate}>
                              <td>
                                <Link
                                  href={
                                    "/candidates/" +
                                    (r.ac === 2 &&
                                    r.candidate.toLowerCase().includes("biren")
                                      ? "nongthombam-biren-singh"
                                      : candidateSlug(r))
                                  }
                                >
                                  {r.candidate}
                                </Link>
                              </td>
                              <td>{r.party}</td>
                              <td>{number(r.votes)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="source-note">
                      Margin:{" "}
                      {rows.length > 1
                        ? number(rows[0].votes - rows[1].votes)
                        : "Unavailable"}
                      . Electors, turnout and NOTA appear only when reconciled.
                    </p>
                  </>
                ) : (
                  <>
                    <Missing />
                    <p className="source-note">
                      Candidate results have not passed transcription and
                      reconciliation for this election.
                    </p>
                  </>
                )}
                <SourceNote>
                  <a href={electionSource(y)}>CEO Manipur · {y} report ↗</a>
                  {rows[0] ? ", PDF p. " + rows[0].sourcePage : ""}
                </SourceNote>
              </article>
            );
          })}
        </div>
      </section>
      <section className="profile-section">
        <h2>
          Continuity
          <br />
          <em>and change.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Compare election-day candidates and parties. A change in winning
            party does not establish why voters changed their choices.
            Defections, by-elections and boundary changes require separate
            records.
          </p>
          <p>
            District and hill/valley classification are withheld until a
            versioned administrative crosswalk is reviewed. Historical map
            district labels are not presented as current districts.
          </p>
          <Link className="text-link" href="/atlas">
            Return to the electoral atlas ↗
          </Link>
        </div>
      </section>
    </>
  );
}

import {CandidacyAnalysis} from '@/components/candidacy-analysis';
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  candidateIndex as results,
  candidateSlug,
  registeredWinner,
  electionSource,
  resultSource,
  number,
} from "@/lib/data";
import { PageIntro, SourceNote, Missing } from "@/components/ui";
export function generateStaticParams() {
  return results.length
    ? results
        .filter(
          (r) => !(r.ac === 2 && r.candidate.toLowerCase().includes("biren")),
        )
        .map((r) => ({ slug: candidateSlug(r) }))
    : [{ slug: "record-unavailable" }];
}
export default async function Candidate({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = results.find((x) => candidateSlug(x) === slug);
  if (!r) notFound();
  const knownWinner=registeredWinner(r.year,r.ac);
  return (
    <>
      <div className="breadcrumb">
        <Link href="/candidates">People & power</Link>
        <span>/</span>Election record
      </div>
      <PageIntro
        label={r.year + " ASSEMBLY ELECTION / " + r.name}
        title={r.candidate}
        description={
          "A source-backed candidacy record for " +
          r.name +
          ". This entry is scoped to this election, not automatically merged across years."
        }
      />
      <section className="profile-section">
        <h2>
          The electoral
          <br />
          <em>record.</em>
        </h2>
        <div className="result-metrics">
          <div>
            <strong>{number(r.votes)}</strong>
            <span>Votes received</span>
          </div>
          <div>
            <strong>
              {r.rank == null
                ? knownWinner?.candidate===r.candidate ? "Elected" : "Withheld"
                : r.rank === 1
                  ? "Elected"
                  : "Rank " + r.rank}
            </strong>
            <span>
              {r.party} · {r.year}
            </span>
          </div>
          <SourceNote>
            {r.verification}
            <br />
            <a href={r.sourceUrl || r.indexUrl || electionSource(r.year)}>
              CEO Manipur · official {r.year}{" "}
              {r.sourceUrl ? "Form 20" : r.indexUrl ? "candidate index" : "report"}
            </a>
            {r.sourcePage > 0 ? ", PDF p. " + r.sourcePage : ""}.
          </SourceNote>
        </div>
      </section>
      <CandidacyAnalysis year={r.year} ac={r.ac} candidate={r.candidate}/>
      <section className="profile-section">
        <h2>
          Public
          <br />
          <em>disclosures.</em>
        </h2>
        <div className="evidence-copy">
          {r.affidavitUrl ? (
            <p>
              <a className="text-link" href={r.affidavitUrl}>
                Read official nomination affidavit ↗
              </a>
            </p>
          ) : (
            <Missing label="Affidavit not yet indexed" />
          )}
          <p>
            Assets, liabilities, education, occupation, age, legal proceedings,
            office history and licensed portrait have not yet been transcribed
            and verified for this entry. A missing value is not a declaration of
            zero.
          </p>
          <p>
            Cross-year identity is unresolved. No party switch, incumbency or
            personal background is inferred from a similar name.
          </p>
          <Link className="text-link" href="/candidates">
            Compare candidacies ↗
          </Link>
        </div>
      </section>
    </>
  );
}

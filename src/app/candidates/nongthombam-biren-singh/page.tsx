import {CandidacyAnalysis} from '@/components/candidacy-analysis';
import Link from "next/link";
import { SourceNote, Missing } from "@/components/ui";
import {
  contest,
  results,
  number,
  partyColors,
  electionSource,
  resultSource,
} from "@/lib/data";
export const metadata = { title: "N. Biren Singh · Public record" };
export default function Profile() {
  const offices =
    "https://assembly.mn.gov.in/members/profile/nongthombam-biren-singh";
  const adr =
    "https://www.myneta.info/manipur2022/candidate.php?candidate_id=37";
  const career = results
    .filter((r) => r.ac === 2 && r.candidate.toLowerCase().includes("biren"))
    .sort((a, b) => a.year - b.year);
  return (
    <>
      <div className="breadcrumb">
        <Link href="/candidates">People & power</Link>
        <span>/</span>Candidate profile
      </div>
      <section className="candidate-hero">
        <div>
          <p className="eyebrow">THE PUBLIC RECORD / HEINGANG</p>
          <h1>
            Nongthombam
            <br />
            <em>Biren Singh.</em>
          </h1>
          <p className="candidate-known">Also recorded as N. Biren Singh</p>
          <p className="lead">
            An electoral career in Heingang, examined through official results
            and public disclosures.
          </p>
          <div className="candidate-meta">
            <span>
              ASSEMBLY CONSTITUENCY <b>02 · Heingang</b>
            </span>
            <span>
              PROFILE BASIS <b>Election records & affidavit</b>
            </span>
          </div>
        </div>
        <div className="candidate-art">
          <span className="portrait-label">A RECORD, IN CONTEXT</span>
          <div className="monogram">
            NB<span>Heingang</span>
          </div>
          <p>
            Photograph omitted.
            <br />
            No licensed portrait has been verified.
          </p>
        </div>
      </section>
      <nav className="profile-nav" aria-label="Profile sections">
        <a href="#career">Electoral career</a>
        <a href="#performance">Election performance</a>
        <a href="#disclosures">Public disclosures</a>
        <a href="#profile-sources">Sources & limitations</a>
      </nav>
      <section className="profile-section" id="career">
        <div>
          <p className="eyebrow">ELECTORAL CAREER</p>
          <h2>
            The record
            <br />
            <em>over time.</em>
          </h2>
          <p>
            Each entry describes an election-day candidacy. Party changes and
            public offices require separate documentary evidence.
          </p>
        </div>
        <div className="career-timeline">
          {[2002, 2007, 2012, 2017, 2022].map((y) => {
            const r = career.find((x) => x.year === y);
            return (
              <article key={y}>
                <strong className="timeline-year">{y}</strong>
                <div>
                  <span className="timeline-kind">
                    ASSEMBLY ELECTION · HEINGANG
                  </span>
                  <h3>
                    {r
                      ? r.rank === 1
                        ? "Elected"
                        : "Contested"
                      : "Elected · " +
                        (y === 2002 ? "DRPP" : y <= 2012 ? "INC" : "BJP")}
                  </h3>
                  {r ? (
                    <>
                      <p>
                        <i
                          className="party-dot"
                          style={{ background: partyColors[r.party] }}
                        />
                        {r.party} · {number(r.votes)} votes
                      </p>
                      <a href={resultSource(r)}>
                        Official result · page {r.sourcePage} ↗
                      </a>
                    </>
                  ) : (
                    <>
                      <p>Vote total not yet reconciled.</p>
                      <a href={offices}>Official Assembly career record ↗</a>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="profile-section" id="performance">
        <div>
          <p className="eyebrow">ELECTION PERFORMANCE</p>
          <h2>
            Every contest,
            <br />
            <em>in perspective.</em>
          </h2>
          <p>
            Votes are source values. Margins compare the top two candidates;
            historical results are not a forecast.
          </p>
        </div>
        <div>
          {career.length ? (
            <div className="table-scroll">
              <table>
                <caption>Verified Assembly election candidacies</caption>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Party</th>
                    <th>Votes</th>
                    <th>Winning margin</th>
                    <th>Candidate-vote share</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {career.map((r) => (
                    <tr key={r.year}>
                      <th>{r.year}</th>
                      <td>{r.party}</td>
                      <td>{number(r.votes)}</td>
                      <td>
                        {contest(r.year, r.ac).length > 1
                          ? number(
                              contest(r.year, r.ac)[0].votes -
                                contest(r.year, r.ac)[1].votes,
                            )
                          : "Unavailable"}
                      </td>
                      <td>
                        {(
                          (r.votes /
                            contest(r.year, r.ac).reduce(
                              (sum, x) => sum + x.votes,
                              0,
                            )) *
                          100
                        ).toFixed(2)}
                        %
                      </td>
                      <td>{r.rank === 1 ? "Elected" : "Rank " + r.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-note">
              Election performance withheld until the source records pass
              reconciliation.{" "}
              <a href="https://ceomanipur.nic.in/StatisticalReports">
                Read the reports ↗
              </a>
            </div>
          )}
          <SourceNote />
        </div>
      </section>
      <section className="profile-section" id="disclosures">
        <div>
          <p className="eyebrow">PUBLIC DISCLOSURES</p>
          <h2>
            What was
            <br />
            <em>declared.</em>
          </h2>
          <p>
            Affidavits are self-declarations at the time of nomination. Declared
            cases are not findings of guilt.
          </p>
          <a
            className="text-link"
            href="https://ceomanipur.nic.in/Affidavits/AssemblyElection/2022/2/NONGTHOMBAM%20BIREN%20SINGH.pdf"
          >
            Read the 2022 affidavit ↗
          </a>
        </div>
        <div className="disclosure-grid">
          {[
            ["Total declared assets", "₹1,47,48,361"],
            ["Total declared liabilities", "₹1,44,300"],
            ["Education", "Graduate"],
            ["Occupation", "Social worker & politician"],
            ["Legal disclosure", "0 cases disclosed"],
            ["Age at nomination", "61 years"],
          ].map(([label, value]) => (
            <article key={label}>
              <span>{label}</span>
              <strong className="disclosure-value">{value}</strong>
              <p>
                2022 nomination declaration · ADR / MyNeta transcription. Not a
                current assessment.
              </p>
            </article>
          ))}
          <SourceNote>
            <a href={adr}>ADR / MyNeta · 2022 profile ↗</a>. Secondary
            transcription; official affidavit linked alongside. 2017 financial
            comparisons are withheld because ADR publications conflict.
          </SourceNote>
        </div>
      </section>
      <CandidacyAnalysis year={2022} ac={2} candidate="Nongthombam Biren Singh"/>
      <aside className="research-crosslink"><p className="eyebrow">CAREER, FIELD & DISCLOSURES</p><Link className="text-link" href="/analysis/candidate-records">Read the detailed candidate-record study ↗</Link></aside>
      <section className="profile-section" id="profile-sources">
        <div>
          <p className="eyebrow">SOURCES & LIMITATIONS</p>
          <h2>
            Follow
            <br />
            <em>the evidence.</em>
          </h2>
        </div>
        <div className="evidence-copy">
          <p>
            Primary sources: Chief Electoral Officer, Manipur election
            statistical reports and the publicly filed 2022 nomination
            affidavit.
          </p>
          <p>
            This profile does not infer community, religion or political intent
            from a candidate’s name. The record does not establish present
            office, current assets or the current status of any proceedings.
          </p>
          <SourceNote>
            Reference window: Assembly elections 2012, 2017 and 2022. Research
            accessed 19 October 2026.{" "}
            <Link href="/sources">Methods and coverage ↗</Link>
          </SourceNote>
        </div>
      </section>
    </>
  );
}

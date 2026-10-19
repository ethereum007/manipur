import { PageIntro, SourceNote } from "@/components/ui";
import { ElectionHistory } from "@/components/election-history";
import Link from "next/link";
import parliament from "../../../data/processed/parliament-2024.json";
import { number, partyColors } from "@/lib/data";
export const metadata = { title: "Election history" };
export default function Elections() {
  return (
    <>
      <PageIntro
        label="ELECTION HISTORY"
        title="Three elections. A changing record."
        description="Read seats and votes as separate measures, with incomplete coverage kept visible."
      />
      <ElectionHistory />
      <section className="profile-section">
        <h2>
          The parliamentary
          <br />
          <em>election of 2024.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Inner Manipur and Outer Manipur are different parliamentary
            constituencies. The official 2024 CEO report has been located and
            archived by the research workflow. All ten candidate totals have
            been reviewed against the report and reconcile with its party
            aggregate. Assembly-segment tables remain under review.
          </p>
          {parliament.constituencies.map((c) => (
            <div key={c.id} style={{ margin: "2.5rem 0" }}>
              <p className="eyebrow">2024 LOK SABHA · {c.name}</p>
              <h3>{c.candidates[0].candidate}</h3>
              <p>
                {number(c.candidates[0].votes - c.candidates[1].votes)} vote
                winning margin · {number(c.candidateVotes)} candidate votes
              </p>
              {c.candidates.map((r) => (
                <div key={r.candidate} style={{ margin: "1rem 0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <span>
                      {r.candidate} · {r.party}
                    </span>
                    <span>
                      {number(r.votes)} ·{" "}
                      {((r.votes / c.candidateVotes) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div
                    style={{ height: 5, background: "#ddd6c8", marginTop: 6 }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: (r.votes / c.candidateVotes) * 100 + "%",
                        background: partyColors[r.party] || "#909aa3",
                      }}
                    />
                  </div>
                </div>
              ))}
              <SourceNote>
                Share of candidate votes, excluding NOTA. Turnout and NOTA
                totals: not yet reconciled.
              </SourceNote>
            </div>
          ))}
          <SourceNote>{parliament.normalizationNotes[0]}</SourceNote>
          <p>
            The 2022 Assembly and 2024 parliamentary contests differ in
            candidates, alliances, issues and voter participation. Their
            differences cannot be interpreted as a clean measure of voter
            movement or party conversion.
          </p>
          <SourceNote>
            <a href="https://ceomanipur.nic.in/StatisticalReport/LokSabhaElection/SR_lok_Sabha_2024.pdf">
              CEO Manipur · 2024 Lok Sabha statistical report ↗
            </a>
          </SourceNote>
          <Link className="text-link" href="/sources">
            Data coverage and outstanding records ↗
          </Link>
        </div>
      </section>
    </>
  );
}

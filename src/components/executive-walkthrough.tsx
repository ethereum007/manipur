"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GeoMap } from "./geo";
import { SeatChart } from "./seat-chart";
import { results, winnerRegister, number } from "@/lib/data";
import budget from "../../data/research/budget-2026.json";
const stops = [
  {
    title: "A state. Sixty constituencies.",
    label: "The platform",
    time: "0:00–0:45",
    notes:
      "Open with the purpose: a public, source-backed record of Manipur’s electoral landscape. This is a research edition. Every numerical claim should lead to its source.",
  },
  {
    title: "Three elections. A changing map.",
    label: "Historical representation",
    time: "0:45–2:00",
    notes:
      "Compare election-day seats across the same legislature. Explain that a plurality, majority, coalition and subsequent party membership are different measures. Open the interactive atlas if asked for a constituency.",
  },
  {
    title: "Follow the candidate record.",
    label: "People & disclosures",
    time: "2:00–3:00",
    notes:
      "Use the reviewed Biren Singh example to demonstrate documented career history and dated nomination declarations. The directory is election-scoped; similar names are not automatically merged.",
  },
  {
    title: "Public resources, in context.",
    label: "Economy & governance",
    time: "3:00–4:00",
    notes:
      "Show that the platform reaches beyond election charts. Distinguish budget estimates from actual expenditure, and state finances from constituency service outcomes. Governance dates have explicit coverage limits.",
  },
  {
    title: "What is established. What comes next.",
    label: "Evidence & delivery roadmap",
    time: "4:00–5:00",
    notes:
      "Close by separating working product capabilities from incomplete research. Remaining totals, turnout, segment accounting and disclosures require verification. No polling-based forecast is available.",
  },
];
export function ExecutiveWalkthrough() {
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const key = (e: KeyboardEvent) => {
      if (
        ["SELECT", "INPUT", "TEXTAREA", "BUTTON", "A"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, 4));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(4);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  const biren = results.filter(
    (r) => r.ac === 2 && r.candidate.toLowerCase().includes("biren"),
  );
  const coverage = [2012, 2017, 2022].map((year) => ({
    year,
    winners: winnerRegister.filter((r) => r.year === year).length,
    contests: new Set(results.filter((r) => r.year === year).map((r) => r.ac))
      .size,
  }));
  const outlay = budget.metrics.find((m) => m.id === "capital-outlay")!;
  return (
    <section className="executive-walkthrough" data-ready={ready}>
      <div className="walkthrough-toolbar">
        <span>FIVE-MINUTE EXECUTIVE WALKTHROUGH</span>
        <button aria-pressed={notes} onClick={() => setNotes(!notes)}>
          Presenter notes {notes ? "on" : "off"}
        </button>
        <button onClick={() => window.print()}>Print handout ↗</button>
        <a
          href={
            (process.env.NEXT_PUBLIC_BASE_PATH || "") +
            "/data/executive-brief.pdf"
          }
          download
        >
          Download PDF ↗
        </a>
      </div>
      <nav className="walkthrough-stops" aria-label="Walkthrough chapters">
        {stops.map((s, i) => (
          <button
            key={s.label}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <span>0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </nav>
      {stops.map((s, i) => (
        <article
          key={s.label}
          aria-hidden={index !== i}
          className={"walkthrough-slide " + (index === i ? "current" : "")}
        >
          <div className="walkthrough-heading">
            <p className="eyebrow">MANIPUR 2027 / {s.label}</p>
            <h1>{s.title}</h1>
            <span className="walkthrough-time">
              {s.time} · CHAPTER {i + 1} / 5
            </span>
          </div>
          {i === 0 && (
            <div className="walkthrough-grid">
              <div>
                <p className="lead">
                  A source-backed political atlas connecting geography,
                  representation, public records and development.
                </p>
                <p>
                  Explore all 60 constituencies, three Assembly elections,
                  candidate records and the 2024 parliamentary result.
                </p>
                <p className="source-note">
                  Research edition · accessed 19 October 2026. Verified coverage
                  and unresolved records are disclosed.
                </p>
                <Link className="text-link" href="/">
                  Open the editorial homepage ↗
                </Link>
              </div>
              <GeoMap hero />
            </div>
          )}
          {i === 1 && (
            <>
              <div className="walkthrough-seat-grid">
                {[2012, 2017, 2022].map((y) => (
                  <section key={y}>
                    <h2>{y}</h2>
                    <SeatChart year={y} />
                  </section>
                ))}
              </div>
              <p className="source-note">
                Official CEO winner registers: all 60 seats in each election.
                Election-day results are distinct from later House membership.
              </p>
              <Link className="text-link" href="/atlas">
                Open linked comparison maps ↗
              </Link>
            </>
          )}
          {i === 2 && (
            <div className="walkthrough-grid">
              <div>
                <p className="eyebrow">REVIEWED EXAMPLE / HEINGANG</p>
                <h2>
                  Nongthombam
                  <br />
                  <em>Biren Singh.</em>
                </h2>
                <p>
                  Documented electoral career: 2002, 2007, 2012, 2017 and 2022.
                  Public declarations have a nomination date and a source.
                </p>
                <Link
                  className="text-link"
                  href="/candidates/nongthombam-biren-singh"
                >
                  Open the complete reviewed profile ↗
                </Link>
              </div>
              <div>
                <table>
                  <caption>Reconciled candidate votes</caption>
                  <thead>
                    <tr>
                      <th>Election</th>
                      <th>Party</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biren.map((r) => (
                      <tr key={r.year}>
                        <td>{r.year}</td>
                        <td>{r.party}</td>
                        <td>{number(r.votes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="source-note">
                  CEO Manipur · official Form 20 results. Other profile fields
                  may come from separately labelled secondary affidavit
                  transcriptions.
                </p>
                <p>
                  All 265 official 2022 candidacies are indexed with original
                  affidavit links. Untranscribed disclosures remain unavailable.
                </p>
              </div>
            </div>
          )}
          {i === 3 && (
            <div className="walkthrough-grid">
              <div>
                <h2>₹{number(outlay.values[3])} crore</h2>
                <p className="lead">Capital outlay · 2026–27 budget estimate</p>
                <p>
                  ₹{number(outlay.values[0])} crore in 2024–25 actuals; ₹
                  {number(outlay.values[2])} crore in the 2025–26 revised
                  estimate.
                </p>
                <p className="source-note">
                  Estimates are plans, not achieved delivery. Nominal state
                  aggregates do not establish constituency outcomes.
                </p>
                <a className="source-note" href={budget.source}>
                  Government of Manipur · Budget at a Glance, PDF p.3 ↗
                </a>
              </div>
              <div>
                <p className="eyebrow">DATED PUBLIC CONTEXT</p>
                <h3>Follow the governance record.</h3>
                <p>
                  The chronology distinguishes government publications, judicial
                  orders and broadcaster reports. Indexed events currently
                  extend through 5 October 2026.
                </p>
                <Link className="text-link" href="/development">
                  Explore budget measures ↗
                </Link>
                <br />
                <Link className="text-link" href="/governance">
                  Open the sourced chronology ↗
                </Link>
              </div>
            </div>
          )}
          {i === 4 && (
            <div className="walkthrough-grid">
              <div>
                <table>
                  <caption>Assembly coverage at presentation time</caption>
                  <thead>
                    <tr>
                      <th>Election</th>
                      <th>Winners</th>
                      <th>Full vote contests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverage.map((r) => (
                      <tr key={r.year}>
                        <td>{r.year}</td>
                        <td>{r.winners}/60</td>
                        <td>{r.contests}/60</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  All ten 2024 parliamentary candidates are reconciled; vote
                  shares explicitly exclude NOTA.
                </p>
              </div>
              <div>
                <h3>The next research gates.</h3>
                <p>
                  Remaining historical candidate totals; 2024 Assembly-segment,
                  postal and special-station accounting; compatible turnout
                  denominators; further candidate disclosures and newer
                  governance documents.
                </p>
                <p>
                  Reference polygons are historical and publisher-marked
                  pre-delimitation. No seat forecast or individual
                  voter-transfer estimate is claimed.
                </p>
                <Link className="text-link" href="/sources">
                  Open sources, coverage and downloads ↗
                </Link>
              </div>
            </div>
          )}
          {notes && (
            <aside className="presenter-notes">
              <strong>PRESENTER NOTES</strong>
              <p>{s.notes}</p>
            </aside>
          )}
          <span className="walkthrough-folio">
            MANIPUR 2027 · THE POLITICAL ATLAS / 0{i + 1}
          </span>
        </article>
      ))}
      <div className="walkthrough-controls">
        <button disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          ← Previous
        </button>
        <span aria-live="polite">{index + 1} / 5 · Arrow keys to navigate</span>
        <button disabled={index === 4} onClick={() => setIndex((i) => i + 1)}>
          Next →
        </button>
        <Link href="/presentation">Full 15-slide briefing ↗</Link>
      </div>
    </section>
  );
}

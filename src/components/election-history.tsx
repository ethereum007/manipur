"use client";
import { useState } from "react";
import Link from "next/link";
import { SeatChart } from "./seat-chart";
import { SourceNote } from "./ui";
import {
  years,
  results,
  number,
  seatTotals,
  partyColors,
  partyNames,
} from "@/lib/data";
export function ElectionHistory() {
  const [year, setYear] = useState(2017);
  const [party, setParty] = useState("INC");
  const [A, setA] = useState(2012);
  const [B, setB] = useState(2022);
  const partyVotes = (y: number, p: string) => {
    const r = results.filter((x) => x.year === y);
    if (new Set(r.map((x) => x.ac)).size !== 60) return null;
    const all = r.reduce((s, x) => s + x.votes, 0);
    return all
      ? (r.filter((x) => x.party === p).reduce((s, x) => s + x.votes, 0) /
          all) *
          100
      : null;
  };
  const seats = (y: number, p: string) =>
    seatTotals(y).find((x) => x[0] === p)?.[1] ??
    (seatTotals(y).length ? 0 : null);
  return (
    <section className="directory-section">
      <div className="year-tabs" role="group" aria-label="Historical election">
        {years.map((y) => (
          <button key={y} aria-pressed={year === y} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>
      <div className="election-history-main">
        <div>
          <h2>
            {year}
            <br />
            <em>The Assembly result.</em>
          </h2>
          <p>
            {
              new Set(results.filter((r) => r.year === year).map((r) => r.ac))
                .size
            }{" "}
            / 60 candidate contests reconciled.
          </p>
          <p>
            Election-day party results are separate from current Assembly
            membership. Candidate totals are published only for complete
            reconciled contests.
          </p>
        </div>
        <SeatChart year={year} compare />
      </div>
      <section className="coverage-notice">
        <h3>Party trajectory explorer</h3>
        <div className="directory-tools" style={{ marginTop: 25 }}>
          <label>
            Party
            <select value={party} onChange={(e) => setParty(e.target.value)}>
              {Object.keys(partyNames).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Election A
            <select value={A} onChange={(e) => setA(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Election B
            <select value={B} onChange={(e) => setB(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>{A}</th>
                <th>{B}</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Seats</th>
                <td>{number(seats(A, party))}</td>
                <td>{number(seats(B, party))}</td>
                <td>
                  {seats(A, party) == null || seats(B, party) == null
                    ? "Unavailable"
                    : seats(B, party)! - seats(A, party)!}
                </td>
              </tr>
              <tr>
                <th>Candidate-vote share</th>
                <td>
                  {partyVotes(A, party) == null
                    ? "Unavailable"
                    : partyVotes(A, party)!.toFixed(2) + "%"}
                </td>
                <td>
                  {partyVotes(B, party) == null
                    ? "Unavailable"
                    : partyVotes(B, party)!.toFixed(2) + "%"}
                </td>
                <td>
                  {partyVotes(A, party) == null || partyVotes(B, party) == null
                    ? "Unavailable"
                    : (partyVotes(B, party)! - partyVotes(A, party)!).toFixed(
                        2,
                      ) + " pp"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <SourceNote>
          Party vote shares require candidate coverage across all 60
          constituencies. Partial data are never extrapolated statewide.
        </SourceNote>
      </section>
      <Link className="text-link" href="/atlas">
        Explore constituency changes on the map ↗
      </Link>
    </section>
  );
}

"use client";
import { useState } from "react";
import { notes } from "@/lib/research";
import { ResearchSource } from "./research-source";
export function GovernanceTimeline() {
  const [year, setYear] = useState("All");
  const filtered = notes.events.filter(
    (e) => year === "All" || e.date.startsWith(year),
  );
  return (
    <section className="directory-section">
      <div className="directory-tools">
        <label>
          Filter chronology
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {["All", "2023", "2024", "2025", "2026"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <p className="source-note">
          Selected sourced events through 5 October 2026; accessed 19 October 2026. This is not exhaustive coverage or a live status feed.
        </p>
      </div>
      <div className="governance-timeline">
        {filtered.map((e) => (
          <article key={e.date}>
            <time dateTime={e.date}>
              {new Date(e.date + "T00:00:00Z").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <div>
              <span className="timeline-kind">
                {e.location} · {e.classification}
              </span>
              <h2>{e.title}</h2>
              <p>{e.text}</p>
              <span className="missing">{e.status}</span>
              <ResearchSource id={e.source} />
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-note">
          No events for this year have been verified in the current chronology.
          This does not mean no events occurred.
        </p>
      )}
    </section>
  );
}

"use client";
import { useState } from "react";
import { notes } from "@/lib/research";
import { ResearchSource } from "./research-source";
export function DevelopmentExplorer() {
  const [metric, setMetric] = useState("Population");
  const rows = notes.indicators.filter((r) => r.name === metric);
  return (
    <section className="directory-section">
      <div className="directory-tools">
        <label>
          Indicator
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            {["Population", "Literacy", "GSDP"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <span className="source-note">
          Only published reference years are offered. Current district estimates
          are unavailable.
        </span>
      </div>
      <div className="indicator-chart">
        <h2>
          {metric}
          <em> / the dated record</em>
        </h2>
        {rows.map((r) => (
          <div key={r.year} className="indicator-row">
            <span>{r.year}</span>
            <div>
              <div
                className="indicator-line"
                style={{
                  width:
                    (r.value / Math.max(...rows.map((x) => x.value))) * 100 +
                    "%",
                }}
              />
              <p>{r.note}</p>
            </div>
            <strong>
              {r.value.toLocaleString("en-IN")}
              <small>{r.unit}</small>
            </strong>
          </div>
        ))}
        <ResearchSource id={rows[0].source} />
      </div>
      <div className="coverage-notice">
        <h3>What this view cannot establish</h3>
        <p>
          These observations do not measure current conflict impacts, recent
          unemployment, household income or district service access. Comparable
          current data and a historical-to-current district crosswalk have not
          yet been reconciled.
        </p>
      </div>
    </section>
  );
}

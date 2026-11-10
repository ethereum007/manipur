"use client";

import { useState } from "react";
import Link from "next/link";

// ECI Terms of the Houses, checked 10 November 2026.
// Columns and rows are positions on a schematic tile map.
const assemblies = [
  ["JK", "Jammu and Kashmir", "2029-11-03", 3, 1],
  ["HP", "Himachal Pradesh", "2028-01-03", 4, 2],
  ["PB", "Punjab", "2027-03-16", 3, 2],
  ["UK", "Uttarakhand", "2027-03-28", 5, 3],
  ["HR", "Haryana", "2029-10-24", 3, 3],
  ["DL", "Delhi", "2030-02-23", 4, 3],
  ["RJ", "Rajasthan", "2028-12-19", 2, 4],
  ["UP", "Uttar Pradesh", "2027-05-22", 5, 4],
  ["BR", "Bihar", "2030-11-30", 7, 4],
  ["SK", "Sikkim", "2029-06-11", 8, 3],
  ["AR", "Arunachal Pradesh", "2029-06-13", 10, 2],
  ["AS", "Assam", "2031-05-20", 10, 3],
  ["NL", "Nagaland", "2028-03-19", 11, 3],
  ["ML", "Meghalaya", "2028-03-05", 9, 4],
  ["MN", "Manipur", "2027-03-13", 11, 4],
  ["TR", "Tripura", "2028-03-23", 9, 5],
  ["MZ", "Mizoram", "2028-12-11", 10, 5],
  ["WB", "West Bengal", "2031-05-14", 8, 5],
  ["GJ", "Gujarat", "2027-12-19", 1, 5],
  ["MP", "Madhya Pradesh", "2028-12-17", 4, 5],
  ["CG", "Chhattisgarh", "2028-12-18", 5, 6],
  ["JH", "Jharkhand", "2029-12-08", 7, 5],
  ["OD", "Odisha", "2029-07-21", 7, 6],
  ["MH", "Maharashtra", "2029-12-06", 3, 6],
  ["GA", "Goa", "2027-03-14", 2, 7],
  ["TG", "Telangana", "2028-12-08", 5, 7],
  ["KA", "Karnataka", "2028-05-21", 3, 8],
  ["AP", "Andhra Pradesh", "2029-06-20", 5, 8],
  ["KL", "Kerala", "2031-05-20", 3, 9],
  ["TN", "Tamil Nadu", "2031-05-10", 4, 9],
  ["PY", "Puducherry", "2031-05-19", 5, 9],
] as const;

const years = [...new Set(assemblies.map(([, , end]) => end.slice(0, 4)))].sort();
const termDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export function AssemblyCalendar() {
  const [year, setYear] = useState(years[0]);
  const upcoming = assemblies.filter(([, , end]) => end.startsWith(year))
    .sort((a, b) => a[2].localeCompare(b[2]));

  return (
    <div className="assembly-calendar">
      <p className="mt-copy">Explore when the current terms end across all 28 states and three Union Territories with Assemblies. The years group term expiries. Polling dates are announced separately by the Election Commission of India.</p>
      <div className="assembly-years" role="group" aria-label="Assembly term-end year">
        {years.map(value => (
          <button type="button" key={value} aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>
        ))}
      </div>
      <div className="assembly-layout">
        <figure>
          <div className="assembly-map" aria-hidden="true">
            {assemblies.map(([code, name, end, column, row]) => (
              <span key={code} title={name} data-active={end.startsWith(year)} style={{ gridColumn: column, gridRow: row }}>{code}</span>
            ))}
          </div>
          <figcaption>Schematic India tile map · Highlighted tiles show terms ending in {year}.</figcaption>
        </figure>
        <div aria-live="polite">
          <h3>{year} Assembly terms</h3>
          <ul>
            {upcoming.map(([code, name, end]) => (
              <li key={code}>
                <span>{code === "MN" ? <Link href="/upcoming-elections/north-east/manipur/">{name} research ↗</Link> : name}</span>
                <time dateTime={end}>{termDate.format(new Date(end))}</time>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="assembly-source"><a href="https://www.eci.gov.in/term-of-the-houses/">Source · ECI Terms of the Houses ↗</a></p>
      <style jsx>{`
        .assembly-years { display:flex; flex-wrap:wrap; gap:.5rem; margin:1.25rem 0; }
        .assembly-years button { border:1px solid #a78a59; background:transparent; color:inherit; padding:.55rem .85rem; font:inherit; cursor:pointer; }
        .assembly-years button[aria-pressed="true"], .assembly-map span[data-active="true"] { background:#dfba7a; color:#14202b; font-weight:700; }
        .assembly-years button:focus-visible { outline:2px solid #dfba7a; outline-offset:3px; }
        .assembly-layout { display:grid; grid-template-columns:minmax(0, 1.2fr) minmax(0, 1fr); gap:clamp(1rem,4vw,3rem); align-items:start; }
        figure { margin:0; }
        .assembly-map { display:grid; grid-template-columns:repeat(11,minmax(0,1fr)); gap:clamp(2px,.5vw,6px); max-width:36rem; }
        .assembly-map span { display:grid; place-items:center; aspect-ratio:1; background:#233646; color:#e5e9ed; font-size:clamp(.58rem,1.1vw,.82rem); }
        figcaption,.assembly-source { font-size:.85rem; margin-top:1rem; }
        h3 { margin:0 0 .55rem; }
        ul { list-style:none; padding:0; margin:0; }
        li { display:flex; flex-wrap:wrap; justify-content:space-between; gap:.2rem .8rem; border-bottom:1px solid #536171; padding:.62rem 0; }
        time { white-space:nowrap; }
        a { text-decoration:underline; text-underline-offset:.2em; }
        @media(max-width:700px) { .assembly-layout { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import boundaries from "./india-assembly-boundaries.json";

// ECI Terms of the Houses, checked 10 November 2026.
const assemblies = [
  ["JK", "Jammu and Kashmir", "2029-11-03"],
  ["HP", "Himachal Pradesh", "2028-01-03"],
  ["PB", "Punjab", "2027-03-16"],
  ["UK", "Uttarakhand", "2027-03-28"],
  ["HR", "Haryana", "2029-10-24"],
  ["DL", "Delhi", "2030-02-23"],
  ["RJ", "Rajasthan", "2028-12-19"],
  ["UP", "Uttar Pradesh", "2027-05-22"],
  ["BR", "Bihar", "2030-11-30"],
  ["SK", "Sikkim", "2029-06-11"],
  ["AR", "Arunachal Pradesh", "2029-06-13"],
  ["AS", "Assam", "2031-05-20"],
  ["NL", "Nagaland", "2028-03-19"],
  ["ML", "Meghalaya", "2028-03-05"],
  ["MN", "Manipur", "2027-03-13"],
  ["TR", "Tripura", "2028-03-23"],
  ["MZ", "Mizoram", "2028-12-11"],
  ["WB", "West Bengal", "2031-05-14"],
  ["GJ", "Gujarat", "2027-12-19"],
  ["MP", "Madhya Pradesh", "2028-12-17"],
  ["CG", "Chhattisgarh", "2028-12-18"],
  ["JH", "Jharkhand", "2029-12-08"],
  ["OD", "Odisha", "2029-07-21"],
  ["MH", "Maharashtra", "2029-12-06"],
  ["GA", "Goa", "2027-03-14"],
  ["TG", "Telangana", "2028-12-08"],
  ["KA", "Karnataka", "2028-05-21"],
  ["AP", "Andhra Pradesh", "2029-06-20"],
  ["KL", "Kerala", "2031-05-20"],
  ["TN", "Tamil Nadu", "2031-05-10"],
  ["PY", "Puducherry", "2031-05-19"],
] as const;

const years = [...new Set(assemblies.map(([, , end]) => end.slice(0, 4)))].sort();
const termDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export function AssemblyCalendar() {
  const [year, setYear] = useState(years[0]);
  const [selected, setSelected] = useState<string | null>(null);
  const upcoming = assemblies.filter(([, , end]) => end.startsWith(year))
    .sort((a, b) => a[2].localeCompare(b[2]));

  return (
    <div className="assembly-calendar">
      <p className="mt-copy">Explore when the current terms end across all 28 states and three Union Territories with Assemblies. The years group term expiries. Polling dates are announced separately by the Election Commission of India.</p>
      <div className="assembly-years" role="group" aria-label="Assembly term-end year">
        {years.map(value => (
          <button type="button" key={value} aria-pressed={year === value} onClick={() => { setYear(value); setSelected(null); }}>{value}</button>
        ))}
      </div>
      <div className="assembly-layout">
        <figure>
          <svg className="assembly-map" viewBox="0 0 620 710" role="group" aria-label="India map by Assembly term-end year">
            {Object.entries(boundaries).map(([name, path]) => {
              const end = assemblies.find(([, state]) => state === name)?.[2];
              const selectState = () => {
                if (end) {
                  setYear(end.slice(0, 4));
                  setSelected(name);
                }
              };
              return (
                <path key={name} d={path} fillRule="evenodd"
                  data-active={end?.startsWith(year)} data-selected={selected === name}
                  role={end ? "button" : undefined} tabIndex={end ? 0 : undefined}
                  aria-label={end ? name + ", Assembly term ends " + termDate.format(new Date(end)) : undefined}
                  aria-pressed={end ? selected === name : undefined}
                  onClick={end ? selectState : undefined}
                  onKeyDown={end ? event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectState();
                    }
                  } : undefined}>
                  <title>{end ? name + " · " + end.slice(0, 4) : name}</title>
                </path>
              );
            })}
          </svg>
          <figcaption>Gold shows terms ending in {year}. Select a state to highlight its entry.</figcaption>
        </figure>
        <div aria-live="polite">
          <h3>{year} Assembly terms</h3>
          <ul>
            {upcoming.map(([code, name, end]) => (
              <li key={code} data-selected={selected === name}>
                <span>{code === "MN" ? <Link href="/upcoming-elections/north-east/manipur/">{name} research ↗</Link> : name}</span>
                <time dateTime={end}>{termDate.format(new Date(end))}</time>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="assembly-source"><a href="https://www.eci.gov.in/term-of-the-houses/">Source · ECI Terms of the Houses ↗</a> · <a href="https://github.com/Vardhan-Systems/vardhan-maps/blob/2c829a3543171810a4b28162ea736fb76dfdef40/src/data/generated/states.low.json">Map data</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> (<a href="https://opendatacommons.org/licenses/odbl/1-0/">ODbL</a>)</p>
      <style jsx>{`
        .assembly-years { display:flex; flex-wrap:wrap; gap:.5rem; margin:1.25rem 0; }
        .assembly-years button { border:1px solid #a78a59; background:transparent; color:inherit; padding:.55rem .85rem; font:inherit; cursor:pointer; }
        .assembly-years button[aria-pressed="true"] { background:#dfba7a; color:#14202b; font-weight:700; }
        .assembly-years button:focus-visible { outline:2px solid #dfba7a; outline-offset:3px; }
        .assembly-layout { display:grid; grid-template-columns:minmax(0, 1.2fr) minmax(0, 1fr); gap:clamp(1rem,4vw,3rem); align-items:start; }
        figure { margin:0; }
        .assembly-map { display:block; width:100%; max-height:32rem; }
        .assembly-map path { fill:#344c60; stroke:#14202b; stroke-width:1; }
        .assembly-map path[data-active="true"] { fill:#dfba7a; }
        .assembly-map path[role="button"] { cursor:pointer; }
        .assembly-map path:focus-visible, .assembly-map path[data-selected="true"] { stroke:#fff; stroke-width:2; outline:none; }
        li[data-selected="true"] { color:#dfba7a; font-weight:700; }
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

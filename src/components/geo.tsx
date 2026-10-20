"use client";
import { geoIdentity, geoPath } from "d3-geo";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { useEffect, useId, useMemo, useState } from "react";
import { partyColors, winner, registeredWinner, contest } from "@/lib/data";
type Props = {
  year?: number;
  segmentResults?: {ac:number;party:string;votes:number;marginPct:number}[];
  selected?: number;
  onSelect?: (id: number) => void;
  hero?: boolean;
  metric?: string;
  party?: string;
};
export function GeoMap({
  year = 2022,
  segmentResults,
  selected,
  onSelect,
  hero = false,
  metric = "party",
  party = "",
}: Props) {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  const clip = useId().replaceAll(":", "");
  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BASE_PATH || "") + "/data/manipur.json")
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);
  const render = useMemo(() => {
    if (!data) return null;
    const projection = geoIdentity()
      .reflectY(true)
      .fitExtent(
        [
          [38, 18],
          [622, 612],
        ],
        data,
      );
    const path = geoPath(projection);
    return { path, projection, paths: data.features.map((f) => path(f) || "") };
  }, [data]);
  if (error)
    return (
      <div className="map-empty">
        Reference geography could not load.{" "}
        <a href="https://ceomanipur.nic.in/ACMap/ACSMap">
          View official maps ↗
        </a>
      </div>
    );
  if (!data || !render)
    return (
      <div className="map-empty" role="status">
        Loading reference geography…
      </div>
    );
  const hovered = data.features.find(
    (f) => Number(f.properties?.AC_NO) === hover,
  );
  const p1 = render.projection([92.7, 26.4])!,
    p2 = render.projection([95, 23.5])!;
  return (
    <div className={hero ? "geo-map hero-geo" : "geo-map"}>
      <svg
        viewBox="0 0 660 640"
        role="img"
        aria-label={
          hero
            ? "Relief context of Manipur using documented reference boundaries"
            : "Interactive constituency map; each shape is keyboard selectable"
        }
      >
        <defs>
          <clipPath id={clip}>
            {data.features.map((f, i) => (
              <path key={i} d={render.paths[i]} />
            ))}
          </clipPath>
          <linearGradient id={clip + "g"} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#acc4b3" />
            <stop offset="1" stopColor="#284849" />
          </linearGradient>
        </defs>
        <g
          transform={
            "translate(330 320) scale(" + zoom + ") translate(-330 -320)"
          }
        >
          {hero && (
            <>
              <g clipPath={"url(#" + clip + ")"}>
                <rect width="660" height="640" fill={"url(#" + clip + "g)"} />
                <image
                  href={
                    (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/terrain.jpg"
                  }
                  x={p1[0]}
                  y={p1[1]}
                  width={p2[0] - p1[0]}
                  height={p2[1] - p1[1]}
                  preserveAspectRatio="none"
                  className="terrain-image"
                />
              </g>
            </>
          )}
          {data.features.map((f: Feature<Geometry>, i) => {
            const id = Number(f.properties?.AC_NO),
              w = segmentResults ? segmentResults.find(r=>r.ac===id) : winner(year, id) || registeredWinner(year, id),
              isSelected = id === selected;
            let fill = hero
              ? "transparent"
              : w
                ? partyColors[w.party] || partyColors.OTHER
                : "#354453";
            if (metric === "margin") {
              const rows = contest(year, id),
                sum = rows.reduce((s, r) => s + r.votes, 0);
              const gap = segmentResults ? segmentResults.find(r=>r.ac===id)?.marginPct ?? null :
                rows.length > 1 && sum
                  ? ((rows[0].votes - rows[1].votes) / sum) * 100
                  : null;
              fill =
                gap == null
                  ? "#354453"
                  : gap < 5
                    ? "#f1e7cf"
                    : gap < 10
                      ? "#d6bc82"
                      : gap < 20
                        ? "#a88041"
                        : "#725122";
            }
            return (
              <path
                key={i}
                d={render.paths[i]}
                fill={fill}
                opacity={
                  party && party !== "All parties" && w?.party !== party
                    ? 0.2
                    : 1
                }
                stroke={isSelected ? "#ffffff" : hero ? "#e2cd9e" : "#132333"}
                strokeWidth={isSelected ? 2.8 : hero ? 0.6 : 1.2}
                className={
                  hero
                    ? "state-outline"
                    : isSelected
                      ? "constituency selected"
                      : "constituency"
                }
                tabIndex={hero ? -1 : 0}
                role={hero ? undefined : "button"}
                aria-label={
                  hero
                    ? undefined
                    : id +
                      ". " +
                      f.properties?.AC_NAME +
                      (w
                        ? ", " + w.party + (segmentResults ? " segment leader " : " winner ") + year
                        : ", result unavailable")
                }
                aria-pressed={hero ? undefined : isSelected}
                onClick={() => onSelect?.(id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(id);
                  }
                }}
                onMouseEnter={() => setHover(id)}
                onMouseLeave={() => setHover(null)}
              >
                <title>
                  {f.properties?.AC_NAME}
                  {w ? " · " + w.party : " · No verified result loaded"}
                </title>
              </path>
            );
          })}
        </g>
        {hero && (
          <>
            <text x="438" y="323" className="map-place">
              IMPHAL
            </text>
            <circle cx="425" cy="320" r="3" fill="#f5f1e8" />
            <text
              x="502"
              y="540"
              className="map-country"
              transform="rotate(-72 502 540)"
            >
              MYANMAR
            </text>
            <text x="68" y="160" className="map-country">
              ASSAM
            </text>
            <text x="385" y="35" className="map-country">
              NAGALAND
            </text>
          </>
        )}
      </svg>
      {!hero && (
        <>
          <div className="map-zoom">
            <button
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(z + 0.3, 2.5))}
            >
              +
            </button>
            <button aria-label="Reset map zoom" onClick={() => setZoom(1)}>
              ↺
            </button>
            <button
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(z - 0.3, 1))}
            >
              −
            </button>
          </div>
          <div className="map-tooltip" aria-live="polite">
            {hovered
              ? String(hovered.properties?.AC_NO).padStart(2, "0") +
                " / " +
                hovered.properties?.AC_NAME
              : "Explore a constituency"}
          </div>
        </>
      )}
    </div>
  );
}

"use client";
import { seatTotals, partyColors, electionSource } from "@/lib/data";
export function ChartExport({ year }: { year: number }) {
  const rows = seatTotals(year);
  function save() {
    const escape = (v: string) =>
      v
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll('"', "&quot;");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650"><rect width="1000" height="650" fill="#101d2a"/><text x="50" y="65" fill="#f3efe6" font-family="Georgia" font-size="36">Manipur ' +
      year +
      " · Assembly seats won</text>" +
      rows
        .map(
          ([p, n], i) =>
            '<text x="50" y="' +
            (125 + i * 60) +
            '" fill="#f3efe6" font-family="Arial" font-size="18">' +
            escape(p) +
            '</text><rect x="145" y="' +
            (105 + i * 60) +
            '" width="' +
            (n / 60) * 700 +
            '" height="25" fill="' +
            (partyColors[p] || "#aaa") +
            '"/><text x="' +
            (160 + (n / 60) * 700) +
            '" y="' +
            (125 + i * 60) +
            '" fill="#f3efe6" font-family="Arial" font-size="18">' +
            n +
            "</text>",
        )
        .join("") +
      '<text x="50" y="590" fill="#adb8bf" font-family="Arial" font-size="13">Source: CEO Manipur. Election-day result; 60 seats. Subsequent changes excluded.</text><text x="50" y="615" fill="#adb8bf" font-family="Arial" font-size="10">' +
      escape(electionSource(year)) +
      "</text></svg>";
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "manipur-" + year + "-seats.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button className="chart-export" disabled={!rows.length} onClick={save}>
      Download sourced chart · SVG ↗
    </button>
  );
}

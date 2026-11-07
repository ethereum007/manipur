import Link from "next/link";
export function SourceNote({
  year,
  children,
}: {
  year?: number;
  children?: React.ReactNode;
}) {
  return (
    <p className="source-note">
      <span className="source-mark">↗</span>{" "}
      {children || (
        <>
          Source:{" "}
          <a
            href={"https://ceomanipur.nic.in/StatisticalReports"}
            target="_blank"
            rel="noreferrer"
          >
            CEO Manipur · Statistical report {year}
          </a>
          . Election-day results; subsequent changes are separate.
        </>
      )}
    </p>
  );
}
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{description}</p>
    </header>
  );
}
export function Missing({ label = "Not yet verified" }: { label?: string }) {
  return <span className="missing">{label}</span>;
}
export function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <span aria-hidden>↗</span>
    </Link>
  );
}
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span className="brand-icon" aria-hidden>
          m.
        </span>
        <span>
          MANDATE <b>TERRAIN</b>
          <small>POLITICAL RESEARCH</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/upcoming-elections/">Upcoming Elections</Link>
        <Link href="/upcoming-elections/north-east/manipur/">Manipur Research</Link>
        
        
        
      </nav>
      <Link className="header-source" href="/sources">
        Sources & methods <span aria-hidden>↗</span>
      </Link>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Mandate Terrain<span>Political Research &amp; Consulting</span>
        </Link>
        <p>Independent election, constituency and policy research.</p>
      </div>
      <div>
        <Link href="/upcoming-elections/">Upcoming Elections</Link>
        <Link href="/representation">Representation register</Link>
        <Link href="/policy">Policy evidence</Link>
        <Link href="/discover">Discover Manipur</Link>
        <Link href="/sources">Sources & methodology</Link>
        <Link href="/constituencies">All 60 constituencies</Link>
        <Link href="/briefing">Five-minute walkthrough ↗</Link>
        <Link href="/presentation">Full executive briefing ↗</Link>
      </div>
      <p className="footer-note">
        Evidence before interpretation.
        <br />
        No forecasts. No voter targeting.
        <br />
        Public records and source notes
      </p>
    </footer>
  );
}

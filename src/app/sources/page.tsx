import { PageIntro, SourceNote } from "@/components/ui";
import { sourceRegister, results } from "@/lib/data";
import { notes } from "@/lib/research";
import quality from "../../../data/processed/data-quality.json";
export const metadata = { title: "Sources & methodology" };
export default function Sources() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <>
      <PageIntro
        label="SOURCES & METHODOLOGY"
        title="Evidence before interpretation."
        description="The archive, definitions, verification rules and limits behind this atlas."
      />
      <section className="directory-section">
        <div className="chart-heading">
          <h2>Coverage, made visible.</h2>
          <span>RESEARCH EDITION</span>
        </div>
        <div className="table-scroll">
          <table>
            <caption>
              {results.length} published candidate-election records · Quality
              report generated {quality.generatedAt.slice(0, 10)}
            </caption>
            <thead>
              <tr>
                <th>Assembly election</th>
                <th>Candidate contests</th>
                <th>Independent winner register</th>
                <th>Missing candidate contests</th>
              </tr>
            </thead>
            <tbody>
              {quality.years.map((y) => (
                <tr key={y.year}>
                  <th>{y.year}</th>
                  <td>{y.candidateContests} / 60</td>
                  <td>{y.winnerRecords} / 60</td>
                  <td>{y.missingContests.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">
          Whole contests are withheld when candidate totals, NOTA/rejected votes
          or independent winning-party checks do not reconcile. An independently
          verified winner may still appear on the map while candidate totals are
          unavailable.
        </p>
        <div className="download-links"><a href={base+"/data/winners.json"} download>All 180 Assembly winners · JSON ↗</a><a href={base+"/data/parliament-2024.json"} download>2024 parliamentary results · JSON ↗</a><a href={base+"/data/candidate-register.json"} download>Candidate register · JSON ↗</a>
          <a href={base + "/data/results.json"} download>
            Public results · JSON ↗
          </a>
          <a href={base + "/data/results.csv"} download>
            Public results · CSV ↗
          </a>
          <a href={base + "/data/data-quality.json"} download>
            Quality report · JSON ↗
          </a>
          <a href="https://github.com/ethereum007/manipur/tree/main/data/processed">
            Extracted source records ↗
          </a>
        </div>
        <p className="source-note">
          Downloads contain public candidate-level election data, provenance and
          source locators. Original publications retain their rights. No
          personal contact, address, voter-roll identifier or bank details are
          exported.
        </p>
      </section>
      <section className="editorial-section">
        <h2>The source register.</h2>
        <div className="reading-grid source-grid" style={{ marginTop: 40 }}>
          {sourceRegister.map((s) => (
            <a key={s.id} href={s.url}>
              <span>{s.publisher}</span>
              <h3>{s.title || s.id}</h3>
              <p>Primary publication · Accessed {s.accessed}</p>
              <b>Open document ↗</b>
            </a>
          ))}
          {notes.sources.map((s) => (
            <a key={s.id} href={s.url}>
              <span>{s.publisher}</span>
              <h3>{s.title}</h3>
              <p>{s.reference}</p>
              <b>Open source ↗</b>
            </a>
          ))}
        </div>
      </section>
      <section className="profile-section">
        <h2>
          How to read
          <br />
          <em>the numbers.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Votes are transcribed source values. Winning margin is winner minus
            runner-up. Candidate shares divide candidate votes by the sum of
            candidate votes, excluding NOTA and rejected ballots. Statewide vote
            shares require all 60 candidate contests.
          </p>
          <p>
            Turnout is withheld because electors and votes-polled definitions
            vary between the 2017 report's summary and Form 20 tables. A correct
            calculation with an incompatible denominator would still mislead.
          </p>
          <p>
            Election-day seats differ from current party representation. Similar
            names never cause automatic person-level merges. The Biren Singh
            career is a reviewed match supported by the official Assembly
            profile; other entries remain election-scoped.
          </p>
          <p>
            Reference geography: DataMeet, CC BY 2.5 India. Its publisher marks
            Manipur as pre-delimitation and warns of positional shifts.
            Multipart features are dissolved by official constituency number;
            this is a navigation aid, not a certified current survey.{" "}
            <a href="https://ceomanipur.nic.in/ACMap/ACSMap">
              Official constituency maps ↗
            </a>
            .
          </p>
          <p>
            Relief: Esri World Shaded Relief, Esri / USGS / NOAA. Fonts: Source
            Sans 3 and Libre Caslon Display, SIL Open Font License.
          </p>
          <p>
            Selected governance records through 5 October 2026; subsequent events not indexed.
            Economic and Census indicators are dated observations. No opinion
            polling or numerical forecasts are included.
          </p>
          <p>
            ADR's 2017 Biren Singh winners report differs from its MyNeta
            totals. Financial comparisons for that year are withheld. The 2022
            transcription is explicitly secondary and self-declared.
          </p>
          <SourceNote>
            <a href="https://github.com/ethereum007/manipur/blob/main/LIMITATIONS.md">
              Full limitations register ↗
            </a>{" "}
            ·{" "}
            <a href="https://github.com/ethereum007/manipur/blob/main/DATA_DICTIONARY.md">
              Data dictionary ↗
            </a>
          </SourceNote>
        </div>
      </section>
    </>
  );
}

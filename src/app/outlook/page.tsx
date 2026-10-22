import Link from 'next/link';
import { PageIntro } from "@/components/ui";
import { ScenarioExplorer } from "@/components/scenario-explorer";
export const metadata = { title: "The road to 2027" };
export default function Outlook() {
  return (
    <>
      <PageIntro
        label="THE ROAD TO 2027"
        title="Evidence. Assumptions. Uncertainty."
        description="Explore five neutral scenarios. None is assigned a probability, a seat prediction or a campaign recommendation."
      />
      <section className="analysis-block"><p className="eyebrow">NEW / FORECAST RESEARCH</p><h2>Test the method<br/><em>before trusting the number.</em></h2><p className="lead">Replay two historical Assembly benchmarks, inspect every seat-level miss, and examine the evidence still needed for a 2027 probability model.</p><p>The repeat-winning-party rule matches 23/60 outcomes in 2017 and 26/59 comparable outcomes in 2022. Historical agreement is not a probability of future victory.</p><Link className="primary-link" href="/outlook/validation">Open the forecast validation lab <span>↗</span></Link></section>
      <aside className="research-crosslink"><Link className="text-link" href="/outlook/inputs">Explore all 60 seats: forecasting inputs, vintages and missing evidence ↗</Link><p><Link className="text-link" href="/outlook/boundaries">Before extending history: inspect the boundary evidence ↗</Link></p></aside><ScenarioExplorer />
      <section className="profile-section">
        <h2>
          What history
          <br />
          <em>cannot tell us.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Historical constituency outcomes are descriptions of past contests.
            A validated forecast would require additional assumptions, current
            candidate and alliance information, and a transparent model tested
            outside its training window.
          </p>
          <p>
            No reliable opinion polling is included in this edition. The 2027
            election schedule, candidate nominations and alliances are not
            presumed. Changes in participation, governance and election
            administration remain important uncertainties.
          </p>
          <p>
            Research priorities: date nomination, affiliation and alliance evidence; extend Assembly evaluation history; test prospective model assumptions; and document local public-service conditions. All sixty 2024 ordinary Parliamentary segments are already indexed separately.
          </p>
        </div>
      </section>
    <aside className="research-crosslink"><p className="eyebrow">THE DEEPER RESEARCH</p><Link className="text-link" href="/analysis/2027-evidence">Read the detailed study and connected evidence ↗</Link></aside></>
  );
}

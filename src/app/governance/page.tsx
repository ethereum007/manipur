import { PageIntro } from "@/components/ui";
import { GovernanceTimeline } from "@/components/governance-timeline";
export const metadata = { title: "Conflict & governance" };
export default function Governance() {
  return (
    <>
      <PageIntro
        label="CONFLICT & GOVERNANCE"
        title="A chronology, with care."
        description="Dated records of violence, relief and political administration. Documentary facts are separated from official claims and unresolved questions."
      />
      <GovernanceTimeline />
      <section className="profile-section">
        <h2>
          Humanitarian
          <br />
          <em>questions remain.</em>
        </h2>
        <div className="evidence-copy">
          <p>
            Displacement, safety, rehabilitation, education, healthcare,
            livelihoods and reconciliation require dated, geographically
            specific evidence. No current casualty or displacement total is
            published without a reconciled reporting date and denominator.
          </p>
          <p>
            This initial chronology is not an exhaustive account of the conflict
            or a conclusion about responsibility. Detailed local reporting,
            community perspectives, court developments and events after 5
            October 2026 remain research gaps.
          </p>
        </div>
      </section>
    </>
  );
}

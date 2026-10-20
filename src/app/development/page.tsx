import Link from 'next/link';
import { FiscalExplorer } from "@/components/fiscal-explorer";
import { PageIntro } from "@/components/ui";
import { DevelopmentExplorer } from "@/components/development-explorer";
export const metadata = { title: "Economy & development" };
export default function Development() {
  return (
    <>
      <aside className="research-crosslink"><Link className="text-link" href="/policy">Public services: read the policy evidence desk ↗</Link></aside><PageIntro
        label="ECONOMY & DEVELOPMENT"
        title="The economy, with its dates intact."
        description="Reference-year indicators with estimate status, source vintage and gaps kept in view."
      />
      <FiscalExplorer />
      <DevelopmentExplorer />
    <aside className="research-crosslink"><p className="eyebrow">THE DEEPER RESEARCH</p><Link className="text-link" href="/analysis/economy">Read the detailed study and connected evidence ↗</Link></aside></>
  );
}

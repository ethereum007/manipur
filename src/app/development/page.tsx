import { PageIntro } from "@/components/ui";
import { DevelopmentExplorer } from "@/components/development-explorer";
export const metadata = { title: "Economy & development" };
export default function Development() {
  return (
    <>
      <PageIntro
        label="ECONOMY & DEVELOPMENT"
        title="A baseline, not the present."
        description="Reference-year indicators with estimate status, source vintage and gaps kept in view."
      />
      <DevelopmentExplorer />
    </>
  );
}

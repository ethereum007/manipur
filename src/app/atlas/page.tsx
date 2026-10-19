import {PageIntro} from "@/components/ui";import {AtlasExplorer} from "@/components/atlas-explorer";
export const metadata={title:"Electoral atlas"};
export default function Atlas(){return <><PageIntro label="THE ELECTORAL ATLAS" title="Sixty constituencies. One state." description="Explore the results. Follow the changes. Read the detail behind every seat."/><AtlasExplorer/></>}

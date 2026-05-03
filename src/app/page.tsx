import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const continents = await getContinentsWithDestinationDescriptions();

  return (
    <>
      <SplitScreenSection continents={continents} />
    </>
  );
}

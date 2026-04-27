import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { getContinents } from "@/lib/mock-data";

export default function HomePage() {
  const continents = getContinents();

  return (
    <>
      <SplitScreenSection continents={continents} />
    </>
  );
}

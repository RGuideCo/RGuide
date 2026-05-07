import { HomeServerContent } from "@/components/home/HomeServerContent";
import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);

  return (
    <ProgressiveEnhancementShell
      fallback={<HomeServerContent continents={continents} editorialGuides={editorialGuides} />}
    >
      <SplitScreenSection continents={continents} initialEditorialGuides={editorialGuides} />
    </ProgressiveEnhancementShell>
  );
}

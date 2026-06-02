import { HomeServerContent } from "@/components/home/HomeServerContent";
import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 21600;

export default async function HomePage() {
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);

  return (
    <ProgressiveEnhancementShell
      fallback={<HomeServerContent continents={continents} editorialGuides={editorialGuides} />}
    >
      <SplitScreenClientLoader initialAppData={{ continents, guides: editorialGuides }} />
    </ProgressiveEnhancementShell>
  );
}

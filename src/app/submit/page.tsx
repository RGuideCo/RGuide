import type { Metadata } from "next";

import { continents } from "@/data";
import { SubmitWorkspace } from "@/components/list/SubmitWorkspace";

export const metadata: Metadata = {
  title: "Submit a List",
  description: "Front-end submission flow for curated Google Maps guides on RGuide.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 py-10 sm:px-4 lg:px-6">
      <SubmitWorkspace continents={continents} />
    </div>
  );
}

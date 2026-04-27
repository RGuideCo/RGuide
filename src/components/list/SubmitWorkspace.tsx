"use client";

import { useMemo, useState } from "react";

import { ListGuideWorkspace } from "@/components/list/ListGuideWorkspace";
import { SubmitListForm } from "@/components/list/SubmitListForm";
import { SubmitMapPanel } from "@/components/list/SubmitMapPanel";
import { Continent, MapList, SelectionState } from "@/types";

interface SubmitWorkspaceProps {
  continents: Continent[];
}

export function SubmitWorkspace({ continents }: SubmitWorkspaceProps) {
  const [selection, setSelection] = useState<SelectionState>({});
  const [submittedList, setSubmittedList] = useState<MapList | null>(null);
  const [previewList, setPreviewList] = useState<MapList | null>(null);
  const submitSelectionList = useMemo(
    () =>
      submittedList
        ? ({
            ...submittedList,
            location: {
              ...submittedList.location,
              city: submittedList.location.city ?? undefined,
              neighborhood: submittedList.location.neighborhood ?? undefined,
            },
          } as MapList)
        : null,
    [submittedList],
  );

  if (submitSelectionList) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setSubmittedList(null)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
          >
            Back to submission
          </button>
        </div>
        <ListGuideWorkspace list={submitSelectionList} continents={continents} />
      </div>
    );
  }

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(560px,1fr)]">
      <SubmitMapPanel continents={continents} selection={selection} activeGuide={previewList} />
      <div className="h-[68vh] min-h-[620px]">
        <SubmitListForm
          onSelectionChange={setSelection}
          onPreviewListChange={setPreviewList}
          onSubmitted={setSubmittedList}
          hideModeToggle
          fillPane
        />
      </div>
    </div>
  );
}

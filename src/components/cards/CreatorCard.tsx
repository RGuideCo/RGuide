import Image from "next/image";
import Link from "next/link";

import { getCreatorHref } from "@/lib/routes";
import { User } from "@/types";

interface CreatorCardProps {
  creator: User;
  listCount: number;
}

export function CreatorCard({ creator, listCount }: CreatorCardProps) {
  return (
    <Link href={getCreatorHref(creator)} className="surface block p-5 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <Image
            src={creator.avatar}
            alt={creator.name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </span>
        <div>
          <p className="text-lg font-semibold text-slate-900">{creator.name}</p>
          <p className="text-sm text-slate-600">{listCount} published lists</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{creator.bio}</p>
    </Link>
  );
}

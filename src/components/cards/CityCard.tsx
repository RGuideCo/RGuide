import Image from "next/image";
import Link from "next/link";
import { MapPinned } from "lucide-react";

import { getCityHref } from "@/lib/routes";
import { formatNumber } from "@/lib/utils";
import { City } from "@/types";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={getCityHref(city)} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/0 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xl font-semibold">{city.name}</p>
            <p className="text-sm text-white/80">{city.country}</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            {formatNumber(city.listCount)} lists
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-5 py-4 text-sm text-slate-600">
        <MapPinned className="h-4 w-4 text-orange-500" />
        Curated Google Maps guides for neighborhoods, food, culture, and more.
      </div>
    </Link>
  );
}

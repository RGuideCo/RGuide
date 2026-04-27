import { useState } from "react";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

const US_STATE_IDS = new Set([
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "district-of-columbia",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new-hampshire",
  "new-jersey",
  "new-mexico",
  "new-york",
  "north-carolina",
  "north-dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode-island",
  "south-carolina",
  "south-dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west-virginia",
  "wisconsin",
  "wyoming",
]);

interface StateShapeIconProps {
  countryId?: string;
  stateId: string;
  className?: string;
}

export function StateShapeIcon({ countryId, stateId, className }: StateShapeIconProps) {
  const [fallbackToPin, setFallbackToPin] = useState(false);
  const normalizedCountryId = (countryId ?? "").toLowerCase();
  const isUsCountry =
    !countryId || normalizedCountryId === "usa" || normalizedCountryId === "united-states" || normalizedCountryId === "unitedstates";
  const isUsState = US_STATE_IDS.has(stateId) && isUsCountry;

  if (!isUsState || fallbackToPin) {
    return <MapPin className={cn("h-4 w-4", className)} />;
  }

  return (
    <>
      <span
        aria-hidden="true"
        className={cn("h-4 w-5 shrink-0", className)}
        style={{
          backgroundColor: "#334155",
          opacity: 0.85,
          WebkitMaskImage: `url(/assets/us-states/${stateId}.svg)`,
          maskImage: `url(/assets/us-states/${stateId}.svg)`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
      <img
        src={`/assets/us-states/${stateId}.svg`}
        alt=""
        aria-hidden="true"
        className="hidden"
        onError={() => setFallbackToPin(true)}
      />
    </>
  );
}

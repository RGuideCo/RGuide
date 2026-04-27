import { getCountryFlagEmoji } from "@/lib/country-flag";

interface CountryFlagProps {
  countryName: string;
}

export function CountryFlag({ countryName }: CountryFlagProps) {
  const flag = getCountryFlagEmoji(countryName);

  if (!flag) {
    return <span className="inline-flex h-4 w-4 rounded-full bg-slate-300" aria-hidden="true" />;
  }

  return (
    <span
      className="inline-flex min-w-[1.1rem] items-center justify-center text-sm leading-none"
      aria-hidden="true"
    >
      {flag}
    </span>
  );
}


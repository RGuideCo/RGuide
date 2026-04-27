import { LoadingCard } from "@/components/shared/LoadingCard";

export default function Loading() {
  return (
    <div className="page-shell py-10">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </div>
  );
}

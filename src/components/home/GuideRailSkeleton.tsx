type GuideRailSkeletonProps = {
  locationName: string;
};

const TITLE_WIDTHS = ["62%", "48%", "71%", "55%"];
const META_WIDTHS = ["30%", "38%", "27%", "34%"];
const SOURCE_WIDTHS = ["42%", "34%", "48%", "39%"];

export function GuideRailSkeleton({ locationName }: GuideRailSkeletonProps) {
  return (
    <div className="guide-rail-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Loading {locationName} guides</span>
      {TITLE_WIDTHS.map((titleWidth, index) => (
        <div
          key={`${titleWidth}-${index}`}
          className="guide-rail-skeleton-item"
          style={{ "--skeleton-delay": `${index * 85}ms` } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="guide-rail-skeleton-image guide-rail-skeleton-shimmer" />
          <div className="guide-rail-skeleton-card">
            <div className="guide-rail-skeleton-heading">
              <div className="guide-rail-skeleton-title-group" style={{ width: titleWidth }}>
                <span className="guide-rail-skeleton-title guide-rail-skeleton-shimmer" />
              </div>
              <div className="guide-rail-skeleton-actions">
                <span className="guide-rail-skeleton-action guide-rail-skeleton-shimmer" />
                <span className="guide-rail-skeleton-action guide-rail-skeleton-shimmer" />
                <span className="guide-rail-skeleton-chevron guide-rail-skeleton-shimmer" />
              </div>
            </div>
            <div className="guide-rail-skeleton-meta">
              <span
                className="guide-rail-skeleton-chip guide-rail-skeleton-shimmer"
                style={{ width: META_WIDTHS[index] }}
              />
              <span className="guide-rail-skeleton-meta-line guide-rail-skeleton-shimmer" />
            </div>
            <div className="guide-rail-skeleton-divider" />
            <div className="guide-rail-skeleton-sources">
              <span className="guide-rail-skeleton-source-icon guide-rail-skeleton-shimmer" />
              <span className="guide-rail-skeleton-source-icon guide-rail-skeleton-shimmer" />
              <span
                className="guide-rail-skeleton-source-line guide-rail-skeleton-shimmer"
                style={{ width: SOURCE_WIDTHS[index] }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

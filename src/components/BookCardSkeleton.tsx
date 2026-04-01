const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

export const BookCardSkeleton = () => {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-start">
      <SkeletonBlock className="h-32 w-24 shrink-0 rounded-md" />

      <div className="min-w-0 flex-1 space-y-3">
        <SkeletonBlock className="h-4 w-2/3" />
        <SkeletonBlock className="h-3 w-1/2" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>

      <SkeletonBlock className="h-9 w-28 shrink-0 rounded-xl" />
    </li>
  );
};

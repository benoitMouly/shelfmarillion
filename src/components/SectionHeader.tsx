import type { SectionHeaderProps } from "../features/books/types/section-header-props.type";

export const SectionHeader = ({ title, titleId, subtitle, children }: SectionHeaderProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 id={titleId} className="text-xl font-semibold text-text-heading">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-text-body">{subtitle}</p>
        ) : null}
      </div>

      {children ? (
        <div className="shrink-0">{children}</div>
      ) : null}
    </div>
  );
};

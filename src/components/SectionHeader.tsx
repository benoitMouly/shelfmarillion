import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export const SectionHeader = ({ title, subtitle, children }: SectionHeaderProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-slate-600">{subtitle}</p>
        ) : null}
      </div>

      {children ? (
        <div className="shrink-0">{children}</div>
      ) : null}
    </div>
  );
};

import type { ReactNode } from "react";

export type SectionHeaderProps = {
  title: string;
  titleId?: string;
  subtitle?: string;
  children?: ReactNode;
};
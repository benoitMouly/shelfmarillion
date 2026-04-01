type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-text-heading">{title}</h1>
      {subtitle ? (
        <p className="text-sm text-text-body">{subtitle}</p>
      ) : null}
    </header>
  );
};

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h1 className="text-2xl font-semibold leading-tight text-ink sm:text-3xl">{title}</h1>
      {description ? <p className="max-w-2xl text-sm leading-6 text-cocoa">{description}</p> : null}
    </div>
  );
}

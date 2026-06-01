import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
          {detail ? <p className="mt-1 text-xs text-cocoa">{detail}</p> : null}
        </div>
        {icon ? <div className="rounded-md bg-linen p-2 text-clay">{icon}</div> : null}
      </div>
    </div>
  );
}

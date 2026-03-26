export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-overlay p-5 flex gap-4 items-start">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-white/30 mb-1 tracking-wide uppercase">
          {label}
        </p>
        <p className="text-xl font-semibold leading-none">{value}</p>
        <p className="text-[11px] text-white/30 mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

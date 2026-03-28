import { Button } from "@/src/components/ui/button";

export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`text-[11px] px-3 py-1.5 rounded-md capitalize transition-colors whitespace-nowrap h-auto font-normal ${
        active
          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 hover:text-violet-300"
          : "text-white/30 hover:text-white/60 border border-transparent hover:border-white/10"
      }`}
    >
      {label}
    </Button>
  );
}

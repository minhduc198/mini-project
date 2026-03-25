import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { SortKey } from "../features/customer/types/types";

export function SortBtn<T>({
  label,
  colKey,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  colKey: SortKey<T>;
  sortKey: SortKey<T>;
  sortDir: "asc" | "desc";
  onSort: (k: SortKey<T>) => void;
}) {
  const active = colKey === sortKey;
  return (
    <button
      onClick={() => onSort(colKey)}
      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md transition-colors ${
        active
          ? "bg-violet-500/20 text-violet-300"
          : "text-white/30 hover:text-white/60"
      }`}
    >
      {label}
      {active ? (
        sortDir === "asc" ? (
          <ArrowUp size={10} />
        ) : (
          <ArrowDown size={10} />
        )
      ) : (
        <ArrowUpDown size={10} className="text-white/20" />
      )}
    </button>
  );
}

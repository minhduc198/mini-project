import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | "…")[]>((acc, n, idx, arr) => {
      if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);

  const from = total === 0 ? 0 : Math.min((page - 1) * perPage + 1, total);
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.06]">
      <p className="text-[11px] text-white/25">
        Showing{" "}
        <span className="text-white/50">
          {from}–{to}
        </span>{" "}
        of <span className="text-white/50">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors h-auto"
        >
          <ChevronLeft size={14} />
        </Button>

        {pageNumbers.map((n, i) =>
          n === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-white/20 text-xs">
              …
            </span>
          ) : (
            <Button
              key={n}
              type="button"
              variant="ghost"
              onClick={() => onPageChange(n as number)}
              className={`w-7 h-7 rounded-md text-[11px] transition-colors min-h-7 p-0 ${
                page === n
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 hover:text-violet-300"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              {n}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors h-auto"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

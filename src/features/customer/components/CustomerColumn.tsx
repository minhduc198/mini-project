import { formatDate, formatShortNumber } from "@/lib/utils";
import { Checkbox } from "@/src/components/CheckBox";
import { ColumnHeader } from "@/src/types";
import { Mail, MailX } from "lucide-react";
import Image from "next/image";
import { Customer, Group } from "../types/types";
import { GROUP_LABELS, GROUP_STYLE } from "../constants";

export const CustomerColumn = ({
  selectedIds,
  toggleRow,
}: {
  selectedIds: Set<number>;
  toggleRow: (id: number) => void;
}): ColumnHeader<Customer>[] => [
  {
    id: "id",
    label: "",
    cellRender: (row) => (
      <Checkbox
        checked={selectedIds.has(row.id)}
        onChange={() => toggleRow(row.id)}
      />
    ),
  },

  {
    id: "avatar",
    label: "",
    cellRender: (row) => (
      <div className="w-8 h-8 relative rounded-full overflow-hidden ring-1 ring-white/10 bg-white/5 shrink-0">
        {row.avatar ? (
          <Image
            sizes="32px"
            src={row.avatar}
            alt={row.first_name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-[11px] font-medium text-white/40">
            {row.first_name?.[0]}
            {row.last_name?.[0]}
          </span>
        )}
      </div>
    ),
  },

  {
    id: "first_name",
    label: "Name",
    cellRender: (row) => (
      <div>
        <div className="font-medium text-white/80 leading-none mb-1 whitespace-nowrap">
          {row.first_name} {row.last_name}
        </div>
        <div className="text-[11px] text-white/25">{row.email}</div>
      </div>
    ),
  },

  {
    id: "city",
    label: "City",
    cellRender: (row) => (
      <div>
        <div className="text-white/60 whitespace-nowrap text-xs">
          {row.city ?? "—"}
        </div>
        <div className="text-[11px] text-white/25 truncate max-w-[180px]">
          {row.address ?? ""}
        </div>
      </div>
    ),
  },

  {
    id: "groups",
    label: "Group",
    cellRender: (row) => (
      <div className="flex flex-wrap gap-1">
        {(row.groups ?? []).length === 0 ? (
          <span className="text-white/20 text-[11px]">—</span>
        ) : (
          (row.groups ?? []).map((g) => (
            <span
              key={g}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                GROUP_STYLE[g] ??
                "bg-white/5 text-white/40 border border-white/10"
              }`}
            >
              {GROUP_LABELS[g] ?? g}
            </span>
          ))
        )}
      </div>
    ),
  },

  {
    id: "total_spent",
    label: "Total Spent",
    cellRender: (row) => (
      <span className="text-emerald-400 font-medium tabular-nums text-xs">
        {formatShortNumber(row.total_spent)}
      </span>
    ),
  },

  {
    id: "has_ordered",
    label: "Ordered",
    cellRender: (row) => (
      <span
        className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
          row.has_ordered
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            : "bg-white/5 text-white/25 border border-white/10"
        }`}
      >
        {row.has_ordered ? "Yes" : "No"}
      </span>
    ),
  },

  {
    id: "has_newsletter",
    label: "Newsletter",
    cellRender: (row) =>
      row.has_newsletter ? (
        <span className="flex items-center gap-1.5 text-violet-400 text-[11px]">
          <Mail size={13} /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-white/20 text-[11px]">
          <MailX size={13} /> No
        </span>
      ),
  },

  {
    id: "last_seen",
    label: "Last Seen",
    cellRender: (row) => (
      <span className="text-white/30 whitespace-nowrap text-[11px]">
        {formatDate(row.last_seen)}
      </span>
    ),
  },

  {
    id: "latest_purchase",
    label: "Last Purchase",
    cellRender: (row) => (
      <span className="text-white/30 whitespace-nowrap text-[11px]">
        {row.latest_purchase ? formatDate(row.latest_purchase) : "—"}
      </span>
    ),
  },

  {
    id: "first_seen",
    label: "Joined",
    cellRender: (row) => (
      <span className="text-white/25 whitespace-nowrap text-[11px]">
        {formatDate(row.first_seen)}
      </span>
    ),
  },
];

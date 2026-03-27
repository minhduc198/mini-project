import { OrderStatus } from "../types";

export const SORT_OPTIONS = [
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
];

export const STATUS_STYLE: Record<OrderStatus, string> = {
  ordered: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
  delivered: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  ordered: "Ordered",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

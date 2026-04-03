/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDate, formatShortNumber } from "@/src/lib/utils";
import { Checkbox } from "@/src/components/CheckBox";
import CustomTable from "@/src/components/CustomTable";
import { Pagination } from "@/src/components/Pagination";
import { SortBtn } from "@/src/components/SortBtn";
import { Input } from "@/src/components/ui/input";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { FilterPill } from "@/src/features/customer/components/FilterPill";
import { Product } from "@/src/features/product/types";
import { ColumnHeader, SORT } from "@/src/types";
import { Pencil, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GetOrdersListRequest, Order, OrderStatus } from "../types";
import { DatePicker } from "@/src/components/DatePickerField";
import { Button } from "@/src/components/ui/button";
import { SORT_OPTIONS, STATUS_LABELS, STATUS_STYLE } from "../constants";
import useDebounce from "@/src/hooks/use-debounce";

interface Props {
  orders: Order[];
  total: number;
  isLoading: boolean;
  request: GetOrdersListRequest;
  products: Product[];
  onRequestChange: (req: GetOrdersListRequest) => void;
  onDelete: (ids: number[]) => void;
  onEdit: (order: Order) => void;
}

export function OrderTable({
  orders,
  total,
  isLoading,
  request,
  products,
  onRequestChange,
  onDelete,
  onEdit,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filter = request.filter ?? {};
  const sortField = request.sort?.field ?? "id";
  const sortDir = request.sort?.order === SORT.ASC ? "asc" : ("desc" as const);
  const currentPage = request.pagination?.page ?? DEFAULT_PAGE;
  const perPage = request.pagination?.perPage ?? DEFAULT_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasActiveFilter = !!(
    filter.reference ||
    filter.status ||
    filter.date_from ||
    filter.date_to
  );

  const [firstRender, setIsFirstRender] = useState(true);
  const [inputValue, setInputValue] = useState(filter.reference ?? "");
  const debounceValue = useDebounce(inputValue, 300);

  const updateFilter = (patch: Partial<GetOrdersListRequest["filter"]>) => {
    onRequestChange({
      ...request,
      filter: { ...filter, ...patch },
      pagination: { ...request.pagination, page: DEFAULT_PAGE },
    });
  };

  useEffect(() => {
    if (firstRender) {
      setIsFirstRender(false);
      return;
    }

    onRequestChange({
      ...request,
      filter: { ...filter, reference: debounceValue },
    });
  }, [debounceValue]);

  const updatePage = (page: number) => {
    onRequestChange({
      ...request,
      pagination: { ...request.pagination, page },
    });
  };

  const handleSort = (key: string) => {
    const sameField = sortField === key;
    const newOrder =
      sameField && request.sort?.order === SORT.DESC ? SORT.ASC : SORT.DESC;
    onRequestChange({
      ...request,
      sort: { field: key, order: newOrder },
      pagination: { ...request.pagination, page: DEFAULT_PAGE },
    });
  };

  const resetFilters = () => {
    onRequestChange({
      ...request,
      filter: {},
      pagination: { ...request.pagination, page: DEFAULT_PAGE },
    });
  };

  const pageIds = orders.map((o) => o.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected =
    pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleDelete = () => {
    onDelete([...selectedIds]);
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  const columns: ColumnHeader<Order>[] = useMemo(
    () => [
      {
        id: "id" as keyof Order,
        label: "",
        cellRender: (row) => (
          <Checkbox
            checked={selectedIds.has(row.id)}
            onChange={() => toggleRow(row.id)}
          />
        ),
      },
      {
        id: "customer_id",
        label: "Customer",
        cellRender: (row) => {
          const c = row.customer;
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 relative rounded-full overflow-hidden ring-1 ring-white/10 bg-white/5 shrink-0">
                {c?.avatar ? (
                  <Image
                    width={28}
                    height={28}
                    src={c.avatar}
                    alt={c.first_name ?? ""}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-[10px] text-white/40 font-medium">
                    {c?.first_name?.[0]}
                    {c?.last_name?.[0]}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-white/75 text-xs font-medium whitespace-nowrap">
                  {c?.first_name} {c?.last_name}
                </div>
                <div className="text-white/25 text-[10px] truncate max-w-[160px]">
                  {c?.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "reference",
        label: "Reference",
        cellRender: (row) => (
          <span className="font-mono text-violet-300/80 text-xs">
            {row.reference}
          </span>
        ),
      },
      {
        id: "date",
        label: "Date",
        cellRender: (row) => (
          <span className="text-white/40 text-[11px] whitespace-nowrap">
            {formatDate(row.date)}
          </span>
        ),
      },

      {
        id: "address" as keyof Order,
        label: "Address",
        cellRender: (row) => (
          <div className="min-w-0">
            <div className="text-white/45 text-[11px] truncate max-w-[140px]">
              {row.address ?? row.customer?.address ?? "—"}
            </div>
            {row.customer?.city && (
              <div className="text-white/25 text-[10px]">
                {row.customer.city}
              </div>
            )}
          </div>
        ),
      },
      {
        id: "status",
        label: "Status",
        cellRender: (row) => (
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[row.status] ?? "bg-white/5 text-white/40 border border-white/10"}`}
          >
            {STATUS_LABELS[row.status] ?? row.status}
          </span>
        ),
      },

      {
        id: "total_ex_taxes",
        label: "Subtotal",
        cellRender: (row) => (
          <span className="text-white/35 text-xs tabular-nums">
            {formatShortNumber(row.total_ex_taxes)}
          </span>
        ),
      },
      {
        id: "total",
        label: "Total",
        cellRender: (row) => (
          <span className="text-emerald-400 font-medium tabular-nums text-xs">
            {formatShortNumber(row.total)}
          </span>
        ),
      },
      {
        id: "returned",
        label: "Returned",
        cellRender: (row) => (
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
              row.returned
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "bg-white/5 text-white/25 border border-white/10"
            }`}
          >
            {row.returned ? "Yes" : "No"}
          </span>
        ),
      },

      {
        id: "edit" as keyof Order,
        label: "",
        cellRender: (row) => (
          <Button
            onClick={() => onEdit(row)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
            title="Edit order"
          >
            <Pencil size={13} />
          </Button>
        ),
      },
    ],
    [selectedIds, onEdit, products],
  );

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0F0F1C] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/6">
        <div className="relative flex-1 max-w-full xl:max-w-xs ">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
          />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search reference…"
            className="w-full bg-white/4 border border-white/[0.07] rounded-lg pl-8 pr-8 py-2 text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-colors"
          />
          {filter.reference && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setInputValue("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 h-auto p-0.5 hover:bg-transparent"
            >
              <X size={12} />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mr-auto xl:ml-auto xl:mr-0">
          {hasActiveFilter && (
            <Button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] px-3 py-1.5  bg-transparent rounded-md text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
            >
              <X size={11} /> Reset
            </Button>
          )}
          <Button
            onClick={() => setShowSort(!showSort)}
            className={`flex items-center  bg-transparent gap-1.5 text-[11px] px-3 py-1.5 rounded-md border transition-colors ${
              showSort
                ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                : "border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/20"
            }`}
          >
            <SlidersHorizontal size={12} /> Sort
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-3 border-b border-white/6">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/20 uppercase tracking-widest mr-1 shrink-0">
            Status
          </span>
          <FilterPill
            label="All"
            active={!filter.status}
            onClick={() => updateFilter({ status: undefined })}
          />
          {(["ordered", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
            <FilterPill
              key={s}
              label={STATUS_LABELS[s]}
              active={filter.status === s}
              onClick={() =>
                updateFilter({ status: filter.status === s ? undefined : s })
              }
            />
          ))}
        </div>

        <div className="w-px h-4 bg-white/10 shrink-0 hidden sm:block" />

        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <span className="text-[10px] text-white/20 uppercase tracking-widest shrink-0">
              From
            </span>
            <DatePicker
              value={filter.date_from}
              onChange={(iso) => updateFilter({ date_from: iso })}
              placeholder="Start date"
              className="w-36"
            />
          </div>
          <div>
            <span className="text-[10px] text-white/20 uppercase tracking-widest shrink-0">
              To
            </span>
            <DatePicker
              value={filter.date_to}
              onChange={(iso) => updateFilter({ date_to: iso })}
              placeholder="End date"
              className="w-36"
            />
          </div>
        </div>
      </div>

      {showSort && (
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/6 flex-wrap">
          <p className="text-[11px] text-white/25 mr-1 shrink-0">Sort by:</p>
          {SORT_OPTIONS.map(({ key, label }) => (
            <SortBtn
              key={key}
              colKey={key}
              label={label}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort as any}
            />
          ))}
        </div>
      )}

      {selectedIds.size > 0 ? (
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/6 bg-violet-500/6">
          <Checkbox
            checked={allPageSelected}
            indeterminate={somePageSelected}
            onChange={togglePage}
          />
          <span className="text-[11px] text-violet-300 font-medium">
            {selectedIds.size} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={() => setSelectedIds(new Set())}
              className="text-[11px] bg-transparent text-white/30 hover:text-white/60 px-2.5 py-1.5 rounded-md hover:bg-white/6 transition-colors"
            >
              Clear
            </Button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-red-300/70">
                  Delete {selectedIds.size} order
                  {selectedIds.size > 1 ? "s" : ""}?
                </span>
                <Button
                  onClick={handleDelete}
                  className="text-[11px] px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-400 text-white font-medium transition-colors"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[11px] px-2.5 py-1.5 bg-transparent rounded-md border border-white/10 text-white/40 hover:text-white/70 transition-colors"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors h-auto"
              >
                <Trash2 size={12} /> Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/4">
          <Checkbox
            checked={allPageSelected}
            indeterminate={somePageSelected}
            onChange={togglePage}
          />
          <span className="text-[10px] text-white/20 uppercase tracking-widest">
            Select rows
          </span>
        </div>
      )}

      {hasActiveFilter && !isLoading && (
        <div className="px-5 py-2 border-b border-white/4 bg-violet-500/3">
          <p className="text-[11px] text-violet-300/60">
            {total} result{total !== 1 ? "s" : ""} match your filters
          </p>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        {isLoading ? (
          <div className="py-20 text-center text-white/20 text-xs">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-white/20 text-xs">
            No orders match your filters.
          </div>
        ) : (
          <CustomTable<Order> columnHeader={columns} columnData={orders} />
        )}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onPageChange={updatePage}
      />
    </div>
  );
}

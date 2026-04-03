/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { formatDate, formatShortNumber } from "@/src/lib/utils";
import { Checkbox } from "@/src/components/CheckBox";
import CustomTable from "@/src/components/CustomTable";
import { Pagination } from "@/src/components/Pagination";
import { SortBtn } from "@/src/components/SortBtn";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { FilterPill } from "@/src/features/customer/components/FilterPill";
import {
  Customer,
  GetCustomersListRequest,
  Group,
  SortKey,
} from "@/src/features/customer/types";
import { ColumnHeader, SORT } from "@/src/types";
import {
  Mail,
  MailX,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { GROUP_LABELS, GROUP_STYLE, LIST_SORT_BY } from "../constants";
import useDebounce from "@/src/hooks/use-debounce";

interface Props {
  customers: Customer[];
  total: number;
  isLoading: boolean;
  request: GetCustomersListRequest;
  onRequestChange: (req: GetCustomersListRequest) => void;
  onDelete: (ids: number[]) => void;
  onEdit: (product: Customer) => void;
}

export function CustomerTable({
  customers,
  total,
  isLoading,
  request,
  onRequestChange,
  onDelete,
  onEdit,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filter = request.filter ?? {};
  const sortField = (request.sort?.field ?? "total_spent") as SortKey<Customer>;
  const sortDir = request.sort?.order === SORT.ASC ? "asc" : ("desc" as const);
  const currentPage = request.pagination?.page ?? DEFAULT_PAGE;
  const perPage = request.pagination?.perPage ?? DEFAULT_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasActiveFilter = !!(
    filter.q ||
    filter.groups ||
    filter.has_newsletter
  );
  const [firstRender, setIsFirstRender] = useState(true);
  const [inputValue, setInputValue] = useState(filter.q ?? "");

  const debounceValue = useDebounce(inputValue, 300);

  const updateFilter = (
    patch: Partial<NonNullable<GetCustomersListRequest["filter"]>>,
  ) => {
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
      filter: { ...filter, q: debounceValue },
    });
  }, [debounceValue]);

  const updatePage = (page: number) => {
    onRequestChange({
      ...request,
      pagination: { ...request.pagination, page },
    });
  };

  const handleSort = (key: SortKey<Customer>) => {
    const sameField = request.sort?.field === key;
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

  const pageIds = customers.map((c) => c.id);
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

  const columns: ColumnHeader<Customer>[] = useMemo(
    () => [
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
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${GROUP_STYLE[g] ?? "bg-white/5 text-white/40 border border-white/10"}`}
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

      {
        id: "edit" as keyof Customer,
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
    [selectedIds, toggleRow, onEdit],
  );

  return (
    <div className="rounded-xl border border-white/[0.07] bg-overlay w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/6">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
          />

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search name, email"
            className="w-full bg-white/4 border border-white/[0.07] rounded-lg pl-8 pr-8 py-2 text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-colors"
          />
          {filter.q && (
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

        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilter && (
            <Button
              type="button"
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-md text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors h-auto"
            >
              <X size={11} /> Reset
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowSort(!showSort)}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border transition-colors h-auto ${
              showSort
                ? "border-violet-500/40 bg-violet-500/15 text-violet-300 hover:bg-violet-500/15 hover:text-violet-300"
                : "border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/20"
            }`}
          >
            <SlidersHorizontal size={12} /> Sort
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 border-b border-white/6">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/20 uppercase tracking-widest mr-1 shrink-0">
            Group
          </span>
          <FilterPill
            label="All"
            active={!filter.groups}
            onClick={() => updateFilter({ groups: undefined })}
          />
          {(
            [
              "regular",
              "ordered_once",
              "collector",
              "reviewer",
              "compulsive",
            ] as Group[]
          ).map((g) => (
            <FilterPill
              key={g}
              label={GROUP_LABELS[g]}
              active={filter.groups === g}
              onClick={() =>
                updateFilter({ groups: filter.groups === g ? undefined : g })
              }
            />
          ))}
        </div>

        <div className="w-px h-4 bg-white/10 shrink-0 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/20 uppercase tracking-widest mr-1 shrink-0">
            Newsletter
          </span>
          <FilterPill
            label="All"
            active={!filter.has_newsletter}
            onClick={() => updateFilter({ has_newsletter: undefined })}
          />
          <FilterPill
            label="Yes"
            active={filter.has_newsletter === "true"}
            onClick={() => updateFilter({ has_newsletter: "true" })}
          />
          <FilterPill
            label="No"
            active={filter.has_newsletter === "false"}
            onClick={() => updateFilter({ has_newsletter: "false" })}
          />
        </div>
      </div>

      {showSort && (
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/6 flex-wrap">
          <p className="text-[11px] text-white/25 mr-1 shrink-0">Sort by:</p>
          {LIST_SORT_BY.map(({ key, label }) => (
            <SortBtn
              key={key}
              colKey={key}
              label={label}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort}
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
              type="button"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="text-[11px] text-white/30 hover:text-white/60 px-2.5 py-1.5 rounded-md hover:bg-white/6 transition-colors h-auto"
            >
              Clear
            </Button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-red-300/70">
                  Delete {selectedIds.size} customer
                  {selectedIds.size > 1 ? "s" : ""}?
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-[11px] px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-400 text-white font-medium transition-colors h-auto"
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[11px] px-2.5 py-1.5 rounded-md border border-white/10 text-white/40 hover:text-white/70 transition-colors h-auto"
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

      {isLoading ? (
        <div className="py-20 text-center text-white/20 text-xs">
          Loading customers…
        </div>
      ) : customers.length === 0 ? (
        <div className="py-20 text-center text-white/20 text-xs">
          No customers match your filters.
        </div>
      ) : (
        <CustomTable<Customer> columnHeader={columns} columnData={customers} />
      )}

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

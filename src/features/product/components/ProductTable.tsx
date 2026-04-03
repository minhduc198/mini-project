/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatShortNumber } from "@/src/lib/utils";
import { Checkbox } from "@/src/components/CheckBox";
import CustomTable from "@/src/components/CustomTable";
import { Pagination } from "@/src/components/Pagination";
import { SortBtn } from "@/src/components/SortBtn";
import { Input } from "@/src/components/ui/input";
import { DEFAULT_PAGE } from "@/src/constants";
import { FilterPill } from "@/src/features/customer/components/FilterPill";
import { Inventory } from "@/src/features/inventory/types";
import { GetProductListRequest, Product } from "@/src/features/product/types";
import { ColumnHeader, SORT } from "@/src/types";
import { Pencil, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SortKey } from "../../customer/types";
import { Button } from "@/src/components/ui/button";
import { SORT_OPTIONS } from "../constants";
import Image from "next/image";
import useDebounce from "@/src/hooks/use-debounce";

interface Props {
  products: Product[];
  total: number;
  isLoading: boolean;
  inventories: Inventory[];
  request: GetProductListRequest;
  onRequestChange: (req: GetProductListRequest) => void;
  onDelete: (ids: number[]) => void;
  onEdit: (product: Product) => void;
}

export function ProductTable({
  products,
  total,
  isLoading,
  inventories,
  request,
  onRequestChange,
  onDelete,
  onEdit,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filter = request.filter ?? {};
  const sortField = request.sort?.field ?? "reference";
  const sortDir = request.sort?.order === SORT.ASC ? "asc" : ("desc" as const);
  const currentPage = request.pagination?.page ?? DEFAULT_PAGE;
  const perPage = request.pagination?.perPage ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasActiveFilter = !!(filter.q || filter.inventory_id);
  const [firstRender, setIsFirstRender] = useState(true);
  const [inputValue, setInputValue] = useState(filter.q ?? "");

  const debounceValue = useDebounce(inputValue, 300);

  const updateFilter = (patch: Partial<GetProductListRequest["filter"]>) => {
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

  const handleSort = (key: SortKey<Product>) => {
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

  const pageIds = products.map((p) => p.id);
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

  const columns: ColumnHeader<Product>[] = useMemo(
    () => [
      {
        id: "id" as keyof Product,
        label: "",
        cellRender: (row) => (
          <Checkbox
            checked={selectedIds.has(row.id)}
            onChange={() => toggleRow(row.id)}
          />
        ),
      },
      {
        id: "thumbnail",
        label: "",
        cellRender: (row) => (
          <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/10 bg-white/5 shrink-0 flex items-center justify-center">
            {row.thumbnail ? (
              <Image
                sizes="36px"
                width={36}
                height={36}
                src={row.thumbnail}
                alt={row.reference}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] text-white/20">N/A</span>
            )}
          </div>
        ),
      },
      {
        id: "reference",
        label: "Reference",
        cellRender: (row) => (
          <div>
            <div className="font-medium text-white/80 leading-none mb-1 whitespace-nowrap text-xs">
              {row.reference}
            </div>
            {row.description && (
              <div className="text-[11px] text-white/25 truncate max-w-[200px]">
                {row.description}
              </div>
            )}
          </div>
        ),
      },
      {
        id: "inventory_id",
        label: "Category",
        cellRender: (row) => {
          const inv = inventories.find((i) => i.id === row.inventory_id);
          return (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/20 whitespace-nowrap">
              {inv?.name ?? `#${row.inventory_id}`}
            </span>
          );
        },
      },
      {
        id: "price",
        label: "Price",
        cellRender: (row) => (
          <span className="text-emerald-400 font-medium tabular-nums text-xs">
            {formatShortNumber(row.price)}
          </span>
        ),
      },
      {
        id: "sales",
        label: "Sales",
        cellRender: (row) => (
          <span className="font-mono text-white/50 text-xs tabular-nums">
            {row.sales ?? 0}
          </span>
        ),
      },
      {
        id: "width",
        label: "W × H",
        cellRender: (row) => (
          <span className="text-white/30 text-[11px] whitespace-nowrap">
            {row.width ?? "—"} × {row.height ?? "—"}
          </span>
        ),
      },

      {
        id: "edit" as keyof Product,
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
    [selectedIds, inventories, onEdit],
  );

  return (
    <div className="rounded-xl border border-white/[0.07] bg-overlay">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/6">
        <div className="relative flex-1 max-w-xs">
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
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border transition-colors h-auto ${showSort ? "border-violet-500/40 bg-violet-500/15 text-violet-300 hover:bg-violet-500/15 hover:text-violet-300" : "border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/20"}`}
          >
            <SlidersHorizontal size={12} /> Sort
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 border-b border-white/6">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/20 uppercase tracking-widest mr-1 shrink-0">
            Category
          </span>
          <FilterPill
            label="All"
            active={!filter.inventory_id}
            onClick={() => updateFilter({ inventory_id: undefined })}
          />
          {inventories.map((inv) => (
            <FilterPill
              key={inv.id}
              label={inv.name ?? `#${inv.id}`}
              active={filter.inventory_id === String(inv.id)}
              onClick={() =>
                updateFilter({
                  inventory_id:
                    filter.inventory_id === String(inv.id)
                      ? undefined
                      : String(inv.id),
                })
              }
            />
          ))}
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
                  Delete {selectedIds.size} product
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

      <div className="w-full overflow-x-auto scrollbar-hide">
        {isLoading ? (
          <div className="py-20 text-center text-white/20 text-xs">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-white/20 text-xs">
            No products match your filters.
          </div>
        ) : (
          <CustomTable<Product> columnHeader={columns} columnData={products} />
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

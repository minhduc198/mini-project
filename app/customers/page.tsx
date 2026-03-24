"use client";

import { toast } from "@/lib/toast";
import { formatDate, formatShortNumber } from "@/lib/utils";
import { AddCustomerModal } from "@/src/components/AddCustomerModal";
import { Checkbox } from "@/src/components/CheckBox";
import { queryClient } from "@/src/components/ClientLayout";
import CustomTable from "@/src/components/CustomTable";
import { Pagination } from "@/src/components/Pagination";
import { SortBtn } from "@/src/components/SortBtn";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { FilterPill } from "@/src/features/customer/components/FilterPill";
import { StatCard } from "@/src/features/customer/components/StatCard";
import {
  createCustomer,
  deleteCustomers,
  fetchCustomersList,
} from "@/src/features/customer/services";
import {
  CreateCustomerRequest,
  Customer,
  GetCustomersListRequest,
  Group,
  SortKey,
} from "@/src/features/customer/types";
import { useSidebarControl } from "@/src/hooks/use-sidebar-control";
import { ColumnHeader, SORT } from "@/src/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Mail,
  MailX,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const GROUP_STYLE: Record<Group, string> = {
  regular: "bg-white/5 text-white/40 border border-white/10",
  ordered_once: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
  collector: "bg-violet-500/15 text-violet-300 border border-violet-500/20",
  reviewer: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const GROUP_LABELS: Record<Group, string> = {
  regular: "Regular",
  ordered_once: "Ordered Once",
  collector: "Collector",
  reviewer: "Reviewer",
};

const LIST_SORT_BY = [
  { key: "total_spent", label: "Revenue" },
  { key: "nb_orders", label: "Orders" },
  { key: "last_seen", label: "Last Seen" },
  { key: "first_seen", label: "Join Date" },
  { key: "latest_purchase", label: "Last Purchase" },
  { key: "last_name", label: "Name" },
] as { key: SortKey<Customer>; label: string }[];

export default function Customers() {
  const { isPinned, isHovering } = useSidebarControl();
  const isExpanded = isPinned || isHovering;
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerListRq, setCustomerListRq] = useState<GetCustomersListRequest>(
    {
      filter: {},
      sort: { field: "total_spent", order: SORT.DESC },
      pagination: { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE },
    },
  );

  const [showSort, setShowSort] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ["customer_stats"],
    queryFn: () =>
      fetchCustomersList({ pagination: { page: 1, perPage: 999 } }),
    refetchOnWindowFocus: false,
  });

  const { data: customerListData, isLoading } = useQuery({
    queryKey: ["customer_list", customerListRq],
    queryFn: () => fetchCustomersList(customerListRq),
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteCustomersMutation } = useMutation({
    mutationFn: (ids: number[]) =>
      deleteCustomers({
        ids,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer_list"] });
      queryClient.invalidateQueries({ queryKey: ["customer_stats"] });
    },
  });

  const { mutate: createCustomerMutation } = useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customer_stats"] });
    },

    onError: (err) => {
      console.log(err);
      toast.error(err.message || "Failed to create customer");
    },
  });

  const handleCreateCustomer = (data: CreateCustomerRequest) => {
    createCustomerMutation(data);
  };

  const updateFilter = (
    patch: Partial<NonNullable<GetCustomersListRequest["filter"]>>,
  ) => {
    setCustomerListRq((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...patch },
      pagination: { ...prev.pagination, page: DEFAULT_PAGE },
    }));
  };

  const updatePage = (page: number) => {
    setCustomerListRq((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  };

  const handleSort = (key: SortKey<Customer>) => {
    setCustomerListRq((prev) => {
      const sameField = prev.sort?.field === key;
      const newOrder =
        sameField && prev.sort?.order === SORT.DESC ? SORT.ASC : SORT.DESC;
      return {
        ...prev,
        sort: { field: key, order: newOrder },
        pagination: { ...prev.pagination, page: DEFAULT_PAGE },
      };
    });
  };

  const resetFilters = () => {
    setCustomerListRq((prev) => ({
      ...prev,
      filter: {},
      pagination: { ...prev.pagination, page: DEFAULT_PAGE },
    }));
  };

  const allCustomers = statsData?.data as Customer[] | undefined;
  const totalCustomers = allCustomers?.length ?? 0;
  const totalRevenue =
    allCustomers?.reduce((s, c) => s + (c.total_spent ?? 0), 0) ?? 0;
  const totalOrders =
    allCustomers?.reduce((s, c) => s + (c.nb_orders ?? 0), 0) ?? 0;
  const avgSpend = totalCustomers
    ? Math.floor(totalRevenue / totalCustomers)
    : 0;
  const orderedCount = allCustomers?.filter((c) => c.has_ordered).length ?? 0;
  const newsletterCount =
    allCustomers?.filter((c) => c.has_newsletter).length ?? 0;

  const pageData = (customerListData?.data as Customer[]) ?? [];
  const totalFiltered: number = customerListData?.total ?? 0;
  const currentPage = customerListRq.pagination?.page ?? DEFAULT_PAGE;
  const perPage = customerListRq.pagination?.perPage ?? DEFAULT_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));

  const filter = customerListRq.filter ?? {};
  const sortField = (customerListRq.sort?.field ??
    "total_spent") as SortKey<Customer>;
  const sortDir =
    customerListRq.sort?.order === SORT.ASC ? "asc" : ("desc" as const);

  const hasActiveFilter = !!(
    filter.q ||
    filter.groups ||
    filter.has_newsletter
  );

  const pageIds = pageData.map((c) => c.id);
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

  const clearSelection = () => setSelectedIds(new Set());

  const handleDelete = () => {
    const newSelectedIds: number[] = [...selectedIds];
    deleteCustomersMutation(newSelectedIds);
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  const columnHeader: ColumnHeader<Customer>[] = useMemo(
    () => [
      {
        id: "id" as keyof Customer,
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
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 bg-white/5 shrink-0 flex items-center justify-center text-[11px] font-medium text-white/40">
            <img
              src={row.avatar}
              alt={row.first_name}
              className="w-full h-full object-cover"
            />
            {!row.avatar &&
              `${row.first_name?.[0] ?? ""}${row.last_name?.[0] ?? ""}`}
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
            <div className="text-white/60 whitespace-nowrap">{row.city}</div>
            <div className="text-[11px] text-white/25 truncate max-w-45">
              {row.address}
            </div>
          </div>
        ),
      },
      {
        id: "groups",
        label: "Group",
        cellRender: (row) => (
          <div className="flex flex-wrap gap-1">
            {(row.groups ?? []).map((g) => (
              <span
                key={g}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                  GROUP_STYLE[g] ??
                  "bg-white/5 text-white/40 border border-white/10"
                }`}
              >
                {GROUP_LABELS[g] ?? g}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "nb_orders",
        label: "Orders",
        cellRender: (row) => (
          <span className="font-mono text-white/60">{row.nb_orders}</span>
        ),
      },
      {
        id: "total_spent",
        label: "Total Spent",
        cellRender: (row) => (
          <span className="text-emerald-400 font-medium tabular-nums">
            {formatShortNumber(row.total_spent)}
          </span>
        ),
      },
      {
        id: "has_newsletter",
        label: "Newsletter",
        cellRender: (row) =>
          row.has_newsletter ? (
            <span className="flex items-center gap-1.5 text-violet-400 text-[11px]">
              <Mail size={13} />
              Yes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-white/20 text-[11px]">
              <MailX size={13} />
              No
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
            {formatDate(row.latest_purchase ?? "")}
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
    ],
    [selectedIds],
  );

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="p-6 space-y-5 mx-auto w-full min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Customers</h1>
            <p className="text-xs text-white/30 mt-0.5">
              {isLoading ? "Loading…" : `${totalCustomers} total customers`}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors text-xs font-medium shadow-lg shadow-violet-500/20"
          >
            <Plus size={13} />
            Add Customer
          </button>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Customers"
            value={formatShortNumber(totalCustomers)}
            sub={`${orderedCount} have ordered`}
            color="bg-violet-500/15 text-violet-400"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={formatShortNumber(totalOrders)}
            sub={`Across ${totalCustomers} customers`}
            color="bg-sky-500/15 text-sky-400"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={formatShortNumber(totalRevenue)}
            sub={`${newsletterCount} newsletter subscribers`}
            color="bg-emerald-500/15 text-emerald-400"
          />
          <StatCard
            icon={ShoppingBag}
            label="Avg. Spend"
            value={formatShortNumber(avgSpend)}
            sub="Per customer"
            color="bg-amber-500/15 text-amber-400"
          />
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-[#0F0F1C]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/6">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
              />
              <input
                value={filter.q ?? ""}
                onChange={(e) =>
                  updateFilter({ q: e.target.value || undefined })
                }
                placeholder="Search name, email, city…"
                className="w-full bg-white/4 border border-white/[0.07] rounded-lg pl-8 pr-8 py-2 text-xs placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-colors"
              />
              {filter.q && (
                <button
                  onClick={() => updateFilter({ q: undefined })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-md text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
                >
                  <X size={11} />
                  Reset
                </button>
              )}
              <button
                onClick={() => setShowSort(!showSort)}
                className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md border transition-colors ${
                  showSort
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                    : "border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/20"
                }`}
              >
                <SlidersHorizontal size={12} />
                Sort
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 border-b border-white/6 bg-white/1]">
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
                ["regular", "ordered_once", "collector", "reviewer"] as Group[]
              ).map((g) => (
                <FilterPill
                  key={g}
                  label={GROUP_LABELS[g]}
                  active={filter.groups === g}
                  onClick={() =>
                    updateFilter({
                      groups: filter.groups === g ? undefined : g,
                    })
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
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/6 bg-white/1.5 flex-wrap">
              <p className="text-[11px] text-white/25 mr-1 shrink-0">
                Sort by:
              </p>
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
                <button
                  onClick={clearSelection}
                  className="text-[11px] text-white/30 hover:text-white/60 px-2.5 py-1.5 rounded-md hover:bg-white/6 transition-colors"
                >
                  Clear
                </button>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-300/70">
                      Delete {selectedIds.size} customer
                      {selectedIds.size > 1 ? "s" : ""}?
                    </span>
                    <button
                      onClick={handleDelete}
                      className="text-[11px] px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-400 text-white font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-[11px] px-2.5 py-1.5 rounded-md border border-white/10 text-white/40 hover:text-white/70 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
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
                {totalFiltered} result{totalFiltered !== 1 ? "s" : ""} match
                your filters
              </p>
            </div>
          )}

          <div
            className={`${isExpanded ? "max-w-[1140px]" : "max-w-[1440px]"}`}
          >
            {isLoading ? (
              <div className="py-20 text-center text-white/20 text-xs">
                Loading customers…
              </div>
            ) : pageData.length === 0 ? (
              <div className="py-20 text-center text-white/20 text-xs">
                No customers match your filters.
              </div>
            ) : (
              <CustomTable<Customer>
                columnHeader={columnHeader}
                columnData={pageData}
              />
            )}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={totalFiltered}
            perPage={perPage}
            onPageChange={updatePage}
          />
        </div>
      </div>

      <AddCustomerModal
        handleCreateCustomer={handleCreateCustomer}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

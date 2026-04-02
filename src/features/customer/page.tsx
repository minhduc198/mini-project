"use client";

import { formatShortNumber } from "@/src/lib/utils";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { CustomerTable } from "@/src/features/customer/components/CustomerTable";
import { StatCard } from "@/src/features/customer/components/StatCard";
import {
  CreateCustomerRequest,
  Customer,
  GetCustomersListRequest,
} from "@/src/features/customer/types";
import { SORT } from "@/src/types";
import {
  Plus,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { useCustomers } from "./hook/useCustomers";
import { CustomerModal } from "./components/CustomerModal";

export default function Customers() {
  const [customerModal, setCustomerModal] = useState<
    | { open: false }
    | { open: true; mode: "add" }
    | { open: true; mode: "edit"; customer: Customer }
  >({ open: false });

  const [customerListRq, setCustomerListRq] = useState<GetCustomersListRequest>(
    {
      filter: {},
      sort: { field: "total_spent", order: SORT.DESC },
      pagination: { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE },
    },
  );

  const {
    listQueryCustomer,
    statsQueryCustomer,
    deleteCustomers,
    createCustomer,
    updateCustomer,
    isCreating,
  } = useCustomers(customerListRq);

  const { data: customerListData, isLoading } = listQueryCustomer;
  const { data: statsData } = statsQueryCustomer;

  const allCustomers = (statsData?.data as Customer[]) ?? [];
  const totalCustomers = allCustomers.length;

  const totalRevenue = allCustomers.reduce(
    (s, c) => s + (c.total_spent ?? 0),
    0,
  );

  const totalOrders = allCustomers.reduce((s, c) => s + (c.nb_orders ?? 0), 0);

  const avgSpend = totalCustomers
    ? Math.floor(totalRevenue / totalCustomers)
    : 0;

  const orderedCount = allCustomers.filter((c) => c.has_ordered).length;
  const newsletterCount = allCustomers.filter((c) => c.has_newsletter).length;

  const pageData = (customerListData?.data as Customer[]) ?? [];
  const totalFiltered = customerListData?.total ?? 0;

  const closeModal = () => setCustomerModal({ open: false });

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

          <Button
            type="button"
            variant="ghost"
            onClick={() => setCustomerModal({ open: true, mode: "add" })}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors text-xs font-medium shadow-lg shadow-violet-500/20 text-white h-auto"
          >
            <Plus size={13} />
            Add Customer
          </Button>
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

        <CustomerTable
          customers={pageData}
          total={totalFiltered}
          isLoading={isLoading}
          request={customerListRq}
          onRequestChange={setCustomerListRq}
          onDelete={deleteCustomers}
          onEdit={(customer) =>
            setCustomerModal({
              open: true,
              mode: "edit",
              customer,
            })
          }
        />
      </div>

      {customerModal.open && customerModal.mode === "add" && (
        <CustomerModal
          mode="add"
          open
          onClose={closeModal}
          onSubmit={(data: CreateCustomerRequest) => createCustomer(data)}
          isSubmitting={isCreating}
        />
      )}

      {customerModal.open && customerModal.mode === "edit" && (
        <CustomerModal
          mode="edit"
          open
          onClose={closeModal}
          onSubmit={updateCustomer}
          defaultValues={customerModal.customer}
          customerId={customerModal.customer.id}
        />
      )}
    </div>
  );
}

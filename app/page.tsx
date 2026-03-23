/* eslint-disable @next/next/no-img-element */
"use client";

import { Progress } from "@/components/ui/progress";
import { formatShortNumber } from "@/lib/utils";
import ColumnChart from "@/src/components/charts/ColumnChart";
import CustomTable from "@/src/components/CustomTable";
import KpiCard from "@/src/components/KpiCard";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { fetchCustomersList } from "@/src/features/Customers/services";
import { fetchOrdersList } from "@/src/features/Orders/services";
import { GetOrdersListResponse, Order } from "@/src/features/Orders/types";
import { ColumnHeader } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const columnHeader: ColumnHeader<Order>[] = [
  {
    id: "customer_id",
    label: "Avatar",
    cellRender: (row) => (
      <img
        src={row.customer?.avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
    ),
  },
  {
    id: "customer",
    label: "Full Name",
    cellRender: (row) => (
      <div>{`${row.customer?.first_name} ${row.customer?.last_name}`}</div>
    ),
  },

  {
    id: "reference",
    label: "Order Code",
  },
  {
    id: "address",
    label: "Address",
  },
  {
    id: "status",
    label: "Status",
    cellRender: (row) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium  ${
          row.status === "delivered"
            ? "bg-green-100 text-green-600"
            : row.status === "cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {row.status === "ordered" ? "pending" : row.status}
      </span>
    ),
  },
  {
    id: "total",
    label: "Total",
    cellRender: (row) => (
      <span className="font-medium">{formatShortNumber(row.total)}</span>
    ),
  },
];

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState("3M");
  // const [customerListRq, setCustomerListRq] = useState<GetCustomersListRequest>(
  //   {
  //     pagination: {
  //       page: DEFAULT_PAGE,
  //       perPage: DEFAULT_PER_PAGE,
  //     },
  //   },
  // );

  const { data: customerListData } = useQuery({
    queryKey: ["customer_list"],
    queryFn: () =>
      fetchCustomersList({
        pagination: {
          page: DEFAULT_PAGE,
          perPage: 999,
        },
      }),
    refetchOnWindowFocus: false,
  });
  const customerList = customerListData?.data ?? [];

  const { data: orderListData } = useQuery<GetOrdersListResponse>({
    queryKey: ["order_list"],
    queryFn: () =>
      fetchOrdersList({
        pagination: {
          page: DEFAULT_PAGE,
          perPage: 9999,
        },
      }),
    refetchOnWindowFocus: false,
  });
  const orderList = orderListData?.data ?? [];

  const topReps = useMemo(() => {
    const topSpent = customerList
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 6);

    const totalTopReps = topSpent.reduce(
      (init, current) => init + current.total_spent,
      0,
    );

    return topSpent.map((item) => {
      return {
        name: `${item.first_name} ${item.last_name}`,
        revenue: formatShortNumber(item.total_spent),
        pct: (item.total_spent / totalTopReps) * 100,
        avatar: item.avatar,
      };
    });
  }, [customerList]);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        <KpiCard customerList={customerList} orderList={orderList} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-xl border border-white/[0.07] bg-[#0F0F1C] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Revenue</h3>
                <p className="text-xs text-white/30 mt-0.5">{`Last ${Number.parseInt(activeRange)} ${activeRange === "1Y" ? "year" : "month"}`}</p>
              </div>
              <div className="flex items-center gap-1">
                {["1M", "3M", "6M", "1Y"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveRange(t)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      activeRange === t
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ColumnChart orderList={orderList} range={activeRange} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/[0.07] bg-[#0F0F1C] p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Top Reps</h3>
                <ArrowUpRight size={14} className="text-white/20" />
              </div>
              <div className="space-y-4">
                {topReps.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-3">
                    <div className="text-[10px] text-white/20 w-3 shrink-0 font-mono">
                      {i + 1}
                    </div>
                    <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden">
                      <img src={r.avatar} alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-white/70 truncate">
                          {r.name}
                        </span>
                        <span className="text-[10px] text-emerald-400 shrink-0 ml-2 font-medium">
                          {r.revenue}
                        </span>
                      </div>
                      <Progress value={r.pct} className="h-1 bg-white/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid col-span-12">
          <div className="xl:col-span-2 rounded-xl border border-white/[0.07] bg-[#0F0F1C] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <h3 className="text-sm font-semibold">Active Orders</h3>
              <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <CustomTable
              columnHeader={columnHeader}
              columnData={orderList.slice(0, 11)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatShortNumber } from "@/lib/utils";
import KpiCard from "@/src/components/KpiCard";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { fetchCustomersList } from "@/src/features/Customers/services";
import { fetchOrdersList } from "@/src/features/Orders/services";
import { GetOrdersListResponse } from "@/src/features/Orders/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const deals = [
  {
    name: "Acme Corp Expansion",
    contact: "Sarah Johnson",
    stage: "Negotiation",
    value: "$48,000",
    priority: "high",
    date: "Mar 24",
    avatar: "SJ",
  },
  {
    name: "TechFlow Platform",
    contact: "Marcus Lee",
    stage: "Proposal",
    value: "$32,500",
    priority: "medium",
    date: "Mar 28",
    avatar: "ML",
  },
  {
    name: "Vertex Analytics",
    contact: "Priya Kapoor",
    stage: "Qualification",
    value: "$75,000",
    priority: "high",
    date: "Apr 2",
    avatar: "PK",
  },
  {
    name: "Neon Studios SaaS",
    contact: "Dylan Frost",
    stage: "Closed Won",
    value: "$19,200",
    priority: "low",
    date: "Apr 5",
    avatar: "DF",
  },
  {
    name: "CloudBase Migration",
    contact: "Ava Chen",
    stage: "Prospecting",
    value: "$61,000",
    priority: "medium",
    date: "Apr 10",
    avatar: "AC",
  },
];

const stageStyle: Record<string, string> = {
  Prospecting: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  Qualification: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
  Proposal: "bg-blue-500/10  text-blue-300   border-blue-500/25",
  Negotiation: "bg-cyan-500/10  text-cyan-300   border-cyan-500/25",
  "Closed Won": "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
};

const priorityDot: Record<string, string> = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

// ─── Revenue Chart ────────────────────────────────────────────────────────────

function RevenueChart() {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const revenue = [68, 85, 72, 91, 78, 100];
  const target = [75, 80, 75, 85, 82, 90];

  return (
    <svg
      viewBox="0 0 400 140"
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => (
        <line
          key={v}
          x1="30"
          y1={10 + (100 - v)}
          x2="395"
          y2={10 + (100 - v)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}
      {months.map((m, i) => {
        const x = 45 + i * 60;
        const bH = (revenue[i] / 100) * 100;
        const tH = (target[i] / 100) * 100;
        return (
          <g key={m}>
            <rect
              x={x - 10}
              y={10 + (100 - tH)}
              width={20}
              height={tH}
              fill="rgba(6,182,212,0.12)"
              rx="3"
            />
            <rect
              x={x - 8}
              y={10 + (100 - bH)}
              width={16}
              height={bH}
              fill="url(#revGrad)"
              rx="3"
            />
            <text
              x={x}
              y={125}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="10"
              fontFamily="monospace"
            >
              {m}
            </text>
          </g>
        );
      })}
      {/* Legend */}
      <rect x="30" y="135" width="8" height="4" fill="#8B5CF6" rx="1" />
      <text x="42" y="139" fill="rgba(255,255,255,0.35)" fontSize="8">
        Revenue
      </text>
      <rect x="90" y="135" width="8" height="4" fill="#06B6D4" rx="1" />
      <text x="102" y="139" fill="rgba(255,255,255,0.35)" fontSize="8">
        Target
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState("6M");
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
          perPage: DEFAULT_PER_PAGE,
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
                <h3 className="text-sm font-semibold">Revenue vs Target</h3>
                <p className="text-xs text-white/30 mt-0.5">Last 6 months</p>
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
            <RevenueChart />
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
                      <Progress value={r.pct} className="h-1 bg-white/[0.06]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid col-span-12">
          <div className="xl:col-span-2 rounded-xl border border-white/[0.07] bg-[#0F0F1C] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold">Active Deals</h3>
              <button className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-white/20 uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Deal</th>
                  <th className="text-left px-3 py-3 font-medium">Stage</th>
                  <th className="text-right px-3 py-3 font-medium">Value</th>
                  <th className="text-right px-5 py-3 font-medium">Close</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d, i) => (
                  <tr
                    key={i}
                    className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[d.priority]}`}
                        />
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarFallback className="bg-white/10 text-white/50 text-[9px]">
                            {d.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-medium text-white/75 group-hover:text-white transition-colors">
                            {d.name}
                          </div>
                          <div className="text-[10px] text-white/25">
                            {d.contact}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${stageStyle[d.stage]}`}
                      >
                        {d.stage}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs font-semibold text-white/65">
                      {d.value}
                    </td>
                    <td className="px-5 py-3 text-right text-[11px] text-white/25">
                      {d.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

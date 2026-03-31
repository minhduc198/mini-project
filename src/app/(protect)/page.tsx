/* eslint-disable @next/next/no-img-element */
'use client';

import { formatShortNumber } from '@/src/lib/utils';
import ColumnChart from '@/src/components/charts/ColumnChart';
import CustomTable from '@/src/components/CustomTable';
import KpiCard from '@/src/components/KpiCard';
import { Progress } from '@/src/components/ui/progress';
import { DEFAULT_PAGE } from '@/src/constants';
import { fetchCustomersList } from '@/src/features/customer/api/services';
import { GetOrdersListResponse, Order } from '@/src/features/order/types';
import { ColumnHeader } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { fetchOrdersList } from '../../features/order/api/services';
import { STATUS_LABELS, STATUS_STYLE } from '../../features/order/constants';
import { customerKeys } from '../../features/customer/query-key/customer.query-key';
import { orderKeys } from '../../features/order/query-key/order.query-key';

const columnHeader: ColumnHeader<Order>[] = [
  {
    id: 'customer_id',
    label: 'Avatar',
    cellRender: row => <Image width={32} height={32} sizes="32px" src={row.customer?.avatar ?? ''} alt="avatar" className="rounded-full" />,
  },
  {
    id: 'customer',
    label: 'Full Name',
    cellRender: row => <div>{`${row.customer?.first_name} ${row.customer?.last_name}`}</div>,
  },

  {
    id: 'reference',
    label: 'Order Code',
  },
  {
    id: 'address',
    label: 'Address',
  },
  {
    id: 'status',
    label: 'Status',
    cellRender: row => (
      <span
        className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[row.status] ?? 'bg-white/5 text-white/40 border border-white/10'}`}>
        {STATUS_LABELS[row.status] ?? row.status}
      </span>
    ),
  },
  {
    id: 'total',
    label: 'Total',
    cellRender: row => <span className="font-medium">{formatShortNumber(row.total)}</span>,
  },
];

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState('3M');

  const { data: customerListData } = useQuery({
    queryKey: customerKeys.all,
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
    queryKey: orderKeys.all,
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
    const topSpent = customerList.sort((a, b) => b.total_spent - a.total_spent).slice(0, 6);

    const totalTopReps = topSpent.reduce((init, current) => init + current.total_spent, 0);

    return topSpent.map(item => {
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
          <div className="xl:col-span-2 rounded-xl border border-white/[0.07] bg-overlay p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Revenue</h3>
                <p className="text-xs text-white/30 mt-0.5">{`Last ${Number.parseInt(activeRange)} ${activeRange === '1Y' ? 'year' : 'month'}`}</p>
              </div>
              <div className="flex items-center gap-1">
                {['1M', '3M', '6M', '1Y'].map(t => (
                  <Button
                    key={t}
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveRange(t)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors h-auto ${
                      activeRange === t
                        ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/20 hover:text-violet-300'
                        : 'text-white/30 hover:text-white/60'
                    }`}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <ColumnChart orderList={orderList} range={activeRange} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/[0.07] bg-overlay p-5 flex-1">
              <h3 className="text-sm font-semibold">Top Reps</h3>
              <div className="space-y-4 mt-4">
                {topReps.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-3">
                    <div className="text-[10px] text-white/20 w-3 shrink-0 font-mono">{i + 1}</div>
                    <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden">
                      <Image sizes="28px" width={28} height={28} src={r.avatar ?? ''} alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-white/70 truncate">{r.name}</span>
                        <span className="text-[10px] text-emerald-400 shrink-0 ml-2 font-medium">{r.revenue}</span>
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
          <div className="xl:col-span-2 rounded-xl border border-white/[0.07] bg-overlay overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
              <h3 className="text-sm font-semibold">Active Orders</h3>
              <Link href="/orders">
                <Button className="text-xs text-violet-400 hover:text-violet-300 bg-transparent flex items-center gap-1 transition-colors">
                  View all <ChevronRight size={12} />
                </Button>
              </Link>
            </div>
            <CustomTable columnHeader={columnHeader} columnData={orderList.filter(i => i.customer_id).slice(0, 11)} />
          </div>
        </div>
      </div>
    </div>
  );
}

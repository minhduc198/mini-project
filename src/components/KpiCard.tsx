import { formatShortNumber } from '@/src/lib/utils';
import { Activity, DollarSign, Target, TrendingDown, TrendingUp, UserPlus } from 'lucide-react';
import { useMemo } from 'react';
import { Customer } from '../features/customer/types';
import { Order } from '../features/order/types';
import LineChart from './charts/LineChart';

interface Props {
  customerList: Customer[];
  orderList: Order[];
}

export default function KpiCard({ customerList, orderList }: Props) {
  const kpis = useMemo(() => {
    if (!orderList || !customerList) return [];

    const totalRevenue = orderList.filter(order => !order.returned).reduce((sum, o) => sum + (o.total || 0), 0);

    const returnedOrders = orderList.filter(o => o.returned).length;
    const deliveredOrders = orderList.filter(o => !o.returned).length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newContacts = customerList.filter(c => {
      return c.last_seen && new Date(c.last_seen) <= oneMonthAgo;
    }).length;

    return [
      {
        label: 'Total Revenue',
        value: formatShortNumber(totalRevenue),
        change: '+18.2%',
        up: true,
        icon: DollarSign,
        color: 'from-violet-500/20 to-violet-500/0',
        accent: '#8B5CF6',
        sub: 'of this month',
      },
      {
        label: 'New Contacts',
        value: newContacts,
        change: '+6.4%',
        up: true,
        icon: UserPlus,
        color: 'from-cyan-500/20 to-cyan-500/0',
        accent: '#06B6D4',
        sub: 'this month',
      },
      {
        label: 'Returned Orders',
        value: returnedOrders,
        change: '+22.1%',
        up: true,
        icon: Target,
        color: 'from-emerald-500/20 to-emerald-500/0',
        accent: '#10B981',
        sub: 'won this quarter',
      },
      {
        label: 'Delivered Orders',
        value: deliveredOrders,
        change: '-0.4%',
        up: false,
        icon: Activity,
        color: 'from-rose-500/20 to-rose-500/0',
        accent: '#F43F5E',
        sub: 'monthly average',
      },
    ];
  }, [orderList, customerList]);
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map(k => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="relative rounded-xl border border-white/[0.07] p-4 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${k.color}`} />

            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${k.accent}22` }}>
                  <Icon size={15} style={{ color: k.accent }} />
                </div>

                <LineChart color={k.accent} up={k.up} width={80} height={40} />
              </div>

              <div className="text-2xl font-bold tracking-tight">{k.value}</div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-white/35">{k.label}</span>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {k.change}
                </span>
              </div>

              <div className="text-[10px] text-white/20 mt-0.5">{k.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

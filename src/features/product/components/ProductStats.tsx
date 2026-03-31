'use client';

import { formatShortNumber } from '@/src/lib/utils';
import { StatCard } from '@/src/features/customer/components/StatCard';
import { Product } from '@/src/features/product/types';
import { Package, TrendingUp, AlertTriangle, ShoppingBag } from 'lucide-react';
import { Inventory } from '../../inventory/types';

interface Props {
  products: Product[];
  inventories: Inventory[];
}

export function ProductStats({ products, inventories }: Props) {
  const totalProducts = products.length;
  const totalSales = products.reduce((s, p) => s + (p.sales ?? 0), 0);
  const totalStock = inventories.reduce((s, p) => s + (p.stock ?? 0), 0);
  const lowStockCount = inventories.filter(p => (p.stock ?? 0) < 10).length;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Package}
        label="Total Products"
        value={formatShortNumber(totalProducts)}
        sub="In catalog"
        color="bg-violet-500/15 text-violet-400"
      />
      <StatCard
        icon={ShoppingBag}
        label="Total Stock"
        value={formatShortNumber(totalStock)}
        sub="Units available"
        color="bg-sky-500/15 text-sky-400"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Sales"
        value={formatShortNumber(totalSales)}
        sub="Units sold"
        color="bg-emerald-500/15 text-emerald-400"
      />
      <StatCard
        icon={AlertTriangle}
        label="Low Stock"
        value={formatShortNumber(lowStockCount)}
        sub="Products below 10 units"
        color="bg-amber-500/15 text-amber-400"
      />
    </div>
  );
}

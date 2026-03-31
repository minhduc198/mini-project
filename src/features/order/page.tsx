'use client';

import { formatShortNumber } from '@/src/lib/utils';
import { StatCard } from '@/src/features/customer/components/StatCard';
import { Customer } from '@/src/features/customer/types';
import { OrderModal } from '@/src/features/order/components/OrderModal';
import { OrderTable } from '@/src/features/order/components/OrderTable';
import { useOrders } from '@/src/features/order/hooks/useOrders';

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/src/constants';
import { Product } from '@/src/features/product/types';
import { SORT } from '@/src/types';
import { CheckCircle, Plus, ShoppingCart, XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useState } from 'react';
import { useCustomers } from '../customer/hook/useCustomers';
import { useProducts } from '../product/hook/useProducts';
import { CreateOrderRequest, GetOrdersListRequest, Order, UpdateOrderRequest } from './types';

export default function Orders() {
  const [modalState, setModalState] = useState<{ open: false } | { open: true; mode: 'add' } | { open: true; mode: 'edit'; order: Order }>({
    open: false,
  });

  const [orderListRq, setOrderListRq] = useState<GetOrdersListRequest>({
    filter: {},
    sort: { field: 'id', order: SORT.DESC },
    pagination: { page: DEFAULT_PAGE, perPage: DEFAULT_PER_PAGE },
  });

  const { statsQueryOrder, listQueryOrder, createOrder, updateOrder, deleteOrders, isCreating, isUpdating } = useOrders(orderListRq);

  const { statsQueryCustomer } = useCustomers({
    pagination: { page: 1, perPage: 9999 },
  });

  const { statsQueryProduct } = useProducts({
    pagination: { page: 1, perPage: 9999 },
  });

  const allOrders = (statsQueryOrder.data?.data as Order[]) ?? [];
  const pageOrders = (listQueryOrder.data?.data as Order[]) ?? [];
  const totalFiltered = listQueryOrder.data?.total ?? 0;
  const customers = (statsQueryCustomer.data?.data as Customer[]) ?? [];
  const products = (statsQueryProduct.data?.data as Product[]) ?? [];

  const deliveredCount = allOrders.filter(o => o.status === 'delivered').length;
  const cancelledCount = allOrders.filter(o => o.status === 'cancelled').length;
  const returnedCount = allOrders.filter(o => o.returned).length;

  const closeModal = () => setModalState({ open: false });

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="p-6 space-y-5 mx-auto w-full min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
            <p className="text-xs text-white/30 mt-0.5">{allOrders.length} total orders</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setModalState({ open: true, mode: 'add' })}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors text-xs font-medium shadow-lg shadow-violet-500/20 text-white h-auto">
            <Plus size={13} />
            Create Order
          </Button>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={formatShortNumber(allOrders.length)}
            sub={`${returnedCount} returned`}
            color="bg-violet-500/15 text-violet-400"
          />
          <StatCard
            icon={CheckCircle}
            label="Delivered"
            value={formatShortNumber(deliveredCount)}
            sub={`${Math.round((deliveredCount / (allOrders.length || 1)) * 100)}% of orders`}
            color="bg-sky-500/15 text-sky-400"
          />
          <StatCard
            icon={XCircle}
            label="Cancelled"
            value={formatShortNumber(cancelledCount)}
            sub={`${Math.round((cancelledCount / (allOrders.length || 1)) * 100)}% of orders`}
            color="bg-amber-500/15 text-amber-400"
          />
        </div>

        <OrderTable
          orders={pageOrders}
          total={totalFiltered}
          isLoading={listQueryOrder.isLoading}
          request={orderListRq}
          products={products}
          onRequestChange={setOrderListRq}
          onDelete={deleteOrders}
          onEdit={order => setModalState({ open: true, mode: 'edit', order })}
        />
      </div>

      {modalState.open && modalState.mode === 'add' && (
        <OrderModal
          mode="add"
          open
          onClose={closeModal}
          onSubmit={(data: CreateOrderRequest) => createOrder(data)}
          isSubmitting={isCreating}
          customers={customers}
          products={products}
        />
      )}

      {modalState.open && modalState.mode === 'edit' && (
        <OrderModal
          mode="edit"
          open
          onClose={closeModal}
          onSubmit={(data: UpdateOrderRequest) => updateOrder(data)}
          defaultValues={modalState.order}
          orderId={modalState.order.id}
          isSubmitting={isUpdating}
          customers={customers}
          products={products}
        />
      )}
    </div>
  );
}

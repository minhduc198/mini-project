'use client';

import { toast } from '@/src/lib/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder, deleteOrders, fetchOrdersList, updateOrderDirect } from '../api/services';
import { CreateOrderRequest, GetOrdersListRequest, UpdateOrderRequest } from '../types';
import { orderKeys } from '../query-key/order.query-key';
import { queryClient } from '@/src/components/ReactQueryProvider';

export function useOrders(request: GetOrdersListRequest) {
  const statsQueryOrder = useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => fetchOrdersList({ pagination: { page: 1, perPage: 9999 } }),
    refetchOnWindowFocus: false,
  });

  const listQueryOrder = useQuery({
    queryKey: orderKeys.list(request),
    queryFn: () => fetchOrdersList(request),
    refetchOnWindowFocus: false,
  });

  const { mutate: createOrderMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      toast.success('Order created successfully');
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create order');
    },
  });

  const { mutate: updateOrderMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateOrderRequest) => updateOrderDirect(data),
    onSuccess: () => {
      toast.success('Order updated successfully');
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update order');
    },
  });

  const { mutate: deleteOrdersMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteOrders(ids),
    onSuccess: () => {
      toast.success('Orders deleted');
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete orders');
    },
  });

  return {
    statsQueryOrder,
    listQueryOrder,
    createOrder: createOrderMutation,
    updateOrder: updateOrderMutation,
    deleteOrders: deleteOrdersMutation,
    isCreating,
    isUpdating,
  };
}

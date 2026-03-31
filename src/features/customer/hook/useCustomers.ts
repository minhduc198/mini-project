'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { createCustomer, deleteCustomers, fetchCustomersList, updateCustomer } from '../api/services';
import { toast } from '@/src/lib/toast';
import { CreateCustomerRequest, GetCustomersListRequest, UpdateCustomerRequest } from '../types';
import { customerKeys } from '../query-key/customer.query-key';
import { queryClient } from '@/src/components/ReactQueryProvider';

export function useCustomers(request: GetCustomersListRequest) {
  const statsQueryCustomer = useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => fetchCustomersList({ pagination: { page: 1, perPage: 9999 } }),
    refetchOnWindowFocus: false,
  });

  const listQueryCustomer = useQuery({
    queryKey: customerKeys.list(request),
    queryFn: () => fetchCustomersList(request),
    refetchOnWindowFocus: false,
  });

  const { mutate: createCustomerMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: () => {
      toast.success('Customer created successfully');
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create customer');
    },
  });

  const { mutate: deleteCustomersMutation, isPending: isDeleting } = useMutation({
    mutationFn: (ids: number[]) => deleteCustomers({ ids }),
    onSuccess: () => {
      toast.success('Customers deleted');
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete customers');
    },
  });

  const { mutate: updateCustomerMutation } = useMutation({
    mutationFn: (param: UpdateCustomerRequest) => updateCustomer(param),
    onSuccess: () => {
      toast.success('Customers updated');
      queryClient.invalidateQueries({ queryKey: customerKeys.list(request) });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update customers');
    },
  });

  return {
    statsQueryCustomer,
    listQueryCustomer,
    createCustomer: createCustomerMutation,
    deleteCustomers: deleteCustomersMutation,
    updateCustomer: updateCustomerMutation,
    isCreating,
    isDeleting,
  };
}

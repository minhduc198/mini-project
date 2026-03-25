"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomers,
  fetchCustomersList,
} from "../api/services";
import { queryClient } from "@/src/components/ClientLayout";
import { toast } from "@/lib/toast";
import { CreateCustomerRequest, GetCustomersListRequest } from "../types/types";

export function useCustomers(request: GetCustomersListRequest) {
  const statsQueryCustomer = useQuery({
    queryKey: ["customer_stats"],
    queryFn: () =>
      fetchCustomersList({ pagination: { page: 1, perPage: 9999 } }),
    refetchOnWindowFocus: false,
  });

  const listQueryCustomer = useQuery({
    queryKey: ["customer_list", request],
    queryFn: () => fetchCustomersList(request),
    refetchOnWindowFocus: false,
  });

  const { mutate: createCustomerMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
      onSuccess: () => {
        toast.success("Customer created successfully");
        queryClient.invalidateQueries({ queryKey: ["customer_list"] });
        queryClient.invalidateQueries({ queryKey: ["customer_stats"] });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create customer");
      },
    },
  );

  const { mutate: deleteCustomersMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (ids: number[]) => deleteCustomers({ ids }),
      onSuccess: () => {
        toast.success("Customers deleted");
        queryClient.invalidateQueries({ queryKey: ["customer_list"] });
        queryClient.invalidateQueries({ queryKey: ["customer_stats"] });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete customers");
      },
    });

  return {
    statsQueryCustomer,
    listQueryCustomer,
    createCustomer: createCustomerMutation,
    deleteCustomers: deleteCustomersMutation,
    isCreating,
    isDeleting,
  };
}

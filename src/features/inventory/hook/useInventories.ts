"use client";

import { queryClient } from "@/src/components/ReactQueryProvider";
import {
  createInventory,
  deleteInventory,
  fetchInventoriesList,
  updateInventory,
} from "@/src/features/inventory/api/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { inventoryKeys } from "../query-key/inventory.query-key";
import { CreateInventoryRequest, UpdateInventoryRequest } from "../types";
import { productKeys } from "../../product/query-key/product.query-key";

export function useInventories() {
  const inventoriesQuery = useQuery({
    queryKey: inventoryKeys.all,
    queryFn: fetchInventoriesList,
    refetchOnWindowFocus: false,
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: (ids: number[]) => deleteInventory(ids),
    onSuccess: () => {
      toast.success("Inventory deleted successfully");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
      toast.error("Inventory deleted unsuccessful");
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: (params: UpdateInventoryRequest) => updateInventory(params),
    onSuccess: () => {
      toast.success("Inventory updated successfully");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: () => {
      toast.error("Updated inventory unsuccessful");
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: (params: CreateInventoryRequest) => createInventory(params),
    onSuccess: () => {
      toast.success("Inventory created successfully");
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
    onError: () => {
      toast.error("Create inventory unsuccessful");
    },
  });

  return {
    inventoriesQuery,
    deleteInventory: deleteInventoryMutation,
    updateInventory: updateInventoryMutation,
    createInventory: createInventoryMutation,
  };
}

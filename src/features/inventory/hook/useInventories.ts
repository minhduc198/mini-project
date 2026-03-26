"use client";

import { queryClient } from "@/src/components/ClientLayout";
import {
  createInventory,
  deleteInventory,
  fetchInventoriesList,
  updateInventory,
} from "@/src/features/inventory/api/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateInventoryRequest, UpdateInventoryRequest } from "../types/types";

export function useInventories() {
  const getInventories = useQuery({
    queryKey: ["inventories"],
    queryFn: fetchInventoriesList,
    refetchOnWindowFocus: false,
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: (ids: number[]) => deleteInventory(ids),
    onSuccess: () => {
      toast.success("Inventory deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: () => {
      toast.error("Inventory deleted unsuccessful");
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: (params: UpdateInventoryRequest) => updateInventory(params),
    onSuccess: () => {
      toast.success("Inventory deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: () => {
      toast.error("Updated inventory unsuccessful");
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: (params: CreateInventoryRequest) => createInventory(params),
    onSuccess: () => {
      toast.success("Inventory created successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: () => {
      toast.error("Create inventory unsuccessful");
    },
  });

  return {
    inventoriesQuery: getInventories,
    deleteInventory: deleteInventoryMutation,
    updateInventory: updateInventoryMutation,
    createInventory: createInventoryMutation,
  };
}

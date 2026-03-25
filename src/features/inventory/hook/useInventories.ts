"use client";

import { fetchInventoriesList } from "@/src/features/inventory/api/services";
import { useQuery } from "@tanstack/react-query";

export function useInventories() {
  const query = useQuery({
    queryKey: ["inventories"],
    queryFn: fetchInventoriesList,
    refetchOnWindowFocus: false,
  });

  return { inventoriesQuery: query };
}

"use client";

import { toast } from "@/lib/toast";
import { queryClient } from "@/src/components/ClientLayout";
import {
  createProduct,
  deleteProducts,
  fetchProductsList,
} from "@/src/features/product/api/services";
import {
  CreateProductRequest,
  GetProductListRequest,
} from "@/src/features/product/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useProducts(request: GetProductListRequest) {
  const statsQueryProduct = useQuery({
    queryKey: ["product_stats"],
    queryFn: () =>
      fetchProductsList({ pagination: { page: 1, perPage: 9999 } }),
    refetchOnWindowFocus: false,
  });

  const listQueryProduct = useQuery({
    queryKey: ["product_list", request],
    queryFn: () => fetchProductsList(request),
    refetchOnWindowFocus: false,
  });

  const { mutate: createProductMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["product_list"] });
      queryClient.invalidateQueries({ queryKey: ["product_stats"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create product");
    },
  });

  const { mutate: deleteProductsMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteProducts({ ids }),
    onSuccess: () => {
      toast.success("Products deleted");
      queryClient.invalidateQueries({ queryKey: ["product_list"] });
      queryClient.invalidateQueries({ queryKey: ["product_stats"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete products");
    },
  });

  return {
    statsQueryProduct,
    listQueryProduct,
    createProduct: createProductMutation,
    isCreating,
    deleteProducts: deleteProductsMutation,
  };
}

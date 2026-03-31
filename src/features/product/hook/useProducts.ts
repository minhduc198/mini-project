'use client';

import { toast } from '@/src/lib/toast';
import { createProduct, deleteProducts, fetchProductsList, updateProduct } from '@/src/features/product/api/services';
import { CreateProductRequest, GetProductListRequest, UpdateProductRequest } from '@/src/features/product/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-key/product.query-key';
import { queryClient } from '@/src/components/ReactQueryProvider';

export function useProducts(request: GetProductListRequest) {
  const statsQueryProduct = useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => fetchProductsList({ pagination: { page: 1, perPage: 9999 } }),
    refetchOnWindowFocus: false,
  });

  const listQueryProduct = useQuery({
    queryKey: productKeys.list(request),
    queryFn: () => fetchProductsList(request),
    refetchOnWindowFocus: false,
  });

  const { mutate: createProductMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateProductRequest) => createProduct(data),
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create product');
    },
  });

  const { mutate: deleteProductsMutation } = useMutation({
    mutationFn: (ids: number[]) => deleteProducts({ ids }),
    onSuccess: () => {
      toast.success('Products deleted');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete products');
    },
  });

  const { mutate: updateProductMutation } = useMutation({
    mutationFn: (param: UpdateProductRequest) => updateProduct(param),
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to edit product');
    },
  });

  return {
    statsQueryProduct,
    listQueryProduct,
    createProduct: createProductMutation,
    isCreating,
    deleteProducts: deleteProductsMutation,
    updateProduct: updateProductMutation,
  };
}

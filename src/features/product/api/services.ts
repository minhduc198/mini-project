/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '@/src/lib/http';

import { SORT } from '@/src/types';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/src/constants';
import {
  CreateProductRequest,
  DeleteProductsRequest,
  GetProductDetailRequest,
  GetProductDetailResponse,
  GetProductListRequest,
  GetProductsListResponse,
  Product,
  UpdateProductRequest,
  UpdateProductResponse,
} from '../types';

export class ProductService {
  static async getProductList(params: GetProductListRequest): Promise<GetProductsListResponse> {
    const pagination = params.pagination;

    try {
      const response = await http.post('/products/list', {
        pagination,
        sort: params.sort ?? { field: 'reference', order: SORT.DESC },
        filter: params.filter ?? {},
      });

      return {
        ...(pagination ?? {
          page: DEFAULT_PAGE,
          perPage: DEFAULT_PER_PAGE,
        }),
        data: response.data.data as Product[],
        total: response.data.total || 0,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async getProductDetail(params: GetProductDetailRequest): Promise<GetProductDetailResponse> {
    try {
      const response = await http.get(`products/${params.id}`);

      return {
        data: response.data as Product,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async deleteProducts(params: DeleteProductsRequest): Promise<null> {
    try {
      await http.delete('products', {
        data: {
          ids: params.ids,
        },
      });

      return null;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async updateProduct(params: UpdateProductRequest): Promise<UpdateProductResponse> {
    try {
      const currentData = await http.get(`products/${params.id}`);

      const response = await http.put('products', {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Product,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async createProduct(params: CreateProductRequest): Promise<Product> {
    try {
      const response = await http.post('products', {
        data: params.data,
      });

      return response.data as Product;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }
}

export const fetchProductsList = (params: GetProductListRequest) => ProductService.getProductList(params);
export const fetchProductDetail = (params: GetProductDetailRequest) => ProductService.getProductDetail(params);
export const deleteProducts = (params: DeleteProductsRequest) => ProductService.deleteProducts(params);
export const updateProduct = (params: UpdateProductRequest) => ProductService.updateProduct(params);
export const createProduct = (params: CreateProductRequest) => ProductService.createProduct(params);

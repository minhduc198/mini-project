/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/src/constants';
import { SORT } from '@/src/types';

import http from '@/src/lib/http';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  GetOrdersListRequest,
  GetOrdersListResponse,
  Order,
  UpdateOrderRequest,
  UpdateOrderResponse,
} from '../types';

export class OrdersService {
  static async getOrdersList(params: GetOrdersListRequest): Promise<GetOrdersListResponse> {
    const pagination = params.pagination;
    try {
      const response = await http.post('/orders/list', {
        pagination,
        sort: params.sort ?? { field: 'id', order: SORT.DESC },
        filter: params.filter ?? {},
      });

      return {
        ...(pagination ?? {
          page: DEFAULT_PAGE,
          perPage: DEFAULT_PER_PAGE,
        }),
        data: response.data.data as Order[],
        total: response.data.total || 0,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getOrderDetail(params: GetOrderDetailRequest): Promise<GetOrderDetailResponse> {
    try {
      const response = await http.get(`orders/${params.id}`);

      return {
        data: response.data as Order,
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy chi tiết order ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateOrder(params: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    try {
      const currentData = await http.get(`orders/${params.id}`);

      const response = await http.put('orders', {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Order,
      };
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật order ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteMany(ids: number[]): Promise<{ data: number[] }> {
    try {
      const response = await http.delete('orders', { data: { ids } });

      return {
        data: response.data || [],
      };
    } catch (error) {
      throw new Error(`Lỗi khi xóa nhiều orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await http.post('/orders', payload);

      return {
        data: response.data.data as Order,
      };
    } catch (error) {
      throw new Error(`Lỗi khi tạo order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateOrderDirect(params: UpdateOrderRequest) {
    try {
      const response = await http.put('orders', {
        id: params.id,
        data: params.data,
      });
      return response.data;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Failed to update order';
      throw new Error(errMessage);
    }
  }
}

export const fetchOrdersList = (params: GetOrdersListRequest) => OrdersService.getOrdersList(params);

export const fetchOrderDetail = (params: GetOrderDetailRequest) => OrdersService.getOrderDetail(params);

export const updateOrder = (params: UpdateOrderRequest) => OrdersService.updateOrder(params);

export const deleteOrders = (ids: number[]) => OrdersService.deleteMany(ids);

export const createOrder = (payload: CreateOrderRequest) => OrdersService.createOrder(payload);

export const updateOrderDirect = (payload: UpdateOrderRequest) => OrdersService.updateOrderDirect(payload);

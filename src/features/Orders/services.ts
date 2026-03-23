import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "@/src/constants";
import { SORT } from "@/src/types";
import {
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  GetOrdersListRequest,
  GetOrdersListResponse,
  Order,
  UpdateOrderRequest,
  UpdateOrderResponse,
} from "./types";
import http from "@/lib/http";

export class OrdersService {
  static async getOrdersList(
    params: GetOrdersListRequest,
  ): Promise<GetOrdersListResponse> {
    const pagination = params.pagination;
    try {
      const response = await http.post("/orders/list", {
        pagination,
        sort: params.sort ?? { field: "id", order: SORT.DESC },
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
      throw new Error(
        `Lỗi khi lấy danh sách orders: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async getOrderDetail(
    params: GetOrderDetailRequest,
  ): Promise<GetOrderDetailResponse> {
    try {
      const response = await http.get(`orders/${params.id}`);

      return {
        data: response.data as Order,
      };
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy chi tiết order ${params.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async updateOrder(
    params: UpdateOrderRequest,
  ): Promise<UpdateOrderResponse> {
    try {
      const currentData = await http.get(`orders/${params.id}`);

      const response = await http.put("orders", {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Order,
      };
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật order ${params.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async deleteMany(ids: number[]): Promise<{ data: number[] }> {
    try {
      const response = await http.delete("orders", { data: { ids } });

      return {
        data: response.data || [],
      };
    } catch (error) {
      throw new Error(
        `Lỗi khi xóa nhiều orders: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  static async getOrdersStats(filter: GetOrdersListRequest["filter"] = {}) {
    try {
      const response = await OrdersService.getOrdersList({
        pagination: { page: 1, perPage: 1000 },
        filter,
      });

      const orders = response.data;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const statusCounts = orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        statusCounts,
        returnedOrders: orders.filter((order) => order.returned).length,
      };
    } catch (error) {
      throw new Error(
        `Lỗi khi lấy thống kê orders: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const fetchOrdersList = (params: GetOrdersListRequest) =>
  OrdersService.getOrdersList(params);

export const fetchOrderDetail = (params: GetOrderDetailRequest) =>
  OrdersService.getOrderDetail(params);

export const updateOrder = (params: UpdateOrderRequest) =>
  OrdersService.updateOrder(params);

export const deleteOrders = (ids: number[]) => OrdersService.deleteMany(ids);

export const fetchOrdersStats = (filter?: GetOrdersListRequest["filter"]) =>
  OrdersService.getOrdersStats(filter);

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiResponseList, SORT } from "@/src/types";
import { Customer } from "../../customer/types";

export type OrderStatus = "ordered" | "delivered" | "cancelled";

export type BasketItem = {
  product_id: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  reference: string;
  date: string;
  customer: Customer;
  customer_id: number;
  basket: BasketItem[];
  total_ex_taxes: number;
  delivery_fees: number;
  tax_rate: number;
  taxes: number;
  total: number;
  status: OrderStatus;
  returned: boolean;
  address?: string;
  nb_items?: string;
};

export interface GetOrdersListRequest {
  pagination: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: SORT;
  };
  filter?: {
    status?: OrderStatus;
    customer_id?: number;
    date_from?: string;
    date_to?: string;
    total_gte?: number;
    total_lte?: number;
    reference?: string;
  };
}

export interface GetOrderDetailRequest {
  id: number;
}

export interface UpdateOrderRequest {
  id: number;
  data: Partial<Omit<Order, "id">>;
}

export type GetOrdersListResponse = ApiResponseList<Order>;

export type GetOrderDetailResponse = ApiResponse<Order>;

export type UpdateOrderResponse = ApiResponse<Order>;

export type DeleteOrderResponse = ApiResponse<Order>;

export type CreateOrderRequest = {
  customer_id: number;
  address?: string;
  tax_rate?: number;
  delivery_fees?: number;
  basket: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
};

export type CreateOrderResponse = {
  data: Order;
};

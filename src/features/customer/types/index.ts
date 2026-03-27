import { ApiResponse, ApiResponseList, SORT } from "@/src/types";

export type Group =
  | "regular"
  | "ordered_once"
  | "collector"
  | "reviewer"
  | "compulsive";

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  zipcode: string | null;
  city: string | null;
  stateAbbr: string | null;
  avatar: string | undefined;
  birthday: string | null;
  first_seen: string;
  last_seen: string;
  has_ordered: boolean;
  latest_purchase: string | null;
  has_newsletter: boolean;
  groups: Group[];
  nb_orders: number;
  total_spent: number;
};

export interface GetCustomersListRequest {
  pagination: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: SORT;
  };
  filter?: {
    id?: string;
    q?: string;
    groups?: string;
    last_seen_gte?: string;
    last_seen_lte?: string;
    has_newsletter?: string;
    nb_orders_gte?: string;
  };
}

export type CustomerListResponse = ApiResponseList<Customer>;

export type GetCustomerDetailRequest = {
  id: number;
};

export type GetCustomerDetailResponse = ApiResponse<Customer>;

export type Groups =
  | "compulsive"
  | "collector"
  | "ordered_once"
  | "regular"
  | "returns"
  | "reviewer";

export type DeleteCustomersRequest = {
  ids: number[];
};

export interface UpdateCustomerRequest {
  id: number;
  data: Partial<Omit<Customer, "id">>;
}

export type UpdateCustomerResponse = ApiResponse<Customer>;

export interface CreateCustomerRequest {
  data: Partial<Omit<Customer, "id">>;
}

export type SortKey<T> = keyof T;

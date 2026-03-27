import { ApiResponse, ApiResponseList, SORT } from "@/src/types";

export type Product = {
  id: number;
  inventory_id: number;
  reference: string;
  width: number;
  height: number;
  price: number;
  thumbnail: string;
  image: string;
  description: string;
  sales: number;
  quantity?: number;
};

export type ProductListResponse = ApiResponseList<Product>;

export interface GetProductListRequest {
  pagination: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: SORT;
  };
  filter?: {
    sale?: string;
    inventory_id?: string;
    q?: string;
    id?: number[];
  };
}

export type GetProductsListResponse = ApiResponseList<Product>;

export type GetProductDetailRequest = {
  id: number;
};

export type GetProductDetailResponse = ApiResponse<Product>;

export type DeleteProductsRequest = {
  ids: number[];
};

export interface UpdateProductRequest {
  id: number;
  data: Partial<Omit<Product, "id">>;
}

export type UpdateProductResponse = ApiResponse<Product>;

export interface CreateProductRequest {
  data: Partial<Omit<Product, "id">>;
}

import { ApiResponse } from "@/src/types";

export type Inventory = {
  id: number;
  name: string;
  image: string;
  stock: number;
};

export type GetInventoriesListResponse = ApiResponse<Inventory[]>;

export interface UpdateInventoryRequest {
  id: number | null;
  data: Partial<Omit<Inventory, "id">>;
}

export type GetInventoryDetailRequest = {
  id: number;
};

export type GetInventoryDetailResponse = ApiResponse<Inventory>;

export interface CreateInventoryRequest {
  data: Partial<Omit<Inventory, "id">>;
}

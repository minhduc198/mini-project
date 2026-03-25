/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "@/lib/http";
import {
  GetInventoriesListResponse,
  GetInventoryDetailRequest,
  GetInventoryDetailResponse,
  Inventory,
  UpdateInventoryRequest,
} from "../types/types";

export class InventoriesService {
  static async getInventoriesList(): Promise<GetInventoriesListResponse> {
    try {
      const response = await http.get("inventories", {
        params: {
          pagination: { page: 1, perPage: 999 },
          sort: {
            field: "id",
            order: "ASC",
          },
        },
      });

      return {
        data: response.data.data as Inventory[],
      };
    } catch (error: any) {
      const errMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      throw new Error(errMessage);
    }
  }

  static async deleteInventory(id: number) {
    try {
      const response = await http.delete(`/categories/${id}`);

      return {
        data: response.data as Inventory,
      };
    } catch (error: any) {
      const errMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      throw new Error(errMessage);
    }
  }

  static async updateInventory(params: UpdateInventoryRequest) {
    try {
      const currentData = await http.get(`categories/${params.id}`);

      const response = await http.put("categories", {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Inventory,
      };
    } catch (error: any) {
      const errMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      throw new Error(errMessage);
    }
  }

  static async getInventoryDetail(
    params: GetInventoryDetailRequest,
  ): Promise<GetInventoryDetailResponse> {
    try {
      const response = await http.get(`categories/${params.id}`);

      return {
        data: response.data as Inventory,
      };
    } catch (error: any) {
      const errMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      throw new Error(errMessage);
    }
  }
}

export const fetchInventoriesList = () =>
  InventoriesService.getInventoriesList();
export const fetchInventoryDetail = (params: GetInventoryDetailRequest) =>
  InventoriesService.getInventoryDetail(params);
export const deleteInventory = (id: number) =>
  InventoriesService.deleteInventory(id);
export const updateInventory = (params: UpdateInventoryRequest) =>
  InventoriesService.updateInventory(params);

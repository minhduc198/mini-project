/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '@/src/lib/http';
import {
  CreateInventoryRequest,
  GetInventoriesListResponse,
  GetInventoryDetailRequest,
  GetInventoryDetailResponse,
  Inventory,
  UpdateInventoryRequest,
} from '../types';

export class InventoriesService {
  static async getInventoriesList(): Promise<GetInventoriesListResponse> {
    try {
      const response = await http.get('inventories', {
        params: {
          pagination: { page: 1, perPage: 999 },
          sort: {
            field: 'id',
            order: 'ASC',
          },
        },
      });

      return {
        data: response.data.data as Inventory[],
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async deleteInventory(ids: number[]) {
    try {
      await http.delete('inventories', {
        data: {
          ids,
        },
      });

      return null;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async updateInventory(params: UpdateInventoryRequest) {
    try {
      const currentData = await http.get(`inventories/${params.id}`);

      const response = await http.put('inventories', {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Inventory,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async getInventoryDetail(params: GetInventoryDetailRequest): Promise<GetInventoryDetailResponse> {
    try {
      const response = await http.get(`inventories/${params.id}`);

      return {
        data: response.data as Inventory,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async createInventory(params: CreateInventoryRequest): Promise<Inventory> {
    try {
      const response = await http.post('inventories', {
        data: params.data,
      });

      return response.data as Inventory;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }
}

export const fetchInventoriesList = () => InventoriesService.getInventoriesList();
export const fetchInventoryDetail = (params: GetInventoryDetailRequest) => InventoriesService.getInventoryDetail(params);
export const deleteInventory = (ids: number[]) => InventoriesService.deleteInventory(ids);
export const updateInventory = (params: UpdateInventoryRequest) => InventoriesService.updateInventory(params);
export const createInventory = (params: CreateInventoryRequest) => InventoriesService.createInventory(params);

/* eslint-disable @typescript-eslint/no-explicit-any */

import { SORT } from '@/src/types';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/src/constants';
import http from '@/src/lib/http';
import {
  CreateCustomerRequest,
  Customer,
  CustomerListResponse,
  DeleteCustomersRequest,
  GetCustomerDetailRequest,
  GetCustomerDetailResponse,
  GetCustomersListRequest,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from '../types';

export class CustomerService {
  static async getCustomerList(params: GetCustomersListRequest): Promise<CustomerListResponse> {
    const pagination = params.pagination;

    try {
      const response = await http.post('/customers/list', {
        pagination,
        sort: params.sort ?? { field: 'id', order: SORT.DESC },
        filter: params.filter ?? {},
      });

      return {
        ...(pagination ?? {
          page: DEFAULT_PAGE,
          perPage: DEFAULT_PER_PAGE,
        }),
        data: response.data.data as Customer[],
        total: response.data.total || 0,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async getCustomerDetail(params: GetCustomerDetailRequest): Promise<GetCustomerDetailResponse> {
    try {
      const response = await http.get(`customers/${params.id}`);

      return {
        data: response.data as Customer,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async deleteCustomers(params: DeleteCustomersRequest): Promise<null> {
    try {
      await http.delete('customers', {
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

  static async updateCustomer(params: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    try {
      const currentData = await http.get(`customers/${params.id}`);

      const response = await http.put('customers', {
        id: params.id,
        data: params.data,
        previousData: currentData.data,
      });

      return {
        data: response.data as Customer,
      };
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }

  static async createCustomer(params: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await http.post('customers', {
        data: params.data,
      });

      return response.data as Customer;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';

      throw new Error(errMessage);
    }
  }
}

export const fetchCustomersList = (params: GetCustomersListRequest) => CustomerService.getCustomerList(params);
export const fetchCustomerDetail = (params: GetCustomerDetailRequest) => CustomerService.getCustomerDetail(params);
export const deleteCustomers = (params: DeleteCustomersRequest) => CustomerService.deleteCustomers(params);
export const createCustomer = (params: CreateCustomerRequest) => CustomerService.createCustomer(params);
export const updateCustomer = (params: UpdateCustomerRequest) => CustomerService.updateCustomer(params);

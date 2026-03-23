import { ReactNode } from "react";

export enum SORT {
  DESC = "DESC",
  ASC = "ASC",
}

export interface UrlQuery<T> {
  displayedFilters?: { [key in keyof T]?: boolean };
  filter: { [key in keyof T]?: T[key] };
  order: SORT;
  page: number;
  perPage: number;
  sort: keyof T;
}

export interface ApiResponseList<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface TableColumns<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  disablePadding?: boolean;
  sortable?: boolean;
  isVisible?: boolean;
  sortBy?: string;
  forceClickRow?: boolean;
  minWidth?: number;
  width?: number;
  cell?: (value: unknown, row: T) => ReactNode;
}

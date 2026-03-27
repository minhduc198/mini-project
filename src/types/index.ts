export enum SORT {
  DESC = "DESC",
  ASC = "ASC",
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

export interface ColumnHeader<T> {
  id: keyof T;
  label: string;
  cellRender?: (row: T) => React.ReactNode;
}

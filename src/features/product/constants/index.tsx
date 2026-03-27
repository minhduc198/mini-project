import { GetProductListRequest } from "../types";

export const SORT_OPTIONS = [
  { key: "reference", label: "Reference" },
  { key: "price", label: "Price" },
  { key: "sales", label: "Sales" },
] as {
  key: GetProductListRequest["sort"] extends { field: infer F } ? F : string;
  label: string;
}[];

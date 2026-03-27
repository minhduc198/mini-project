import { GetProductListRequest } from "../types";

export const productKeys = {
  all: ["product"] as const,

  list: (params: GetProductListRequest) => ["product", "list", params] as const,

  stats: () => ["product", "stats"] as const,
};

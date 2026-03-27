import { GetOrdersListRequest } from "../types";

export const orderKeys = {
  all: ["order"] as const,

  list: (params: GetOrdersListRequest) => ["order", "list", params] as const,

  stats: () => ["order", "stats"] as const,
};

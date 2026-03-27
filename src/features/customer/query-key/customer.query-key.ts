import { GetCustomersListRequest } from "../types";

export const customerKeys = {
  all: ["customer"] as const,

  list: (params: GetCustomersListRequest) =>
    ["customer", "list", params] as const,

  stats: () => ["customer", "stats"] as const,
};

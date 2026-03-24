import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "../constants";
import { CustomerUrlQuery } from "../features/customer/types";
import { SORT } from "../types";

const customerListParamsLSName = "customer.listParams";

export function saveCustomerListParamsToLS(value: CustomerUrlQuery) {
  localStorage.setItem(customerListParamsLSName, JSON.stringify(value));
}

export function getCustomerListParamsFormLS(): CustomerUrlQuery {
  const dataLs = localStorage.getItem(customerListParamsLSName);

  if (!dataLs)
    return {
      filter: {},
      order: SORT.DESC,
      page: DEFAULT_PAGE,
      perPage: DEFAULT_PER_PAGE,
      sort: "id",
    };
  const obj = JSON.parse(dataLs);
  return obj;
}

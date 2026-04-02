import { AddCustomerFormValues } from "../schemas";
import { Customer, Group, SortKey } from "../types";

export const GROUP_STYLE: Record<Group, string> = {
  regular: "bg-white/5 text-white/40 border border-white/10",
  ordered_once: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
  collector: "bg-violet-500/15 text-violet-300 border border-violet-500/20",
  reviewer: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  compulsive: "bg-pink-500/15 text-pink-400 border border-pink-500/20",
};

export const GROUP_LABELS: Record<Group, string> = {
  regular: "Regular",
  ordered_once: "Ordered Once",
  collector: "Collector",
  reviewer: "Reviewer",
  compulsive: "Compulsive",
};

export const LIST_SORT_BY = [
  { key: "total_spent", label: "Revenue" },
  { key: "nb_orders", label: "Orders" },
  { key: "last_seen", label: "Last Seen" },
  { key: "first_seen", label: "Join Date" },
  { key: "latest_purchase", label: "Last Purchase" },
  { key: "last_name", label: "Name" },
] as { key: SortKey<Customer>; label: string }[];

export const FIELDS: {
  name: keyof AddCustomerFormValues;
  label: string;
  placeholder: string;
  type?: string;
  half?: boolean;
}[] = [
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Minh",
    half: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Duc",
    half: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "minhduc@gmail.com",
    type: "email",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Ha Noi",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Ha Noi",
    half: true,
  },
  {
    name: "zipcode",
    label: "Zip Code",
    placeholder: "10000",
    half: true,
  },
  {
    name: "birthday",
    label: "Birthday",
    placeholder: "",
    type: "date",
    half: true,
  },
  {
    name: "imageUrl",
    label: "Avatar URL",
    placeholder: "https://…",
    half: true,
  },
];

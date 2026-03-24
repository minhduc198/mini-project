import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatShortNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(num);
};

export const formatDate = (iso?: string, fallback = "—") => {
  if (!iso) return fallback;

  const date = parseISO(iso);
  return isValid(date) ? format(date, "dd MMM yyyy") : fallback;
};

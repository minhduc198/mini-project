import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatShortNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(num);
};

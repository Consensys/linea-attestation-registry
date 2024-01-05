import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;

export function isNotNullOrUndefined<T extends object>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

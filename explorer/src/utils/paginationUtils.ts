import { CURRENT_PAGE_DEFAULT, ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";

export const getItemsByPage = (page: number, itemsPerPage: number): number =>
  page === CURRENT_PAGE_DEFAULT ? ZERO : (page - 1) * itemsPerPage;

export const pageBySearchParams = (
  searchParams: URLSearchParams,
  totalItems: number,
  itemsPerPage = ITEMS_PER_PAGE_DEFAULT,
): number => {
  const pageSearchParams = searchParams.get(EQueryParams.PAGE);
  const totalPages = Math.ceil(Number(totalItems) / itemsPerPage);
  return Math.max(1, Math.min(Number(pageSearchParams), totalPages));
};

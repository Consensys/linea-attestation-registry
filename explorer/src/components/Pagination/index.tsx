import { t } from "i18next";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { pageBySearchParams } from "@/utils/paginationUtils";

import { IPaginationProps } from "./interface";

export const Pagination = ({ itemsCount, handlePage }: IPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = pageBySearchParams(searchParams, itemsCount);

  useEffect(() => {
    handlePage(currentPage);
  }, [currentPage, handlePage, searchParams]);

  const totalPages = Math.ceil(itemsCount / ITEMS_PER_PAGE_DEFAULT);

  const disablePrev = currentPage === 1;
  const disableNext = currentPage === totalPages;

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && inputRef && inputRef.current) {
      inputRef.current.value = newPage.toString();
      searchParams.set(EQueryParams.PAGE, newPage.toString());
      setSearchParams(searchParams);
    }
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  const changePage = (inputPage: string) => {
    const page = Number(inputPage);
    const selectedPage = Math.min(Math.max(page, 1), totalPages);
    inputPage.length && handlePageChange(selectedPage);
  };

  const blurHandler = () => {
    !inputRef.current?.value.length && handlePageChange(currentPage);
  };

  return (
    <div className="flex justify-between items-center mt-8 mb-24">
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="First"
          onClick={handleFirstPage}
          disabled={disablePrev}
          className={`${disablePrev && "opacity-40"}`}
        >
          <ChevronsLeft />
        </button>
        <button
          type="button"
          aria-label="Previous"
          onClick={handlePreviousPage}
          disabled={disablePrev}
          className={`flex text-base font-semibold ${disablePrev && "opacity-40"}`}
        >
          <ChevronLeft />
          <span className="hidden md:inline-block">{t("common.actions.previous")}</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          ref={inputRef}
          defaultValue={currentPage}
          onBlur={blurHandler}
          onChange={(event) => changePage(event.target.value)}
          className="w-16 h-8 px-2 border text-xs font-semibold text-zinc-950 text-center outline-none border-slate-200 focus:border-slate-400 rounded-lg"
        />
        <span className="text-slate-500 text-xs font-normal">{`of ${displayAmountWithComma(totalPages)}`}</span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Next"
          onClick={handleNextPage}
          disabled={disableNext}
          className={`flex text-base font-semibold ${disableNext && "opacity-40"}`}
        >
          <span className="hidden md:inline-block">{t("common.actions.next")}</span> <ChevronRight />
        </button>
        <button
          type="button"
          aria-label="Last"
          onClick={handleLastPage}
          disabled={disableNext}
          className={`${disableNext && "opacity-40"}`}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
};

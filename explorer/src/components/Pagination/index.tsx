import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { CURRENT_PAGE_DEFAULT, ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { IPaginationProps } from "./interface";

export const Pagination = ({ itemsCount, handleSkip }: IPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get(EQueryParams.PAGE);

  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
  const totalPages = Math.ceil(itemsCount / ITEMS_PER_PAGE_DEFAULT);

  const disablePrev = currentPage === 1;
  const disableNext = currentPage === totalPages;

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(searchParams);
    currentSearchParams.set(EQueryParams.PAGE, currentPage.toString());
    setSearchParams(currentSearchParams);
  }, [currentPage, searchParams, setSearchParams]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && inputRef && inputRef.current) {
      setCurrentPage(newPage);
      handleSkip(newPage === CURRENT_PAGE_DEFAULT ? ZERO : (newPage - 1) * ITEMS_PER_PAGE_DEFAULT);
      inputRef.current.value = newPage.toString();
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
          <span className="hidden md:inline-block">Previous</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          ref={inputRef}
          key={currentPage}
          defaultValue={currentPage}
          onBlur={blurHandler}
          onChange={(event) => changePage(event.target.value)}
          className="w-12 h-8 px-2 border text-xs font-semibold text-zinc-950 text-center outline-none border-slate-200 focus:border-slate-400 rounded-lg"
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
          <span className="hidden md:inline-block">Next</span> <ChevronRight />
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

import { t } from "i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";

import { IBasicPaginationProps } from "./interface";
import { PerPageSelector } from "../PerPageSelector";

export const BasicPagination = ({ handlePage }: IBasicPaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [itemsPerPage, setItemsPerPage] = useState<string | number>(
    Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    handlePage(currentPage);
  }, [currentPage, handlePage, searchParams]);

  const itemsPerPageValues = [ITEMS_PER_PAGE_DEFAULT, 20, 50, 100];

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && inputRef && inputRef.current) {
      inputRef.current.value = newPage.toString();
      searchParams.set(EQueryParams.PAGE, newPage.toString());
      setSearchParams(searchParams);
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPage = (val: number | string) => {
    setItemsPerPage(val);
    searchParams.set(EQueryParams.ITEMS_PER_PAGE, String(val));
    setSearchParams(searchParams);
  };
  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  const changePage = (inputPage: string) => {
    const page = Number(inputPage);
    inputPage.length && handlePageChange(page);
  };

  const blurHandler = () => {
    !inputRef.current?.value.length && handlePageChange(currentPage);
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={handlePreviousPage}
          className="flex text-base font-semibold dark:text-whiteDefault hover:opacity-60 transition"
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
          className="w-16 h-8 px-2 border text-xs font-semibold dark:bg-transparent text-text-primary dark:text-whiteDefault text-center outline-none border-border-table dark:border-greyDark focus:border-border-inputFocus dark:focus:border-border-inputFocus rounded-lg transition"
        />
        <PerPageSelector onChange={handleItemsPerPage} values={itemsPerPageValues} value={itemsPerPage} />
        <span className="hidden md:inline-block text-slate-500 text-xs font-normal">
          {t("common.messages.perPage")}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          aria-label="Next"
          onClick={handleNextPage}
          className="flex text-base font-semibold dark:text-whiteDefault hover:opacity-60 transition"
        >
          <span className="hidden md:inline-block">{t("common.actions.next")}</span> <ChevronRight />
        </button>
      </div>
    </div>
  );
};

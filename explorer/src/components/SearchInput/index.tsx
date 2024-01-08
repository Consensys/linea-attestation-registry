import { t } from "i18next";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EMPTY_STRING } from "@/constants";
import { keyboard } from "@/constants/keyboard";
import { EQueryParams } from "@/enums/queryParams";
import { useHandleSearch } from "@/hooks/useHandleSearch";

export const SearchInput: React.FC<{ className?: string; height?: string }> = ({ className, height = "h-12" }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);
  const [searchQuery, setSearchQuery] = useState<string>(search || EMPTY_STRING);
  const handleSearch = useHandleSearch();

  useEffect(() => {
    if (!search && searchQuery) setSearchQuery(EMPTY_STRING);
    if (search) setSearchQuery(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div
      className={`w-full md:max-w-[370px] xl:min-w-[auto] ${height} p-2 bg-white dark:bg-transparent rounded-md border border-border-card dark:border-border-cardDark justify-between items-center inline-flex focus-within:border-border-inputFocus ${className}`}
    >
      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={t("common.inputPlaceholder.search")}
        className="dark:bg-transparent text-base w-full outline-none placeholder:italic placeholder:text-text-quaternary text-text-input dark:text-whiteDefault"
        onKeyDown={(event) => event.key === keyboard.enter && handleSearch(searchQuery)}
      />
      <div
        className={`p-1.5 bg-surface-secondary dark:bg-surface-secondaryDark text-text-darkGrey dark:text-text-quaternary rounded ${
          !searchQuery ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => handleSearch(searchQuery)}
      >
        <Search className="w-5 h-5" />
      </div>
    </div>
  );
};

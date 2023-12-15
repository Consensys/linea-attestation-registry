import { t } from "i18next";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EMPTY_STRING } from "@/constants";
import { keyboard } from "@/constants/keyboard";
import { EQueryParams } from "@/enums/queryParams";
import { useHandleSearch } from "@/hooks/useHandleSearch";

export const SearchInput: React.FC = () => {
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
    <div className="w-full md:max-w-[370px] xl:min-w-[auto] h-12 p-2 bg-white rounded-md border border-border-card justify-between items-center inline-flex focus-within:border-border-inputFocus">
      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={t("common.inputPlaceholder.search")}
        className="text-base w-full outline-none placeholder:italic placeholder:text-text-quaternary text-text-input"
        onKeyDown={(event) => event.key === keyboard.enter && handleSearch(searchQuery)}
      />
      <div
        className={`p-1.5 bg-surface-secondary text-text-darkGrey rounded ${
          !searchQuery ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => handleSearch(searchQuery)}
      >
        <Search className="w-5 h-5" />
      </div>
    </div>
  );
};

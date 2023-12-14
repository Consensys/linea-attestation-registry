import { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import archive from "@/assets/icons/archive.svg";
import { InfoBlock } from "@/components/InfoBlock";
import { DEFAULT_SEARCH_ELEMENTS } from "@/constants/components";
import { EQueryParams } from "@/enums/queryParams";
import { Page, SearchElementProps } from "@/interfaces/components";
import { parseSearch } from "@/utils/searchUtils";

import { SearchAttestations } from "./components/SearchAttestations";
import { SearchModules } from "./components/SearchModules";
import { SearchSchemas } from "./components/SearchSchemas";

//todo: load more and loading for child
export const Search = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const [searchElements, setSearchElements] = useState<SearchElementProps>(DEFAULT_SEARCH_ELEMENTS);
  const count = Object.values(searchElements).reduce((acc, currentValue) => acc + currentValue.count, 0);
  const isLoaded = Object.values(searchElements).every((element) => element.loaded);

  const updateSearchElement = (page: Page, count: number, loaded: boolean) => {
    setSearchElements((prev) => ({ ...prev, [page]: { loaded, count } }));
  };
  const notFound = isLoaded && count === 0;

  return (
    <section className="container flex flex-col items-start gap-10">
      {notFound ? (
        <InfoBlock
          icon={<img src={archive} alt="archive" />}
          message={
            <span className="break-all [&>strong]:text-text-primary">
              <Trans i18nKey="common.messages.searchNotFound" values={{ search }} components={{ bold: <strong /> }} />
            </span>
          }
        />
      ) : (
        <>
          <p className="text-text-tertiary text-base [&>strong]:text-text-primary break-word">
            <Trans i18nKey="common.messages.searchFound" values={{ count, search }} components={{ bold: <strong /> }} />
          </p>
          <div className="flex flex-col gap-12 w-full">
            <SearchAttestations
              parsedString={parsedString}
              getSearchData={(count, loaded) => updateSearchElement("attestation", count, loaded)}
            />
            <SearchSchemas
              parsedString={parsedString}
              getSearchData={(count, loaded) => updateSearchElement("schema", count, loaded)}
            />
            <SearchModules
              parsedString={parsedString}
              getSearchData={(count, loaded) => updateSearchElement("module", count, loaded)}
            />
          </div>
        </>
      )}
    </section>
  );
};

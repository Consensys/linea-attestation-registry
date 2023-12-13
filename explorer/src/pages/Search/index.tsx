import { useState } from "react";
import { useParams } from "react-router-dom";

import archive from "@/assets/icons/archive.svg";
import { InfoBlock } from "@/components/InfoBlock";
import { DEFAULT_SEARCH_ELEMENTS } from "@/constants/components";
import { Page, SearchElementProps } from "@/interfaces/components";

import { SearchAttestations } from "./components/SearchAttestations";
import { SearchModules } from "./components/SearchModules";
import { SearchSchemas } from "./components/SearchSchemas";

//todo: load more
export const Search = () => {
  const { search } = useParams();
  const [searchElements, setSearchElements] = useState<SearchElementProps>(DEFAULT_SEARCH_ELEMENTS);
  const count = Object.values(searchElements).reduce((acc, currentValue) => acc + currentValue.count, 0);
  const isLoaded = Object.values(searchElements).every((element) => element.loaded);

  const updateCount = (page: Page, count: number, loaded: boolean) => {
    setSearchElements((prev) => ({ ...prev, [page]: { loaded, count } }));
  };
  const notFound = isLoaded && count === 0;
  return (
    <section className="container flex flex-col items-start gap-10">
      {notFound ? (
        <InfoBlock
          icon={<img src={archive} alt="archive" />}
          message={
            <span className="break-all">
              Nothing found on <strong className="text-text-primary">“{search}”</strong> search request
            </span>
          }
        />
      ) : (
        <>
          <p className="text-text-tertiary text-base [&>strong]:text-black break-word">
            <strong>{count}</strong> results found on <strong>“{search}”</strong> search request
          </p>
          <div className="flex flex-col gap-12 w-full">
            <SearchAttestations getSearchData={(count, loaded) => updateCount("attestation", count, loaded)} />
            <SearchSchemas getSearchData={(count, loaded) => updateCount("schema", count, loaded)} />
            <SearchModules getSearchData={(count, loaded) => updateCount("module", count, loaded)} />
          </div>
        </>
      )}
    </section>
  );
};

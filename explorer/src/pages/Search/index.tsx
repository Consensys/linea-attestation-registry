import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import archive from "@/assets/icons/archive.svg";
import magnifyingGlass from "@/assets/icons/magnifying-glass.svg";
import { InfoBlock } from "@/components/InfoBlock";
import { EMPTY_STRING } from "@/constants";
import { DEFAULT_SEARCH_ELEMENTS } from "@/constants/components";
import { EQueryParams } from "@/enums/queryParams";
import { Page, SearchElementProps } from "@/interfaces/components";
import { useNetworkContext } from "@/providers/network-provider/context.ts";
import { CHAIN_ID_ROUTE, toAttestationById } from "@/routes/constants";
import { parseSearch } from "@/utils/searchUtils";

import { SearchAttestationsReceived } from "./components/SearchAttestationsReceived";
import { SearchModules } from "./components/SearchModules";
import { SearchPortals } from "./components/SearchPortals";
import { SearchSchemas } from "./components/SearchSchemas";

//todo: load more and loading for child
export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get(EQueryParams.SEARCH_QUERY);
  const {
    network: { prefix, network },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search, prefix), [search, prefix]);

  const [searchElements, setSearchElements] = useState<SearchElementProps>(DEFAULT_SEARCH_ELEMENTS);
  const [notFound, setNotFound] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newCount = Object.values(searchElements).reduce((acc, currentValue) => acc + currentValue.count, 0);
    const newIsLoaded = Object.values(searchElements).every((element) => element.loaded);

    setCount(newCount);
    setIsLoaded(newIsLoaded);
    setNotFound(newIsLoaded && newCount === 0);
    if (isOnlyAttestationsFound(searchElements)) {
      navigate(toAttestationById(search ?? "").replace(CHAIN_ID_ROUTE, network), {
        state: { from: location.pathname },
      });
    }
  }, [searchElements, navigate, network, search]);

  const updateSearchElement = (page: Page, count: number, loaded: boolean) => {
    setSearchElements((prev) => ({ ...prev, [page]: { loaded, count } }));
  };

  const isOnlyAttestationsFound = (searchElements: SearchElementProps) => {
    const { attestation, module, portal, schema } = searchElements;
    return (
      attestation.loaded &&
      module.loaded &&
      portal.loaded &&
      schema.loaded &&
      attestation.count > 0 &&
      module.count === 0 &&
      portal.count === 0 &&
      schema.count === 0
    );
  };

  return (
    <section className="container flex flex-col items-start gap-10 lg:mt-16 md:mt-8 mt-5">
      {!isLoaded && (
        <InfoBlock
          icon={<img src={magnifyingGlass} alt="magnifying glass" />}
          message={
            <span className="break-all [&>strong]:text-text-primary dark:[&>strong]:text-text-secondaryDark">
              <Trans i18nKey="common.messages.searchInProgress" values={{ search }} components={{ bold: <strong /> }} />
            </span>
          }
        />
      )}

      {notFound && (
        <InfoBlock
          icon={<img src={archive} alt="archive" />}
          message={
            <span className="break-all [&>strong]:text-text-primary dark:[&>strong]:text-text-secondaryDark">
              <Trans i18nKey="common.messages.searchNotFound" values={{ search }} components={{ bold: <strong /> }} />
            </span>
          }
        />
      )}

      {count > 0 && (
        <p className="text-text-tertiary text-base dark:text-tertiary [&>strong]:text-text-primary dark:[&>strong]:text-text-secondaryDark break-word">
          <Trans i18nKey="common.messages.searchFound" values={{ count, search }} components={{ bold: <strong /> }} />
        </p>
      )}

      <div className="flex flex-col gap-12 w-full">
        <SearchAttestationsReceived
          search={search || EMPTY_STRING}
          parsedString={parsedString}
          getSearchData={(count, loaded) => updateSearchElement("attestation", count, loaded)}
        />
        <SearchSchemas
          search={search || EMPTY_STRING}
          parsedString={parsedString}
          getSearchData={(count, loaded) => updateSearchElement("schema", count, loaded)}
        />
        <SearchModules
          search={search || EMPTY_STRING}
          parsedString={parsedString}
          getSearchData={(count, loaded) => updateSearchElement("module", count, loaded)}
        />
        <SearchPortals
          search={search || EMPTY_STRING}
          parsedString={parsedString}
          getSearchData={(count, loaded) => updateSearchElement("portal", count, loaded)}
        />
      </div>
    </section>
  );
};

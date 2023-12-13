import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { columns } from "@/constants/columns/module";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { SearchWrapper } from "../SearchWrapper";

export const SearchModules: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const { search } = useParams();
  const {
    sdk: { module },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: moduleList } = useSWR(
    `${SWRKeys.GET_MODULE_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => {
      const [listByName, listByDescription] = parsedString.nameOrDescription
        ? await Promise.all([
            module.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
              name_starts_with: parsedString.nameOrDescription,
            }),
            module.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
              description_starts_with: parsedString.nameOrDescription,
            }),
          ])
        : [];

      const [listByIds] = parsedString.address
        ? await Promise.all(parsedString.address.map((id) => module.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { id })))
        : [];

      const result = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

      return result;
    },
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!moduleList || !moduleList.length) return null;
  return (
    <SearchWrapper title="Module" items={moduleList.length}>
      <DataTable columns={columns()} data={moduleList} />
    </SearchWrapper>
  );
};

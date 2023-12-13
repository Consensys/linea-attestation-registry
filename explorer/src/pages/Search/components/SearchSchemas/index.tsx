import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { columns } from "@/constants/columns/schema";
import { SearchDataFunction } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { parseSearch } from "@/utils/searchUtils";

import { SearchWrapper } from "../SearchWrapper";

export const SearchSchemas: React.FC<{ getSearchData: SearchDataFunction }> = ({ getSearchData }) => {
  const { search } = useParams();
  const {
    sdk: { schema },
    network: { chain },
  } = useNetworkContext();
  const parsedString = useMemo(() => parseSearch(search), [search]);

  const { data: schemasList } = useSWR(
    `${SWRKeys.GET_SCHEMAS_LIST}/${SWRKeys.SEARCH}/${search}/${chain.id}`,
    async () => {
      const [listByName, listByDescription] = parsedString.nameOrDescription
        ? await Promise.all([
            schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
              name_contains: parsedString.nameOrDescription,
            }),
            schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
              description_contains: parsedString.nameOrDescription,
            }),
          ])
        : [];

      const [listByIds] = parsedString.schemasIds
        ? await Promise.all(
            parsedString.schemasIds.map((id) => schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { id })),
          )
        : [];

      const listBySchemaString = parsedString.schemaString
        ? await schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { schema_contains: parsedString.schema })
        : [];

      const [listByContext] = parsedString.urls
        ? await Promise.all(
            parsedString.urls.map((url) => schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { context_contains: url })),
          )
        : [];

      const result = [
        ...(listByIds || []),
        ...listBySchemaString,
        ...(listByName || []),
        ...(listByDescription || []),
        ...(listByContext || []),
      ];

      return result;
    },
    {
      shouldRetryOnError: false,
      revalidateAll: false,
      onSuccess: (data) => getSearchData(data.length, true),
      onError: () => getSearchData(0, true),
    },
  );

  if (!schemasList || !schemasList.length) return null;
  return (
    <SearchWrapper title="Schemas" items={schemasList.length}>
      <DataTable columns={columns()} data={schemasList} />
    </SearchWrapper>
  );
};

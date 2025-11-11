import { SchemaDataMapper } from "@verax-attestation-registry/verax-sdk";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { NetworkType } from "@/contexts/NetworkContext.ts";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined, mainnets, testnets } from "@/utils";
import { uniqMap } from "@/utils/searchUtils";

export const loadSchemaList = async (
  schema: SchemaDataMapper,
  parsedString: Partial<ResultParseSearch>,
  networkType: NetworkType,
) => {
  const chainsToSearch = networkType === "mainnet" ? mainnets : testnets;

  const [listByName, listByDescription] = parsedString.nameOrDescription
    ? await Promise.all([
        schema.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          name_contains_nocase: parsedString.nameOrDescription,
        }),
        schema.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          description_contains_nocase: parsedString.nameOrDescription,
        }),
      ])
    : [];

  const listByIds = (
    parsedString.schemasIds ? await Promise.all(parsedString.schemasIds.map((id) => schema.findOneById(id))) : []
  ).filter(isNotNullOrUndefined);

  const listBySchemaString = parsedString.schema
    ? await schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { schema_contains: parsedString.schema })
    : [];

  const [listByContext] = parsedString.urls
    ? await Promise.all(
        parsedString.urls.map((url) => schema.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { context_contains: url })),
      )
    : [];

  const results = [
    ...(listByIds || []),
    ...listBySchemaString,
    ...(listByName || []),
    ...(listByDescription || []),
    ...(listByContext || []),
  ];

  return uniqMap(results, "id");
};

import { SchemaDataMapper } from "@verax-attestation-registry/verax-sdk";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { NetworkType } from "@/contexts/NetworkContext.ts";
import { ResultParseSearch } from "@/interfaces/components";
import { mainnets, testnets } from "@/utils";
import { aggregateByNetwork } from "@/utils/searchUtils";

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

  const listByIds =
    parsedString.schemasIds && parsedString.schemasIds.length > 0
      ? await schema.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          id_in: parsedString.schemasIds,
        })
      : [];

  const listBySchemaString = parsedString.schema
    ? await schema.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
        schema_contains: parsedString.schema,
      })
    : [];

  const listByContext = parsedString.urls
    ? (
        await Promise.all(
          parsedString.urls.map((url) =>
            schema.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, { context_contains: url }),
          ),
        )
      ).flat()
    : [];

  const results = [
    ...(listByIds || []),
    ...(listBySchemaString || []),
    ...(listByName || []),
    ...(listByDescription || []),
    ...(listByContext || []),
  ];

  return aggregateByNetwork(results, "id");
};

import { ModuleDataMapper } from "@verax-attestation-registry/verax-sdk";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { NetworkType } from "@/contexts/NetworkContext.ts";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined, mainnets, testnets } from "@/utils";
import { uniqMap } from "@/utils/searchUtils";

export const loadModuleList = async (
  module: ModuleDataMapper,
  parsedString: Partial<ResultParseSearch>,
  networkType: NetworkType,
) => {
  const chainsToSearch = networkType === "mainnet" ? mainnets : testnets;

  const [listByName, listByDescription] = parsedString.nameOrDescription
    ? await Promise.all([
        module.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          name_contains_nocase: parsedString.nameOrDescription,
        }),
        module.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          description_contains_nocase: parsedString.nameOrDescription,
        }),
      ])
    : [];

  const listByIds = (
    parsedString.address ? await Promise.all(parsedString.address.map((id) => module.findOneById(id))) : []
  ).filter(isNotNullOrUndefined);

  const results = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

  return uniqMap(results, "id");
};

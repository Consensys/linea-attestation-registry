import PortalDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/PortalDataMapper";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { NetworkType } from "@/contexts/NetworkContext.ts";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined, mainnets, testnets } from "@/utils";
import { uniqMap } from "@/utils/searchUtils.ts";

export const loadPortalList = async (
  portal: PortalDataMapper,
  parsedString: Partial<ResultParseSearch>,
  networkType: NetworkType,
) => {
  const chainsToSearch = networkType === "mainnet" ? mainnets : testnets;

  const [listByName, listByDescription] = parsedString.nameOrDescription
    ? await Promise.all([
        portal.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          name_contains_nocase: parsedString.nameOrDescription,
        }),
        portal.findByMultiChain(chainsToSearch, ITEMS_PER_PAGE_DEFAULT, undefined, {
          description_contains_nocase: parsedString.nameOrDescription,
        }),
      ])
    : [];

  const listByIds = (
    parsedString.address ? await Promise.all(parsedString.address.map((id) => portal.findOneById(id))) : []
  ).filter(isNotNullOrUndefined);

  const results = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

  return uniqMap(results, "id");
};

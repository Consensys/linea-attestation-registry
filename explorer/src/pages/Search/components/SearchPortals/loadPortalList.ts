import PortalDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/PortalDataMapper";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined } from "@/utils";

export const loadPortalList = async (portal: PortalDataMapper, parsedString: Partial<ResultParseSearch>) => {
  const [listByName, listByDescription] = parsedString.nameOrDescription
    ? await Promise.all([
        portal.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
          name_contains_nocase: parsedString.nameOrDescription,
        }),
        portal.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
          description_contains_nocase: parsedString.nameOrDescription,
        }),
      ])
    : [];

  const listByIds = (
    parsedString.address ? await Promise.all(parsedString.address.map((id) => portal.findOneById(id))) : []
  ).filter(isNotNullOrUndefined);

  const result = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

  return result;
};

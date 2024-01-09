import ModuleDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/ModuleDataMapper";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined } from "@/utils";

export const loadModuleList = async (module: ModuleDataMapper, parsedString: Partial<ResultParseSearch>) => {
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

  const listByIds = (
    parsedString.address ? await Promise.all(parsedString.address.map((id) => module.findOneById(id))) : []
  ).filter(isNotNullOrUndefined);

  const results = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

  const uniqueResults = [...new Map(results.map((result) => [result.id, result])).values()];

  return uniqueResults;
};

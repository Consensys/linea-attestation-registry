import ModuleDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/ModuleDataMapper";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { ResultParseSearch } from "@/interfaces/components";

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

  const [listByIds] = parsedString.address
    ? await Promise.all(parsedString.address.map((id) => module.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { id })))
    : [];

  const result = [...(listByIds || []), ...(listByName || []), ...(listByDescription || [])];

  return result;
};

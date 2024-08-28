import AttestationDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/AttestationDataMapper";

import { ITEMS_SEARCHED_DEFAULT } from "@/constants";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined } from "@/utils";
import { uniqMap } from "@/utils/searchUtils";

export const loadAttestationReceivedList = async (
  attestation: AttestationDataMapper,
  parsedString: Partial<ResultParseSearch>,
) => {
  const [listBySubject] = parsedString.address
    ? await Promise.all(
        parsedString.address.map(async (address) => {
          return attestation.findBy(ITEMS_SEARCHED_DEFAULT, undefined, {
            subject: address,
          });
        }),
      )
    : [];

  const listByIds = (
    parsedString.attestationIds
      ? await Promise.all(parsedString.attestationIds.map((id) => attestation.findOneById(id)))
      : []
  ).filter(isNotNullOrUndefined);

  const listBySchemaString = parsedString.schemaString
    ? await attestation.findBy(ITEMS_SEARCHED_DEFAULT, undefined, { schema: parsedString.schemaString })
    : [];

  const results = [...(listByIds || []), ...(listBySubject || []), ...(listBySchemaString || [])];

  return uniqMap(results, "id");
};

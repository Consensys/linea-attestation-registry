import AttestationDataMapper from "@verax-attestation-registry/verax-sdk/lib/types/src/dataMapper/AttestationDataMapper";

import { ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { ResultParseSearch } from "@/interfaces/components";
import { isNotNullOrUndefined } from "@/utils";
import { uniqMap } from "@/utils/searchUtils";

export const loadAttestationList = async (
  attestation: AttestationDataMapper,
  parsedString: Partial<ResultParseSearch>,
) => {
  const [listByAddress] = parsedString.address
    ? await Promise.all(
        parsedString.address.map(async (address) => {
          const attestationResults = attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
            attester_contains: address,
          });
          const subjectResults = attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, {
            subject_contains: address,
          });
          return Promise.all([attestationResults, subjectResults]);
        }),
      )
    : [];

  const listByIds = (
    parsedString.attestationIds
      ? await Promise.all(parsedString.attestationIds.map((id) => attestation.findOneById(id)))
      : []
  ).filter(isNotNullOrUndefined);

  const listBySchemaString = parsedString.schemaString
    ? await attestation.findBy(ITEMS_PER_PAGE_DEFAULT, undefined, { schemaString: parsedString.schemaString })
    : [];

  const results = [
    ...(listByIds || []),
    ...(listByAddress?.[0] || []),
    ...(listByAddress?.[1] || []),
    ...(listBySchemaString || []),
  ];

  return uniqMap(results, "id");
};

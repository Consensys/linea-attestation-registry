import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { AttestationCard } from "../Attestation/components/AttestationCard";

export const Subject: React.FC = () => {
  const { subject } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();
  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${subject}/${sortByDateDirection}/${chain.id}`,
    () =>
      sdk.attestation.findBy(
        undefined,
        undefined,
        { subject },
        "attestedDate",
        (sortByDateDirection as OrderDirection) || "desc",
      ),
  );

  return (
    <div className="flex flex-col gap-14 md:gap-[4.5rem] container mt-14 md:mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {attestationsList &&
          attestationsList.map((attestation) => {
            return (
              <AttestationCard
                key={attestation.id}
                id={attestation.id}
                schemaId={attestation.schema.id}
                portalId={attestation.portal.id}
                issuanceDate={attestation.attestedDate}
                expiryDate={attestation.expirationDate}
              />
            );
          })}
      </div>
    </div>
  );
};

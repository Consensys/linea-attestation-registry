import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { EQueryParams } from "@/enums/queryParams";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { CardView } from "../Attestations/components/CardView";

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

  return attestationsList && <CardView attestationsList={attestationsList}></CardView>;
};

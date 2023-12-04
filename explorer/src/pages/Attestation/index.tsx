import useSWR from "swr";
import { useParams } from "react-router-dom";
import { Attestation as AttestationProps } from "@verax-attestation-registry/verax-sdk";

import { NetworkContext } from "@/providers/network-provider";
import { SWRKeys } from "@/interfaces/swr/enum";
import { EMPTY_STRING } from "@/constants";

import { AttestationInfo } from "./AttestationInfo";
import { AttestationSchemaCard } from "./AttestationSchemaCard";
import { AttestationData } from "./AttestationData";
import { RelatedAttestations } from "./RelatedAttestations";
import { NotFoundAttestation } from "./NotFoundAttestation";
import { useContext } from "react";

export const Attestation = () => {
  const { id } = useParams();
  const { sdk } = useContext(NetworkContext);

  const {
    data: attestation,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    SWRKeys.GET_ATTESTATION_BY_ID,
    () => sdk.attestation.findOneById(id || EMPTY_STRING) as Promise<AttestationProps>,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  //todo add loading
  if (isLoading || isValidating) return <p>Loading...</p>;
  if (!attestation) return <NotFoundAttestation id={id || EMPTY_STRING} />;
  return (
    <div className="flex flex-col my-6 md:mt-8 md:mb-20 md:border md:rounded-3xl max-w-7xl md:border-border-card md:mx-10 xl:flex-row xl:mx-auto">
      <div className="p-6 md:border-b md:border-border-card xl:border-b-0 xl:border-e">
        <AttestationInfo {...attestation} />
      </div>
      <div className="flex flex-col p-6 gap-12 w-full">
        <AttestationSchemaCard schemaId={attestation.schemaId} />
        <AttestationData {...attestation} />
        <RelatedAttestations mutate={mutate} />
      </div>
    </div>
  );
};

import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { AttestationData } from "./components/AttestationData";
import { AttestationInfo } from "./components/AttestationInfo";
import { AttestationLoadingSkeleton } from "./components/AttestationLoadingSkeleton";
import { AttestationSchemaCard } from "./components/AttestationSchemaCard";

export const Attestation = () => {
  const { id } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const {
    data: attestation,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_ATTESTATION_BY_ID}/${id}/${chain.id}`,
    async () => {
      if (id && !Number.isNaN(Number(id))) return sdk.attestation.findOneById(id);
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <AttestationLoadingSkeleton />;
  if (!attestation) return <NotFoundPage id={id} page="attestation" />;

  return (
    <div className="flex flex-col md:gap-4 max-w-[1200px] my-6 md:mt-2 md:mb-20 md:mx-10 xl:mx-auto">
      <Back className="ps-5 md:ps-0" />
      <div className="flex flex-col md:border md:rounded-3xl md:border-border-card md:dark:border-border-cardDark xl:flex-row">
        <div className="p-6 md:border-b md:border-border-card md:dark:border-border-cardDark xl:w-full xl:max-w-[440px] xl:border-b-0 xl:border-e">
          <AttestationInfo {...attestation} />
        </div>
        <div className="flex flex-col p-6 gap-12 w-full">
          <AttestationSchemaCard schemaId={attestation.schemaId} />
          <AttestationData {...attestation} />
          {/* TODO: uncomment when correct data will be available */}
          {/* <RelatedAttestations mutate={mutate} /> */}
        </div>
      </div>
    </div>
  );
};

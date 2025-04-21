import { memo, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { AttestationData } from "./components/AttestationData";
import { AttestationInfo } from "./components/AttestationInfo";
import { AttestationLoadingSkeleton } from "./components/AttestationLoadingSkeleton";
import { AttestationSchemaCard } from "./components/AttestationSchemaCard";

const MemoizedBack = memo(Back);
const MemoizedAttestationInfo = memo(AttestationInfo);
const MemoizedAttestationSchemaCard = memo(AttestationSchemaCard);
const MemoizedAttestationData = memo(AttestationData);
const MemoizedNotFoundPage = memo(NotFoundPage);
const MemoizedAttestationLoadingSkeleton = memo(AttestationLoadingSkeleton);

export const Attestation = memo(() => {
  const { id } = useParams();
  const { getSDKForAttestationId } = useNetworkContext();
  const { networkType } = useNetwork();

  const fetchAttestation = useCallback(async () => {
    if (!id) return null;

    const attestationSdk = getSDKForAttestationId(id, networkType);

    if (attestationSdk) {
      return attestationSdk.attestation.findOneById(id);
    }

    return null;
  }, [getSDKForAttestationId, id, networkType]);

  const {
    data: attestation,
    isLoading,
    isValidating,
  } = useSWR(`${SWRKeys.GET_ATTESTATION_BY_ID}/${id}`, fetchAttestation, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return useMemo(() => {
    if (isLoading || isValidating) return <MemoizedAttestationLoadingSkeleton />;
    if (!attestation) return <MemoizedNotFoundPage id={id} page="attestation" />;

    return (
      <div className="flex flex-col md:gap-4 max-w-[1200px] my-6 md:mt-2 md:mb-20 md:mx-10 xl:mx-auto">
        <MemoizedBack className="ps-5 md:ps-0" />
        <div className="flex flex-col md:border md:rounded-3xl md:border-border-card md:dark:border-border-cardDark xl:flex-row">
          <div className="p-6 md:border-b md:border-border-card md:dark:border-border-cardDark xl:w-full xl:max-w-[440px] xl:border-b-0 xl:border-e">
            <MemoizedAttestationInfo {...attestation} />
          </div>
          <div className="flex flex-col p-6 gap-12 w-full">
            <MemoizedAttestationSchemaCard schema={attestation.schema} />
            <MemoizedAttestationData {...attestation} />
          </div>
        </div>
      </div>
    );
  }, [attestation, id, isLoading, isValidating]);
});

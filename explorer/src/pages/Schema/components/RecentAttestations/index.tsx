import { t } from "i18next";
import { useRef } from "react";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const RecentAttestations: React.FC<{ schemaId: string }> = ({ schemaId }) => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: attestations, isLoading } = useSWR(
    `${SWRKeys.GET_RECENT_ATTESTATION}/${schemaId}/${chain.id}`,
    () => sdk.attestation.findBy(undefined, undefined, { schemaId }),
    {
      shouldRetryOnError: false,
    },
  );

  const columnsSkeletonRef = useRef(columnsSkeleton(columns({ sortByDate: false }), attestationColumnsOption));
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonAttestations(5) }
    : {
        columns: columns({ sortByDate: false, sdk, chainId: chain.id }),
        list: attestations?.slice(-5).reverse() || [],
      };

  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p className="text-xl not-italic font-semibold text-text-primary dark:text-whiteDefault">
        {t("attestation.recent")}
      </p>
      <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.ATTESTATION_BY_ID} />
    </div>
  );
};

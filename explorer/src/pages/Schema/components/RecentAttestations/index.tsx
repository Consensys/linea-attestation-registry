import { t } from "i18next";
import { useRef } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

import { DataTable } from "@/components/DataTable";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { useNetworkTypeSWR } from "@/hooks/useNetworkTypeSWR";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { mainnets, testnets } from "@/utils";

export const RecentAttestations: React.FC<{ schemaId?: string; portalId?: string }> = ({ schemaId, portalId }) => {
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const { isDarkMode } = useTernaryDarkMode();

  const chainsForQuery = networkType === "mainnet" ? mainnets : testnets;

  const fetchKey = schemaId
    ? `${SWRKeys.GET_RECENT_ATTESTATION_SCHEMA}/${chainsForQuery.join(",")}/${schemaId}`
    : portalId
      ? `${SWRKeys.GET_RECENT_ATTESTATION_PORTAL}/${chainsForQuery.join(",")}/${portalId}`
      : `${SWRKeys.GET_RECENT_ATTESTATION_GLOBAL}/${chainsForQuery.join(",")}`;

  const fetchFunction = schemaId
    ? () => sdk.attestation.findByMultiChain(chainsForQuery, 5, 0, { schema: schemaId }, "attestedDate", "desc")
    : portalId
      ? () => sdk.attestation.findByMultiChain(chainsForQuery, 5, 0, { portal: portalId }, "attestedDate", "desc")
      : () => sdk.attestation.findByMultiChain(chainsForQuery, 5, 0, {}, "attestedDate", "desc");

  const { data: attestations, isLoading } = useNetworkTypeSWR(fetchKey, fetchFunction, {
    shouldRetryOnError: false,
  });

  const columnsSkeletonRef = useRef(
    columnsSkeleton(
      columns({
        isDarkMode,
        sortByDate: false,
        networkType,
      }),
      attestationColumnsOption,
    ),
  );
  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonAttestations(5) }
    : {
        columns: columns({ isDarkMode, sortByDate: false, networkType }),
        list: attestations || [],
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

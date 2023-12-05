import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/constants/columns/attestation";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

export const RecentAttestations: React.FC<{ schemaId: string }> = ({ schemaId }) => {
  const { sdk } = useNetworkContext();

  const { data: attestations, isLoading } = useSWR(
    SWRKeys.GET_RECENT_ATTESTATION,
    () => sdk.attestation.findBy(undefined, undefined, { schemaId }),
    {
      shouldRetryOnError: false,
    },
  );
  return (
    <div className="flex flex-col gap-6 w-full px-5 md:px-10">
      <p>Recent attestations</p>
      {/* todo add loading */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns({ sortByDate: false })} data={attestations?.slice(-5).reverse() || []} />
      )}
    </div>
  );
};

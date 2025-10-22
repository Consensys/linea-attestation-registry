import useSWR, { Key, SWRConfiguration, SWRResponse } from "swr";

import { useNetwork } from "@/contexts/NetworkContext";

export function useNetworkTypeSWR<Data = unknown, Error = unknown>(
  key: Key,
  fetcher: null | ((...args: unknown[]) => Promise<Data> | Data) = null,
  config?: SWRConfiguration<Data, Error>,
): SWRResponse<Data, Error> {
  const { networkType } = useNetwork();

  const fullKey = key ? `${key}_${networkType}` : null;

  return useSWR<Data, Error>(fullKey, fetcher, config);
}

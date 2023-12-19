import { Portal, Schema } from "@verax-attestation-registry/verax-sdk";
import useSWR from "swr";

import { Link } from "@/components/Link";
import { EMPTY_STRING } from "@/constants";

export const SWRCell: React.FC<{ swrKey: string; fetcher: () => Promise<Schema | Portal | undefined>; to: string }> = ({
  swrKey,
  fetcher,
  to,
}) => {
  const { data } = useSWR(swrKey, fetcher);

  return (
    <Link className="hover:underline hover:text-text-quaternary transition" to={to}>
      {data?.name || EMPTY_STRING}
    </Link>
  );
};

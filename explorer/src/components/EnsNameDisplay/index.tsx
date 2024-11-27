import { Address } from "viem";
import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

import { cropString } from "@/utils/stringUtils";

export const EnsNameDisplay: React.FC<{ address: Address; showFullAddress?: boolean }> = ({
  address,
  showFullAddress = false,
}) => {
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  return <span>{ensName || (showFullAddress ? address : cropString(address))}</span>;
};

import { Address } from "viem";
import { mainnet, useEnsName } from "wagmi";

export const EnsNameDisplay: React.FC<{ address: Address }> = ({ address }) => {
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id });
  return <span>{ensName || address}</span>;
};

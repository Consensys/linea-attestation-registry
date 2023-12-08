import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { ConnectKitButton } from "connectkit";
import { ArchiveIcon, Check, Copy, Wallet } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useSWR from "swr";
import { useAccount } from "wagmi";

import { ButtonOutlined } from "@/components/Buttons";
import { DataTable } from "@/components/DataTable";
import { InfoBlock } from "@/components/InfoBlock";
import { THOUSAND } from "@/constants";
import { columns } from "@/constants/columns/attestation";
import { EQueryParams } from "@/enums/queryParams";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { cropString } from "@/utils/stringUtils";

import { TitleAndSwitcher } from "../Attestations/components/TitleAndSwitcher";

export const MyAttestations: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();
  const { address } = useAccount();
  const { sm } = useWindowDimensions();

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string, result: boolean) => {
    if (!result || !text) return;
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, THOUSAND);
  };

  const CopyIcon = copied ? Check : Copy;

  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${address}/${sortByDateDirection}/${chain.id}`,
    () =>
      sdk.attestation.findBy(
        undefined,
        undefined,
        { attester: address },
        "attestedDate",
        sortByDateDirection as OrderDirection,
      ),
  );

  return (
    <TitleAndSwitcher>
      {address && (
        <div className="flex items-center text-text-secondary text-base font-medium gap-3 mb-6">
          <Wallet />
          <div>{sm ? cropString(address) : address}</div>
          <CopyToClipboard onCopy={handleCopy} text={address}>
            <CopyIcon className="cursor-pointer hover:opacity-60" color={copied ? "#1a9d37" : "#64687D"} />
          </CopyToClipboard>
        </div>
      )}
      {/* TODO: add skeleton for table */}
      {!address && (
        <InfoBlock
          icon={<ArchiveIcon />}
          message="Connect wallet to see your attestations"
          buttonComponent={
            <ConnectKitButton.Custom>
              {({ show }) => {
                if (!show) return <></>;
                return <ButtonOutlined name="Connect Wallet" handler={show} />;
              }}
            </ConnectKitButton.Custom>
          }
        />
      )}

      {address && !attestationsList?.length && (
        <InfoBlock icon={<ArchiveIcon />} message="You don’t have any attestations yet" />
      )}

      {address && <DataTable columns={columns()} data={attestationsList || []} />}
    </TitleAndSwitcher>
  );
};

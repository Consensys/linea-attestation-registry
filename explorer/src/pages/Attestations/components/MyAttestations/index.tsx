import { ConnectKitButton } from "connectkit";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import ArchiveIcon from "@/assets/icons/archive.svg";
import { ButtonOutlined } from "@/components/Buttons";
import { InfoBlock } from "@/components/InfoBlock";
import { EQueryParams } from "@/enums/queryParams";

import { IMyAttestations } from "./interface";
import { columns } from "../../table/columns";
import { DataTable } from "../../table/dataTable";

export const MyAttestations: React.FC<IMyAttestations> = ({ attestationsList }) => {
  const { address } = useAccount();
  const [searchParams] = useSearchParams();

  const isMyAttestations = searchParams.get(EQueryParams.SHOW_MY_ATTESTATIONS);

  if (!address && isMyAttestations)
    return (
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
    );

  if (address && isMyAttestations && !attestationsList?.length)
    return <InfoBlock icon={<ArchiveIcon />} message="You don’t have any attestations yet" />;

  return <>{address && isMyAttestations && <DataTable columns={columns} data={attestationsList || []} />}</>;
};

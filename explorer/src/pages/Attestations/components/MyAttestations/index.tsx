import { ConnectKitButton } from "connectkit";
import { useSearchParams } from "react-router-dom";

import ArchiveIcon from "@/assets/icons/archive.svg";
import { ButtonOutlined } from "@/components/Buttons";
import { InfoBlock } from "@/components/InfoBlock";
import { EQueryParams } from "@/enums/queryParams";

import { IMyAttestations } from "./interface";
import { columns } from "../../table/columns";
import { DataTable } from "../../table/dataTable";

export const MyAttestations: React.FC<IMyAttestations> = ({ showMyAttestations, attestationsList }) => {
  const [searchParams] = useSearchParams();

  const attester = searchParams.get(EQueryParams.ATTESTER);

  if (showMyAttestations && !attester)
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

  if (showMyAttestations && attester && !attestationsList?.length)
    return <InfoBlock icon={<ArchiveIcon />} message="You don’t have any attestations yet" />;

  return <>{showMyAttestations && attester && <DataTable columns={columns} data={attestationsList || []} />}</>;
};

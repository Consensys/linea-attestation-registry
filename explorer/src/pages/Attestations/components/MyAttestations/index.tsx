import { useSearchParams } from "react-router-dom";

import { EQueryParams } from "@/enums/queryParams";

import { IMyAttestations } from "./interface";
import { columns } from "../../table/columns";
import { DataTable } from "../../table/dataTable";

export const MyAttestations: React.FC<IMyAttestations> = ({ showMyAttestations, attestationsList }) => {
  const [searchParams] = useSearchParams();
  console.log("aL", attestationsList);

  const attester = searchParams.get(EQueryParams.ATTESTER);

  if (showMyAttestations && !attester) return <div>Connect Wallet</div>;
  if (showMyAttestations && attester && !attestationsList?.length) return <div>List Empty</div>;

  return (
    <>{attestationsList && showMyAttestations && attester && <DataTable columns={columns} data={attestationsList} />}</>
  );
};

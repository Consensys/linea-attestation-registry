import { useNavigate } from "react-router-dom";

import IssuerIcon from "@/assets/icons/issuer.svg?react";
import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE, toIssuerById } from "@/routes/constants";

import { IIssuerProps } from "./interface";

export const Issuer: React.FC<IIssuerProps> = ({ issuer }) => {
  const navigate = useNavigate();
  const {
    network: { network },
  } = useNetworkContext();

  return (
    <div
      key={issuer.name}
      className="group flex flex-col gap-4 border border-border-card rounded-xl p-4 md:p-6 cursor-pointer hover:bg-surface-secondary"
      onClick={() => navigate(toIssuerById(issuer.id).replace(CHAIN_ID_ROUTE, network))}
    >
      <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-blackDefault">
        {/* TODO: logo should be dynamic */}
        <IssuerIcon className="w-auto h-[2.5rem] md:h-[3rem]" />
        {issuer.name}
      </div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-2">
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
      </div> */}
      <div className="text-sm font-normal text-text-darkGrey">{issuer.description}</div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-xl md:text-2xl font-semibold">24k</div>
          <div className="text-xs font-normal text-text-darkGrey">Attestations</div>
        </div>
        <div>
          <div className="text-xl md:text-2xl font-semibold">13</div>
          <div className="text-xs font-normal text-text-darkGrey">Schemas</div>
        </div>
      </div> */}
    </div>
  );
};

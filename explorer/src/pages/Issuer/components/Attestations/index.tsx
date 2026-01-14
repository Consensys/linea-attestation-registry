import { Loader } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { IAttestationProps } from "./interface";

import { useNetwork } from "@/contexts/NetworkContext";
import { useNetworkTypeSWR } from "@/hooks/useNetworkTypeSWR";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { mainnets, testnets } from "@/utils";
import { formatNumber } from "@/utils/amountUtils";

import "./styles.css";

export const Attestations: React.FC<IAttestationProps> = ({ address }) => {
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const chainsForQuery = networkType === "mainnet" ? mainnets : testnets;

  const { data: portals, isLoading } = useNetworkTypeSWR(
    `${SWRKeys.GET_PORTALS_BY_ISSUER}/${address}/${chainsForQuery.join(",")}`,
    () => sdk.portal.findByMultiChain(chainsForQuery, undefined, undefined, { ownerAddress: address }),
  );

  const attestationCounter = portals ? portals.reduce((total, portal) => total + portal.attestationCounter, 0) : 0;

  const handleAttestationCounterClick = () => {
    const whereClauseJSON = {
      portal_in: portals?.map((portal) => portal.id),
    };
    const whereClause = `?where=${encodeURIComponent(JSON.stringify(whereClauseJSON))}`;
    navigate(APP_ROUTES.ATTESTATIONS + whereClause, {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 text-base md:text-[2rem] dark:text-whiteDefault">
      <div className="flex flex-row items-center gap-6">
        Attestations
        <div
          className="flex flex-row justify-center items-center w-[109px] h-[55px] dark:bg-[#252534] bg-[#D9D9D9] rounded-[19px] font-normal text-[20px] flex-grow-0"
          onClick={handleAttestationCounterClick}
          style={{ cursor: "pointer" }}
        >
          {isLoading ? <Loader className={"spinning-icon"} /> : formatNumber(attestationCounter)}
        </div>
      </div>
    </div>
  );
};

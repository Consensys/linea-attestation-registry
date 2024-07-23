import { Loader } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES, CHAIN_ID_ROUTE } from "@/routes/constants";
import { formatNumber } from "@/utils/amountUtils";

import { IAttestationProps } from "./interface";

export const Attestations: React.FC<IAttestationProps> = ({ address }) => {
  const {
    sdk,
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: portals, isLoading } = useSWR(`${SWRKeys.GET_PORTALS_BY_ISSUER}/${address}`, () =>
    sdk.portal.findBy(undefined, undefined, { ownerAddress: address }),
  );

  const attestationCounter = portals ? portals.reduce((total, portal) => total + portal.attestationCounter, 0) : 0;

  const handleAttestationCounterClick = () => {
    const whereClauseJSON = {
      portal_in: portals?.map((portal) => portal.id),
    };
    const whereClause = `?where=${encodeURIComponent(JSON.stringify(whereClauseJSON))}`;
    navigate(APP_ROUTES.ATTESTATIONS.replace(CHAIN_ID_ROUTE, network) + whereClause, {
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
          {isLoading ? <Loader /> : formatNumber(attestationCounter)}
        </div>
      </div>
    </div>
  );
};

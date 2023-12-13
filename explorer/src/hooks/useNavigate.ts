import { NavigateOptions, To, useLocation, useNavigate as useNavigateRouter } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE } from "@/routes/constants";

export const useNavigate = () => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigateRouter();
  const { pathname } = useLocation();
  return (to: To, options?: NavigateOptions) => {
    navigate(to.toString().replace(CHAIN_ID_ROUTE, network), { state: { from: pathname }, ...options });
  };
};

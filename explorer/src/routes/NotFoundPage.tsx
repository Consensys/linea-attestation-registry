import { Navigate } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";

import { APP_ROUTES, CHAIN_ID_ROUTE } from "./constants";

export const NotFoundPage = () => {
  const {
    network: { network },
  } = useNetworkContext();
  return <Navigate replace to={APP_ROUTES.HOME.replace(CHAIN_ID_ROUTE, network)} />;
};

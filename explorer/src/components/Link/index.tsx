import { PropsWithChildren } from "react";
import { LinkProps, Link as RouterLink } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE } from "@/routes/constants";

export const Link: React.FC<PropsWithChildren & LinkProps> = ({ children, ...props }) => {
  const {
    network: { network },
  } = useNetworkContext();
  return (
    <RouterLink {...props} to={props.to.toString().replace(CHAIN_ID_ROUTE, network)}>
      {children}
    </RouterLink>
  );
};

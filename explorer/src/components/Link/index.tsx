import { PropsWithChildren } from "react";
import { LinkProps, Link as RouterLink, generatePath, useLocation } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";

export const Link: React.FC<PropsWithChildren & LinkProps> = ({ children, ...props }) => {
  const {
    network: { network },
  } = useNetworkContext();
  const { pathname } = useLocation();
  const path = generatePath(props.to.toString(), { chainId: network });
  return (
    <RouterLink {...props} to={path} state={{ from: pathname }}>
      {children}
    </RouterLink>
  );
};

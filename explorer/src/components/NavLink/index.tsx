import { PropsWithChildren } from "react";
import { NavLinkProps, NavLink as RouterNavLink, generatePath, useLocation } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";

export const NavLink: React.FC<PropsWithChildren & NavLinkProps> = ({ children, ...props }) => {
  const {
    network: { network },
  } = useNetworkContext();
  const { pathname } = useLocation();
  const path = generatePath(props.to.toString(), { chainId: network });
  return (
    <RouterNavLink {...props} to={path} state={{ from: pathname }}>
      {children}
    </RouterNavLink>
  );
};

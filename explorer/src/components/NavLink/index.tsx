import { PropsWithChildren } from "react";
import { NavLinkProps, NavLink as RouterNavLink, useLocation } from "react-router-dom";

import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE } from "@/routes/constants";

export const NavLink: React.FC<PropsWithChildren & NavLinkProps> = ({ children, ...props }) => {
  const {
    network: { network },
  } = useNetworkContext();
  const { pathname } = useLocation();
  return (
    <RouterNavLink {...props} to={props.to.toString().replace(CHAIN_ID_ROUTE, network)} state={{ from: pathname }}>
      {children}
    </RouterNavLink>
  );
};

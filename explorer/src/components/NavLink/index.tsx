import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE } from "@/routes/constants";
import { PropsWithChildren } from "react";
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";

export const NavLink: React.FC<PropsWithChildren & NavLinkProps> = ({ children, ...props }) => {
  const {
    network: { network },
  } = useNetworkContext();
  return (
    <RouterNavLink {...props} to={props.to.toString().replace(CHAIN_ID_ROUTE, network)}>
      {children}
    </RouterNavLink>
  );
};

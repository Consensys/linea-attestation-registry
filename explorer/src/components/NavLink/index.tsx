import { PropsWithChildren } from "react";
import { NavLinkProps, NavLink as RouterNavLink, generatePath, useLocation } from "react-router-dom";

export const NavLink: React.FC<PropsWithChildren & NavLinkProps> = ({ children, ...props }) => {
  const { pathname } = useLocation();
  const path = generatePath(props.to.toString());
  return (
    <RouterNavLink {...props} to={path} state={{ from: pathname }}>
      {children}
    </RouterNavLink>
  );
};

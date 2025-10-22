import { PropsWithChildren } from "react";
import { LinkProps, Link as RouterLink, generatePath, useLocation } from "react-router-dom";

export const Link: React.FC<PropsWithChildren & LinkProps> = ({ children, ...props }) => {
  const { pathname } = useLocation();
  const path = generatePath(props.to.toString());
  return (
    <RouterLink {...props} to={path} state={{ from: pathname }}>
      {children}
    </RouterLink>
  );
};

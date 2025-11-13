import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Redirects legacy /linea/* URLs to /* by stripping the /linea prefix
 * Example: /linea/subject/0xabc... -> /subject/0xabc...
 */
export const LineaRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const newPath = currentPath.replace(/^\/linea/, "");
    const fullPath = `${newPath}${location.search}${location.hash}`;
    navigate(fullPath, { replace: true });
  }, [navigate, location]);

  return null;
};


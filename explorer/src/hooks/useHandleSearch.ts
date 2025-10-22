import { createSearchParams, generatePath, useLocation, useNavigate } from "react-router-dom";

import { EQueryParams } from "@/enums/queryParams";
import { APP_ROUTES } from "@/routes/constants";

export const useHandleSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (search: string) => {
    if (!search) return;
    const pathname = generatePath(APP_ROUTES.SEARCH);
    navigate(
      {
        pathname,
        search: `?${createSearchParams({ [EQueryParams.SEARCH_QUERY]: search })}`,
      },
      {
        state: { from: location.pathname },
      },
    );
  };
};

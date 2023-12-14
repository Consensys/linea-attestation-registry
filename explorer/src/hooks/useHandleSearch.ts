import { createSearchParams, generatePath, useNavigate } from "react-router-dom";

import { EQueryParams } from "@/enums/queryParams";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const useHandleSearch = () => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  return (search: string) => {
    if (!search) return;
    const pathname = generatePath(APP_ROUTES.SEARCH, { chainId: network });
    navigate({
      pathname,
      search: `?${createSearchParams({ [EQueryParams.SEARCH_QUERY]: search })}`,
    });
  };
};

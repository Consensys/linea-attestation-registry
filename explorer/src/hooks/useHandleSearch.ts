import { generatePath, useNavigate, useSearchParams } from "react-router-dom";

import { EQueryParams } from "@/enums/queryParams";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

export const useHandleSearch = () => {
  const {
    network: { network },
  } = useNetworkContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  return (search: string) => {
    if (!search) return;
    searchParams.set(EQueryParams.SEARCH_QUERY, search);
    const pathname = generatePath(APP_ROUTES.SEARCH, { chainId: network });
    navigate({ pathname, search: `?${searchParams.toString()}` });
  };
};

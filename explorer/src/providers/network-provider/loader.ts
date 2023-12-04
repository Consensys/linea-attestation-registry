import { LoaderFunction, LoaderFunctionArgs, generatePath, redirect } from "react-router-dom";

import { chains, defaultChain } from "@/config";

export const loaderNetworkProvider = (({ params }: LoaderFunctionArgs) => {
  const { chainId } = params;

  const foundedNetwork = chains.find((chain) => chain.network === chainId);
  if (!chainId || !foundedNetwork) {
    const path = generatePath("/:chainId/", { chainId: defaultChain.network });
    return redirect(path);
  }
  return foundedNetwork;
}) satisfies LoaderFunction;

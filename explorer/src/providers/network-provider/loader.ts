import { chains, defaultChain } from "@/config";
import { redirect } from "react-router-dom";
import { LoaderFunction, LoaderFunctionArgs, generatePath } from "react-router-dom";

export const loaderNetworkProvider = (({ params }: LoaderFunctionArgs) => {
  const { chainId } = params;

  const foundedNetwork = chains.find((chain) => chain.network === chainId);
  if (!chainId || !foundedNetwork) {
    const path = generatePath("/:chainId/", { chainId: defaultChain.network });
    return redirect(path);
  }
  return foundedNetwork;
}) satisfies LoaderFunction;

import { ArrowUpRight } from "lucide-react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { Tooltip } from "@/components/Tooltip";
import { chains } from "@/config";
import { NETWORK_TOOLTIP_STYLE } from "@/constants/components";
import { regexEthAddress } from "@/constants/regex";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { getBlockExplorerLink } from "@/utils";

import { ModuleLoadingSkeleton } from "./components/ModuleLoadingSkeleton";
import { ModulePortals } from "./components/ModulePortals";

export const Module = () => {
  const { id, network } = useParams();
  const { getSDKForNetwork } = useNetworkContext();
  const { isDarkMode } = useTernaryDarkMode();

  const networkConfig = chains.find((chain) => chain.network === network);

  const {
    data: module,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_SCHEMA_BY_ID}/${id}/${network}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[42].test(id) && networkConfig) {
        const sdk = getSDKForNetwork(networkConfig);
        return sdk.module.findOneById(id);
      }
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <ModuleLoadingSkeleton />;
  if (!module || !networkConfig) return <NotFoundPage page="module" id={id} />;

  const blockExplorerLink = getBlockExplorerLink(networkConfig.chain);

  // Get network logo
  const networkLogo = isDarkMode && networkConfig.imgDark ? networkConfig.imgDark : networkConfig.img;

  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back />
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <p className="text-page-module dark:text-page-moduleDark text-2xl not-italic font-semibold md:text-[2rem] mr-3">
              {module.name}
            </p>
            {networkConfig && networkLogo && (
              <Tooltip
                content={<div style={NETWORK_TOOLTIP_STYLE}>{networkConfig.name}</div>}
                placement="top"
                isDarkMode={isDarkMode}
                minWidth="auto"
                compact
              >
                <div className="w-[24px]">{networkLogo}</div>
              </Tooltip>
            )}
          </div>
          <p className="text-text-quaternary text-base not-italic">{module.description}</p>
        </div>
        <hr className="border-border-card dark:border-border-cardDark" />
      </div>
      <div className="flex flex-col gap-2 px-5 md:px-10">
        <p className="text-xs text-text-quaternary not-italic font-normal">CONTEXT</p>
        <a
          href={`${blockExplorerLink}/${module.moduleAddress}`}
          target="_blank"
          className="cursor-pointer hover:underline break-all sm:w-fit dark:text-text-secondaryDark flex items-center gap-2"
        >
          <span className="flex-1">{module.moduleAddress}</span>
          <ArrowUpRight height="auto" width="1rem" />
        </a>
      </div>
      <ModulePortals moduleId={module.moduleAddress} network={network} />
    </section>
  );
};

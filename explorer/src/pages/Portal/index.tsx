import { t } from "i18next";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";
import { Address } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";

import { PortalLoadingSkeleton } from "./components/PortalLoadingSkeleton";
import { PortalModules } from "./components/PortalModules";
import { RecentAttestations } from "../Schema/components/RecentAttestations";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { Tooltip } from "@/components/Tooltip";
import { chains } from "@/config";
import { EMPTY_STRING } from "@/constants";
import { NETWORK_TOOLTIP_STYLE } from "@/constants/components";
import { regexEthAddress } from "@/constants/regex";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { getBlockExplorerLink } from "@/utils";

export const Portal = () => {
  const { id, network } = useParams();
  const { getSDKForNetwork } = useNetworkContext();
  const { isDarkMode } = useTernaryDarkMode();

  const networkConfig = chains.find((chain) => chain.network === network);

  const {
    data: portal,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_PORTAL_BY_ID}/${id}/${network}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[42].test(id) && networkConfig) {
        const sdk = getSDKForNetwork(networkConfig);
        return sdk.portal.findOneById(id || EMPTY_STRING);
      }
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const { data: portalOwnerEnsAddress } = useEnsName({
    address: portal?.ownerAddress as Address,
    chainId: mainnet.id,
    query: { enabled: !isLoading },
  });

  const displayPortalOwnerEnsAddress = useCallback(() => {
    if (portalOwnerEnsAddress) {
      return portalOwnerEnsAddress;
    }

    return portal?.ownerAddress;
  }, [portalOwnerEnsAddress, portal?.ownerAddress]);

  if (isLoading || isValidating) return <PortalLoadingSkeleton />;
  if (!portal || !networkConfig) return <NotFoundPage page="portal" id={id} />;

  const blockExplorerLink = getBlockExplorerLink(networkConfig.chain);

  const networkLogo = isDarkMode && networkConfig.imgDark ? networkConfig.imgDark : networkConfig.img;

  const list = [
    {
      title: t("portal.id"),
      subtitle: portal.id,
      link: `${blockExplorerLink}/${portal.id}`,
    },
    {
      title: t("portal.ownerAddress"),
      subtitle: displayPortalOwnerEnsAddress(),
      link: `${blockExplorerLink}/${portal.ownerAddress}`,
    },
    {
      title: t("portal.revokable.title"),
      subtitle: portal.isRevocable ? t("portal.revokable.yes") : t("portal.revokable.no"),
    },
  ];

  return (
    <section className="flex flex-col lg:gap-[4.5rem] gap-[3.5rem] w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col px-5 md:px-10 gap-6">
          <Back />
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <p className="text-page-portal dark:text-page-portalDark text-2xl not-italic font-semibold md:text-[2rem] mr-3">
                {portal.name}
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
            <p className="text-text-quaternary text-base not-italic">{portal.description}</p>
          </div>
          <hr className="border-border-card dark:border-border-cardDark" />
        </div>
        <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
          {list.map(({ title, subtitle, link }) => (
            <div key={title} className="flex flex-col gap-2">
              <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{title}</p>
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  className="break-words dark:text-text-secondaryDark hover:underline flex items-center gap-2"
                  rel="noreferrer"
                >
                  {subtitle}
                  <ArrowUpRight width="1rem" height="auto" />
                </a>
              ) : (
                <p className="break-words dark:text-text-secondaryDark">{subtitle}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <RecentAttestations portalId={portal.id} />
      <PortalModules portalModules={portal.modules} network={network} />
    </section>
  );
};

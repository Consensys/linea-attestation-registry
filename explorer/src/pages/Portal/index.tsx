import { t } from "i18next";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { EMPTY_STRING } from "@/constants";
import { regexEthAddress } from "@/constants/regex";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { PortalLoadingSkeleton } from "./components/PortalLoadingSkeleton";
import { PortalModules } from "./components/PortalModules";

export const Portal = () => {
  const { id } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const {
    data: portal,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_PORTAL_BY_ID}/${id}/${chain.id}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[42].test(id)) return sdk.portal.findOneById(id || EMPTY_STRING);
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <PortalLoadingSkeleton />;
  if (!portal) return <NotFoundPage page="portal" id={id} />;

  const list = [
    {
      title: t("portal.id"),
      subtitle: portal.id,
    },
    {
      title: t("portal.ownerAddress"),
      subtitle: portal.ownerAddress,
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
            <p className="text-page-portal dark:text-page-portalDark text-2xl not-italic font-semibold md:text-[2rem]">
              {portal.name}
            </p>
            <p className="text-text-quaternary text-base not-italic">{portal.description}</p>
          </div>
          <hr className="border-border-card dark:border-border-cardDark" />
        </div>
        <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
          {list.map(({ title, subtitle }) => (
            <div key={title} className="flex flex-col gap-2">
              <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{title}</p>
              <p className="break-words dark:text-text-secondaryDark">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      <PortalModules portalModules={portal.modules} />
    </section>
  );
};

import { t } from "i18next";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { HelperIndicator } from "@/components/HelperIndicator";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE, toPortalById } from "@/routes/constants";

import { IPortalProps } from "./interface";

export const Portals: React.FC<IPortalProps> = ({ address }) => {
  const {
    sdk,
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: portals } = useSWR(`${SWRKeys.GET_PORTALS_BY_ISSUER}/${address}`, () =>
    sdk.portal.findBy(undefined, undefined, { ownerAddress: address }),
  );

  if (!portals) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex items-center text-2xl md:text-[2rem] font-semibold gap-2 dark:text-whiteDefault">
        <HelperIndicator type="portal" sizeClass="w-1 md:w-[0.375rem] h-4 md:h-6" /> {t("issuer.portals.title")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
        {portals.map(({ ownerAddress, description, id, isRevocable, name }) => {
          const additionalInfo = [
            {
              title: t("common.id"),
              value: id,
            },
            {
              title: t("issuer.portals.ownerAddress"),
              value: ownerAddress,
            },
            {
              title: t("common.revocable"),
              value: isRevocable ? t("common.yes") : t("common.no"),
            },
          ];

          return (
            <div
              className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 rounded-xl border border-border-card dark:border-border-cardDark hover:border-border-cardHover dark:hover:border-border-cardHoverDark items-start transition"
              key={id}
            >
              <div className="text-xl md:text-2xl font-semibold dark:text-whiteDefault">{name}</div>
              <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">{description}</div>
              {additionalInfo.map((info) => (
                <div className="flex flex-col gap-1 md:gap-2" key={info.value}>
                  <div className="text-xs font-normal uppercase text-text-quaternary dark:text-tertiary">
                    {info.title}
                  </div>
                  <div className="text-sm font-medium text-darkBlue break-all dark:text-text-secondaryDark">
                    {info.value}
                  </div>
                </div>
              ))}
              <Button
                name={t("common.actions.more")}
                handler={() =>
                  navigate(toPortalById(id).replace(CHAIN_ID_ROUTE, network), { state: { from: location.pathname } })
                }
                buttonType={EButtonType.TRANSPARENT}
                iconRight={<ArrowRight />}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

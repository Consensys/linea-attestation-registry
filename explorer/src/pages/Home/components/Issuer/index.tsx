import { t } from "i18next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { Chips } from "@/components/Chips";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { IIssuerProps } from "./interface";

export const Issuer: React.FC<IIssuerProps> = ({ issuer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();

  const {
    network: { network },
  } = useNetworkContext();
  const IssuerLogo = isDarkMode && issuer.logoDark ? issuer.logoDark : issuer.logo;

  return (
    <div
      key={issuer.name}
      className="group flex flex-col gap-4 border border-border-card dark:border-border-cardDark rounded-xl p-4 md:p-6 hover:bg-surface-secondary dark:hover:bg-surface-secondaryDark transition md:min-h-[27.8125rem]"
    >
      <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-blackDefault dark:text-whiteDefault">
        <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center justify-center">
          <IssuerLogo className="w-full h-auto max-w-[2.5rem] md:max-w-[3rem] max-h-[2.5rem] md:max-h-[3rem]" />
        </div>
        {issuer.name}
      </div>
      <div className="flex flex-wrap gap-2">
        {issuer.keywords.map((keyword) => (
          <Chips
            name={keyword}
            additionalClass="group-hover:bg-surface-primary dark:group-hover:bg-blackDefault"
            key={keyword}
          />
        ))}
      </div>
      <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">{issuer.description}</div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-xl md:text-2xl font-semibold">24k</div>
          <div className="text-xs font-normal text-text-darkGrey">Attestations</div>
        </div>
        <div>
          <div className="text-xl md:text-2xl font-semibold">13</div>
          <div className="text-xs font-normal text-text-darkGrey">Schemas</div>
        </div>
      </div> */}
      <div className="flex flex-1 flex-col lg:flex-row lg:items-end gap-4 justify-end lg:justify-start">
        <Button
          isSmall
          name={t("common.actions.details")}
          handler={() =>
            navigate(generatePath(APP_ROUTES.ISSUER_BY_ID, { chainId: network, id: issuer.address }), {
              state: { from: location.pathname },
            })
          }
          buttonType={EButtonType.OUTLINED}
          iconRight={<ChevronRight />}
        />
        {issuer.CTALink && (
          <Button
            isSmall
            name={issuer.CTATitle}
            handler={() => window.open(issuer.CTALink, "_blank")}
            buttonType={EButtonType.TRANSPARENT}
            iconRight={<ArrowUpRight />}
          />
        )}
      </div>
    </div>
  );
};

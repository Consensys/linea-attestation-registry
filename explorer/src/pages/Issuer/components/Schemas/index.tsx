import { t } from "i18next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { AttestationDefinition } from "@/pages/Home/interface.ts";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES, CHAIN_ID_ROUTE } from "@/routes/constants";

import { ISchemasProps } from "./interface";

export const Schemas: React.FC<ISchemasProps> = ({ issuerSchemas }) => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();

  if (issuerSchemas === undefined || issuerSchemas.length === 0) return null;

  const handleSeeAttestationsClick = (portal: string, schema: string) => {
    const whereClauseJSON = {
      portal_: { id: portal },
      schema_: { id: schema },
    };
    const whereClause = `?where=${encodeURIComponent(JSON.stringify(whereClauseJSON))}`;
    navigate(APP_ROUTES.ATTESTATIONS.replace(CHAIN_ID_ROUTE, network) + whereClause, {
      state: { from: location.pathname },
    });
  };

  const displayLogo = (attestationDefinition: AttestationDefinition) => {
    const Logo: React.FC<React.SVGProps<SVGSVGElement>> =
      isDarkMode && attestationDefinition.logoDark ? attestationDefinition.logoDark : attestationDefinition.logo;
    return <Logo className="w-full h-auto max-w-[2.5rem] md:max-w-[3rem] max-h-[2.5rem] md:max-h-[3rem]" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {issuerSchemas.map((issuerSchema) => (
        <div
          key={`${issuerSchema.portal}-${issuerSchema.schema}`}
          className="group flex flex-col gap-4 border border-border-card dark:border-border-cardDark rounded-xl p-4 md:p-6 hover:bg-surface-secondary dark:hover:bg-surface-secondaryDark transition md:min-h-[20rem]"
        >
          <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-blackDefault dark:text-whiteDefault">
            <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center justify-center">
              {displayLogo(issuerSchema)}
            </div>
            {issuerSchema.name}
          </div>
          <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">{issuerSchema.description}</div>
          <div className="flex flex-1 flex-col lg:flex-row lg:items-end gap-4 justify-end lg:justify-start">
            <Button
              isSmall
              name={t("common.actions.seeAttestations")}
              handler={() => handleSeeAttestationsClick(issuerSchema.portal, issuerSchema.schema)}
              buttonType={EButtonType.OUTLINED}
              iconRight={<ChevronRight />}
            />
            <Button
              isSmall
              name={t("common.actions.getAttestation")}
              handler={() => window.open(issuerSchema.url, "_blank")}
              buttonType={EButtonType.TRANSPARENT}
              iconRight={<ArrowUpRight />}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

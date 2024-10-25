import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ChevronRight } from "lucide-react";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { issuersData } from "@/pages/Home/data";
import { IIssuer } from "@/pages/Home/interface";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { timeElapsed } from "@/utils/dateUtils";

import { IAttestationCardProps } from "./interface";

export const AttestationCard: React.FC<IAttestationCardProps> = ({
  id,
  schemaId,
  portalId,
  issuanceDate,
  expiryDate,
}) => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();
  const isExpired = expiryDate ? new Date(expiryDate * 1000) < new Date() : false;

  const issuerData = issuersData.find((issuer) =>
    issuer.attestationDefinitions.some(
      (definition) =>
        definition.schema.toLowerCase() === schemaId.toLowerCase() &&
        definition.portal.toLowerCase() === portalId.toLowerCase(),
    ),
  ) as IIssuer;
  const attestationDefinitions = issuerData?.attestationDefinitions.find(
    (definition) => definition.schema.toLowerCase() === schemaId.toLowerCase(),
  );

  if (!issuerData) {
    console.log("Issuer not found for attestation", id, schemaId, portalId);
    return null;
  }

  const logo = attestationDefinitions?.logo ?? issuerData?.logo;
  const logoDark = attestationDefinitions?.logoDark ?? issuerData?.logoDark;
  const name = attestationDefinitions?.name ?? issuerData?.name;
  const description = attestationDefinitions?.description ?? "";
  const issuerName = issuerData.name;

  const maxDescriptionLength = 200;
  const isDescriptionLong = description.length > maxDescriptionLength;
  const truncatedDescription = isDescriptionLong ? `${description.slice(0, maxDescriptionLength)}...` : description;

  const handleViewDetailsClick = (id: string) => {
    navigate(generatePath(APP_ROUTES.ATTESTATION_BY_ID, { chainId: network, id }), {
      state: { from: location.pathname },
    });
  };

  const displayLogo = () => {
    const Logo: React.FC<React.SVGProps<SVGSVGElement>> = isDarkMode && logoDark ? logoDark : logo;
    return <Logo className="w-full h-auto max-w-[2.5rem] md:max-w-[3rem] max-h-[2.5rem] md:max-h-[3rem]" />;
  };

  return (
    <div
      key={`${id}`}
      className="group flex flex-col justify-between gap-4 border border-border-card dark:border-border-cardDark rounded-xl p-4 md:p-6 hover:bg-surface-secondary dark:hover:bg-surface-secondaryDark transition md:min-h-[20rem]"
    >
      <div>
        <div className="flex items-start gap-3 text-xl md:text-md font-semibold text-blackDefault dark:text-whiteDefault">
          <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center mr-2 justify-center">
            {displayLogo()}
          </div>
          <div className="flex flex-col">
            <div>{name}</div>
            <div className="text-sm font-normal text-blackDefault dark:text-whiteDefault">{issuerName}</div>
          </div>
        </div>
        {description && description.trim() ? (
          <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary mt-4">
            {isDescriptionLong ? (
              <Tippy content={description} placement="bottom" theme={isDarkMode ? "dark" : "light"}>
                <span>{truncatedDescription}</span>
              </Tippy>
            ) : (
              <span>{description}</span>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex justify-between text-sm font-normal text-text-darkGrey dark:text-tertiary">
          <span>Issued</span> <span>{timeElapsed(issuanceDate)}</span>
        </div>
        {!!expiryDate && isExpired && (
          <div className="flex justify-between text-sm font-semibold text-text-darkGrey dark:text-tertiary">
            <div className="flex items-center">
              <span>Expired</span>
              <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <text x="12" y="17" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">
                  i
                </text>
              </svg>
            </div>
            <span>{timeElapsed(expiryDate)}</span>
          </div>
        )}
        <div className="flex mt-4 lg:flex-row lg:items-end justify-end lg:justify-start">
          <Button
            isSmall
            name="View details"
            handler={() => handleViewDetailsClick(id)}
            buttonType={EButtonType.OUTLINED}
            iconRight={<ChevronRight />}
          />
        </div>
      </div>
    </div>
  );
};

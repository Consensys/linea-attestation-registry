import { ChevronRight } from "lucide-react";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { parseDateTime } from "@/utils/dateUtils";

import { IAttestationCardProps } from "./interface";

export const AttestationCard: React.FC<IAttestationCardProps> = ({
  id,
  logo,
  logoDark,
  name,
  description,
  issuerName,
  issuanceDate,
}) => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();

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
      className="group flex flex-col gap-4 border border-border-card dark:border-border-cardDark rounded-xl p-4 md:p-6 hover:bg-surface-secondary dark:hover:bg-surface-secondaryDark transition md:min-h-[20rem]"
    >
      <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-blackDefault dark:text-whiteDefault">
        <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center justify-center">
          {displayLogo()}
        </div>
        {name}
      </div>
      {description && description.trim() ? (
        <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">{description}</div>
      ) : null}
      <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">
        <span className="font-bold">Issuer : </span>
        {issuerName}
      </div>
      <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary">
        <span className="font-bold">Date : </span>
        {parseDateTime(issuanceDate.toString(), true).stringUTC}
      </div>
      <div className="flex flex-1 flex-col lg:flex-row lg:items-end gap-4 justify-end lg:justify-start">
        <Button
          isSmall
          name="View details"
          handler={() => handleViewDetailsClick(id)}
          buttonType={EButtonType.OUTLINED}
          iconRight={<ChevronRight />}
        />
      </div>
    </div>
  );
};

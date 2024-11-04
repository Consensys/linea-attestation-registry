import { ChevronRight } from "lucide-react";
import moment from "moment";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";

import circleInfo from "@/assets/icons/circle-info.svg";
import StampLogo from "@/assets/logo/stamp-logo.svg?react";
import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { Tooltip } from "@/components/Tooltip";
import { SWRKeys } from "@/interfaces/swr/enum";
import { issuersData } from "@/pages/Home/data";
import { IIssuer } from "@/pages/Home/interface";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { IAttestationCardProps } from "./interface";

export const AttestationCard: React.FC<IAttestationCardProps> = ({
  id,
  schemaId,
  portalId,
  issuanceDate,
  expiryDate,
}) => {
  const {
    sdk,
    network: { chain, network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTernaryDarkMode();
  const isExpired = expiryDate ? new Date(expiryDate * 1000) < new Date() : false;

  // Function to find issuer data by schemaId and portalId
  const findIssuerData = () => {
    let issuer = issuersData.find((issuer) =>
      issuer.attestationDefinitions.some(
        (definition) =>
          definition.schema.toLowerCase() === schemaId.toLowerCase() &&
          definition.portal.toLowerCase() === portalId.toLowerCase(),
      ),
    ) as IIssuer;

    if (!issuer) {
      issuer = issuersData.find((issuer) =>
        issuer.attestationDefinitions.some((definition) => definition.portal.toLowerCase() === portalId.toLowerCase()),
      ) as IIssuer;
    }

    return issuer;
  };

  // Fallback to schema if issuer data not found
  const issuerData = findIssuerData();
  const attestationDefinitions = issuerData?.attestationDefinitions.find(
    (definition) => definition.schema.toLowerCase() === schemaId.toLowerCase(),
  );

  const { data: schema, isLoading: isSchemaLoading } = useSWR(
    !issuerData && !attestationDefinitions ? `${SWRKeys.GET_SCHEMA_BY_ID}/${schemaId}/${chain.id}` : null,
    async () => sdk.schema.findOneById(schemaId),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const { data: portal, isLoading: isPortalLoading } = useSWR(
    !issuerData ? `${SWRKeys.GET_PORTAL_BY_ID}/${portalId}/${chain.id}` : null,
    async () => sdk.portal.findOneById(schemaId),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (!issuerData && isSchemaLoading && isPortalLoading) return null;

  const logo = attestationDefinitions?.logo ?? issuerData?.logo ?? StampLogo;
  const logoDark = attestationDefinitions?.logoDark ?? issuerData?.logoDark ?? logo ?? StampLogo;
  const name = attestationDefinitions?.name ?? issuerData?.name ?? schema?.name;
  const description = attestationDefinitions?.description ?? schema?.description ?? "";
  const issuerName = issuerData?.name ?? schema?.name ?? portal?.name;

  const maxDescriptionLength = 140;
  const truncatedDescription =
    description.length > maxDescriptionLength ? `${description.slice(0, maxDescriptionLength)}...` : description;

  const handleViewDetailsClick = (id: string) => {
    navigate(generatePath(APP_ROUTES.ATTESTATION_BY_ID, { chainId: network, id }), {
      state: { from: location.pathname },
    });
  };

  const displayLogo = () => {
    const Logo: React.FC<React.SVGProps<SVGSVGElement>> = isDarkMode ? logoDark : logo;
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
        {description && (
          <div className="text-sm font-normal text-text-darkGrey dark:text-tertiary mt-4">
            <span>{truncatedDescription}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex justify-between text-sm font-normal text-text-darkGrey dark:text-tertiary">
          <span>Issued</span> <span>{moment.unix(issuanceDate).fromNow()}</span>
        </div>
        {!!expiryDate && isExpired && (
          <div className="flex justify-between text-sm font-semibold text-text-darkGrey dark:text-tertiary">
            <div className="flex items-center">
              <span>Expired</span>
              <Tooltip
                content={
                  <div style={{ width: "350px", fontWeight: "normal" }}>
                    The validity of this Attestation is determined by the Issuer, and consumers may choose to adhere to
                    or ignore this expiration date.
                  </div>
                }
                placement="right"
                isDarkMode={isDarkMode}
              >
                <img src={circleInfo} className="!h-[16px] !w-[16px] ml-1" />
              </Tooltip>
            </div>
            <span>{moment.unix(expiryDate).fromNow()}</span>
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

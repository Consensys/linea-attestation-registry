import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { ArrowUpRight, Info } from "lucide-react";
import { useCallback } from "react";
import { useTernaryDarkMode } from "usehooks-ts";
import { Address, Hex, hexToNumber, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";

import { Link } from "@/components/Link";
import { Tooltip } from "@/components/Tooltip";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { toAttestationsBySubject, toPortalById } from "@/routes/constants";
import { getBlockExplorerLink } from "@/utils";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { NetworkResolver } from "@/utils/networkResolver";
import { cropString } from "@/utils/stringUtils";

import { createDateListItem } from "./utils";

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const { networkType } = useNetwork();

  const { data: attesterEnsAddress } = useEnsName({
    address: attestation.attester as Address,
    chainId: mainnet.id,
  });

  const { data: subjectEnsAddress } = useEnsName({
    address: attestation.subject as Address,
    chainId: mainnet.id,
    query: { enabled: isAddress(attestation.subject) },
  });

  const { isDarkMode } = useTernaryDarkMode();

  const displayAttesterEnsNameOrAddress = useCallback(() => {
    if (attesterEnsAddress) {
      return attesterEnsAddress;
    }

    return cropString(attestation.attester);
  }, [attesterEnsAddress, attestation.attester]);

  const displaySubjectEnsNameOrAddress = useCallback(() => {
    if (subjectEnsAddress) {
      return subjectEnsAddress;
    }

    return cropString(attestation.subject);
  }, [subjectEnsAddress, attestation.subject]);

  const { attestedDate, expirationDate, revocationDate, id, revoked, attester, portal, subject } = attestation;

  const network = NetworkResolver.getNetworkFromAttestationId(id, networkType);
  const chain = NetworkResolver.getChainFromNetwork(network);
  const blockExplorerLink = chain.chain ? getBlockExplorerLink(chain.chain) : undefined;
  const networkLogo = NetworkResolver.getNetworkLogoByAttestationId(id, isDarkMode, networkType);

  const tooltipContentStyle = {
    fontSize: "0.7rem",
    padding: "2px 4px",
    whiteSpace: "nowrap",
  };

  const list: Array<{ title: string; value: string; to?: string; link?: string }> = [
    createDateListItem(t("attestation.info.attested"), attestedDate.toString()),
    createDateListItem(t("attestation.info.expirationDate"), expirationDate.toString()),
    {
      title: t("attestation.info.revoked.title"),
      value: revoked ? t("attestation.info.revoked.yes") : t("attestation.info.revoked.no"),
    },
    createDateListItem(t("attestation.info.revocationDate"), revocationDate?.toString()),
    {
      title: t("attestation.info.issuedBy"),
      value: displayAttesterEnsNameOrAddress(),
      link: `${blockExplorerLink}/${attester}`,
    },
    {
      title: t("attestation.info.portal"),
      value: cropString(portal.name),
      to: toPortalById(portal.id, network),
    },
    {
      title: t("attestation.info.subject"),
      value: displaySubjectEnsNameOrAddress(),
      to: toAttestationsBySubject(subject),
    },
  ];

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex items-center">
        <div className="font-semibold text-page-attestation dark:text-page-attestationDark text-2xl whitespace-nowrap md:text-3xl mr-3">
          #{displayAmountWithComma(hexToNumber(`0x${(id as Hex).substring(6)}`))}
        </div>
        {networkLogo && (
          <Tooltip
            content={<div style={tooltipContentStyle}>{chain.name}</div>}
            placement="top"
            isDarkMode={isDarkMode}
            minWidth="auto"
            compact
          >
            <div className="w-[24px]">{networkLogo}</div>
          </Tooltip>
        )}
      </div>
      <div className="gap-6 flex flex-col items-start w-full md:flex-wrap md:h-[170px] md:content-between xl:flex-nowrap xl:h-auto">
        {list.map((item) => (
          <div key={item.title} className="inline-flex gap-2 w-full justify-between text-xs items-center md:w-auto">
            <div className="w-[140px] font-normal text-text-quaternary flex items-center gap-2">
              {item.title.toUpperCase()}
              {item.title === t("attestation.info.expirationDate").toUpperCase() && (
                <Tooltip
                  minWidth="200px"
                  content="The validity of this Attestation is determined by the Issuer, and consumers may choose to adhere to or ignore this expiration date."
                >
                  <Info className="w-4 h-4 text-text-quaternary cursor-help flex-shrink-0" />
                </Tooltip>
              )}
            </div>
            {item.to ? (
              <Link
                to={item.to}
                className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap overflow-hidden text-ellipsis md:text-base hover:underline"
              >
                {item.value}
              </Link>
            ) : item.link ? (
              <a
                href={item.link}
                target="_blank"
                className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap overflow-hidden text-ellipsis md:text-base hover:underline flex items-center gap-2"
              >
                {item.value}
                <ArrowUpRight width="1rem" height="auto" />
              </a>
            ) : (
              <div className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap text-right md:text-base">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

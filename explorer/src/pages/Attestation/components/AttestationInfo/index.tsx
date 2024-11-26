import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { ArrowUpRight } from "lucide-react";
import { useCallback } from "react";
import { Address, Hex, hexToNumber, isAddress } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";

import { Link } from "@/components/Link";
import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE, toAttestationsBySubject, toPortalById } from "@/routes/constants";
import { getBlockExplorerLink } from "@/utils";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { cropString } from "@/utils/stringUtils";

import { createDateListItem } from "./utils";

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const {
    network: { chain, network },
  } = useNetworkContext();

  const { data: attesterEnsAddress } = useEnsName({
    address: attestation.attester as Address,
    chainId: mainnet.id,
  });

  const { data: subjectEnsAddress } = useEnsName({
    address: attestation.subject as Address,
    chainId: mainnet.id,
    query: { enabled: isAddress(attestation.subject) },
  });

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

  const blockExplorerLink = getBlockExplorerLink(chain);

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
      to: toPortalById(portal.id),
    },
    {
      title: t("attestation.info.subject"),
      value: displaySubjectEnsNameOrAddress(),
      to: toAttestationsBySubject(subject).replace(CHAIN_ID_ROUTE, network),
    },
  ];

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="font-semibold text-page-attestation dark:text-page-attestationDark text-2xl whitespace-nowrap md:text-3xl">
        #{displayAmountWithComma(hexToNumber(`0x${(id as Hex).substring(6)}`))}
      </div>
      <div className="gap-6 flex flex-col items-start w-full md:flex-wrap md:h-[170px] md:content-between xl:flex-nowrap xl:h-auto">
        {list.map((item) => (
          <div key={item.title} className="inline-flex gap-2 w-full justify-between text-xs items-center md:w-auto">
            <div className="min-w-[120px] font-normal text-text-quaternary">{item.title.toUpperCase()}</div>
            {item.to && (
              <Link
                to={item.to}
                className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base hover:underline"
              >
                {item.value}
              </Link>
            )}

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base hover:underline flex items-center gap-2"
              >
                {item.value}
                <ArrowUpRight width="1rem" height="auto" />
              </a>
            )}

            {!item.to && !item.link && (
              <div className="text-text-secondary dark:text-text-secondaryDark whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

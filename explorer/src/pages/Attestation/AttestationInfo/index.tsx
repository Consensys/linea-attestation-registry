import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { Hex, hexToNumber } from "viem";

import { Link } from "@/components/Link";
import { toModuleById } from "@/routes/constants";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { cropString } from "@/utils/stringUtils";

import { createDateListItem } from "./utils";

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const { attestedDate, expirationDate, revocationDate, id, revoked, attester, portal, subject } = attestation;
  const list: Array<{ title: string; value: string; link?: string }> = [
    createDateListItem(t("attestation.info.attested"), attestedDate.toString()),
    createDateListItem(t("attestation.info.expirationDate"), expirationDate.toString()),
    {
      title: t("attestation.info.revoked.title"),
      value: revoked ? t("attestation.info.revoked.yes") : t("attestation.info.revoked.no"),
    },
    createDateListItem(t("attestation.info.revocationDate"), revocationDate?.toString()),
    {
      title: t("attestation.info.issuedBy"),
      value: cropString(attester),
    },
    {
      title: t("attestation.info.portal"),
      value: cropString(portal),
      link: toModuleById(portal),
    },
    {
      title: t("attestation.info.subject"),
      value: cropString(subject),
    },
  ];

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="font-semibold text-text-blue text-2xl whitespace-nowrap md:text-3xl">
        #{displayAmountWithComma(hexToNumber(id as Hex))}
      </div>
      <div className="gap-6 flex flex-col items-start w-full md:flex-wrap md:h-[170px] md:content-between xl:flex-nowrap xl:h-auto">
        {list.map((item) => (
          <div key={item.title} className="inline-flex gap-2 w-full justify-between text-xs items-center md:w-auto">
            <div className="min-w-[120px] font-normal text-text-quaternary">{item.title.toUpperCase()}</div>
            {item.link ? (
              <Link
                to={item.link}
                className="text-text-secondary whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base hover:underline"
              >
                {item.value}
              </Link>
            ) : (
              <div className="text-text-secondary whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

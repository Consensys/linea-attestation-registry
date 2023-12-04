import { Attestation } from "@verax-attestation-registry/verax-sdk";

import { displayAmountWithComma } from "@/utils/amountUtils";

import { createDateListItem } from "./utils";
import { Hex, hexToNumber } from "viem";
import { toModuleById } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const { attestedDate, expirationDate, revocationDate, id, revoked, attester, portal, subject } = attestation;
  const list = [
    createDateListItem("ATTESTED", attestedDate.toString()),
    createDateListItem("EXPIRATION DATE", expirationDate.toString()),
    {
      title: "REVOKED",
      value: revoked ? "YES" : "NO",
    },
    createDateListItem("REVOCATION DATE", revocationDate?.toString()),
    {
      title: "ISSUED BY",
      value: cropString(attester),
    },
    {
      title: "PORTAL",
      value: cropString(portal),
      link: toModuleById(portal),
    },
    {
      title: "SUBJECT",
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
            <div className="text-text-secondary whitespace-nowrap self-stretch overflow-hidden text-ellipsis md:text-base">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

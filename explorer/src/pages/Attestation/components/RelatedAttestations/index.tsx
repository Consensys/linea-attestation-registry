import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { KeyedMutator } from "swr";
import { Hex, hexToNumber } from "viem";

import { useNetworkContext } from "@/providers/network-provider/context";
import { toAttestationById } from "@/routes/constants";
import { displayAmountWithComma } from "@/utils/amountUtils";

export const RelatedAttestations: React.FC<{ mutate: KeyedMutator<Attestation | undefined> }> = ({ mutate }) => {
  const { sdk } = useNetworkContext();

  const list = [
    {
      id: "0x0000000000000000000000000000000000000000000000000000000000000001",
      title: t("attestation.related.attestationVerification"),
    },
    {
      id: "0x0000000000000000000000000000000000000000000000000000000000000002",
      title: t("attestation.related.aspectProfessionalProfile"),
    },
    {
      id: "0x0000000000000000000000000000000000000000000000000000000000000003",
      title: t("attestation.related.web3Profile"),
    },
    {
      id: "0x0000000000000000000000000000000000000000000000000000000000000004",
      title: t("attestation.related.proofOfPersonator"),
    },
    {
      id: "0x0000000000000000000000000000000000000000000000000000000000000005",
      title: t("attestation.related.reviewer"),
    },
  ];
  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="text-text-primary text-base font-semibold">{t("attestation.related.title")}</div>
      {!list.length ? (
        <div className="flex gap-2 text-base text-text-tertiary w-full justify-center mt-2">
          <EyeOffIcon />
          {t("common.messages.notFound")}
        </div>
      ) : (
        <div className="self-stretch flex flex-col justify-start items-start gap-4 pb-1 lg:flex-row lg:flex-wrap">
          {list.map(({ id, title }) => (
            <Link
              key={id}
              to={toAttestationById(id)}
              onClick={() => {
                mutate(sdk.attestation.findOneById(id));
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
              preventScrollReset
              className="py-2 justify-start items-center gap-2 inline-flex flex-shrink-0 lg:flex-col lg:items-start lg:w-[115px]"
            >
              <div className="text-text-secondary text-lg font-semibold">
                {displayAmountWithComma(hexToNumber(id as Hex))}
              </div>
              <div className="text-text-tertiary text-sm font-normal">{title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

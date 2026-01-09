import { OrderDirection } from "@verax-attestation-registry/verax-sdk";
import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { isAddress } from "viem";

import { CardView } from "../Attestations/components/CardView";

import { Title } from "@/components/Title";
import { THOUSAND } from "@/constants";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { EQueryParams } from "@/enums/queryParams";
import useWindowDimensions from "@/hooks/useWindowDimensions.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { mainnets, testnets } from "@/utils";
import { cropString } from "@/utils/stringUtils.ts";

export const Subject: React.FC = () => {
  const { subject } = useParams();
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { sm } = useWindowDimensions();

  const [copied, setCopied] = useState<boolean>(false);

  const chainsForQuery = useMemo(() => (networkType === "mainnet" ? mainnets : testnets), [networkType]);

  const handleCopy = (text: string, result: boolean) => {
    if (!result || !text) return;
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, THOUSAND);
  };

  const CopyIcon = copied ? Check : Copy;

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${subject}/${sortByDateDirection}`,
    async () => {
      const rawAttestations = await sdk.attestation.findByMultiChain(
        chainsForQuery,
        undefined,
        undefined,
        { subject },
        "attestedDate",
        (sortByDateDirection as OrderDirection) || "desc",
      );
      return rawAttestations.sort((a, b) => b.attestedDate - a.attestedDate);
    },
  );

  return (
    <div className="container mt-5 md:mt-8">
      <Title title={"Explore Attestations"} />
      <div className="flex items-center text-text-secondary dark:text-text-secondaryDark text-base font-medium gap-3 mb-6">
        <div>With subject {sm && subject && isAddress(subject) ? cropString(subject) : subject}</div>
        <CopyToClipboard onCopy={handleCopy} text={subject ?? ""}>
          <CopyIcon
            className={`w-4 cursor-pointer hover:opacity-60 transition ${
              copied ? "text-greenDefault dark:text-greenDark" : "text-greyDefault dark:text-text-secondaryDark"
            } `}
          />
        </CopyToClipboard>
      </div>
      {attestationsList && <CardView attestationsList={attestationsList}></CardView>}
    </div>
  );
};

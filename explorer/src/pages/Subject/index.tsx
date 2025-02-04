import { OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { isAddress } from "viem";

import { Title } from "@/components/Title";
import { THOUSAND } from "@/constants";
import { EQueryParams } from "@/enums/queryParams";
import useWindowDimensions from "@/hooks/useWindowDimensions.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { cropString } from "@/utils/stringUtils.ts";

import { CardView } from "../Attestations/components/CardView";

export const Subject: React.FC = () => {
  const { subject } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();
  const searchParams = new URLSearchParams(window.location.search);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);

  const { sm } = useWindowDimensions();

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string, result: boolean) => {
    if (!result || !text) return;
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, THOUSAND);
  };

  const CopyIcon = copied ? Check : Copy;

  const { data: attestationsList } = useSWR(
    `${SWRKeys.GET_ATTESTATION_LIST}/${subject}/${sortByDateDirection}/${chain.id}`,
    () =>
      sdk.attestation.findBy(
        undefined,
        undefined,
        { subject },
        "attestedDate",
        (sortByDateDirection as OrderDirection) || "desc",
      ),
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

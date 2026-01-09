import { ChainName } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useTernaryDarkMode } from "usehooks-ts";

import { RecentAttestations } from "./components/RecentAttestations";
import { SchemaLoadingSkeleton } from "./components/SchemaLoadingSkeleton";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { Tooltip } from "@/components/Tooltip";
import { regexEthAddress, urlRegex } from "@/constants/regex";
import { useNetwork } from "@/contexts/NetworkContext.ts";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { mainnets, testnets } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver.ts";

export const Schema: React.FC = () => {
  const { id } = useParams();
  const { sdk } = useNetworkContext();
  const { networkType } = useNetwork();
  const { isDarkMode } = useTernaryDarkMode();

  const {
    data: schemaData,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_SCHEMA_BY_ID}/${id}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[64].test(id)) {
        const schemas = await sdk.schema.findByMultiChain(
          networkType === "mainnet" ? mainnets : testnets,
          undefined,
          undefined,
          { id },
        );

        if (schemas && schemas.length > 0) {
          const schema = schemas[0];
          const networks = schemas.map((s) => s.chainName as ChainName);

          return {
            ...schema,
            networks,
            networkCount: networks.length,
          };
        }
      }
      return null;
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <SchemaLoadingSkeleton />;

  if (!schemaData) return <NotFoundPage page="schema" id={id} />;

  const { networks = [] } = schemaData;
  const isContextURL = urlRegex.test(schemaData.context);

  const tooltipContentStyle = {
    fontSize: "0.7rem",
    padding: "2px 4px",
    whiteSpace: "nowrap",
  };

  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back />
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <p className="text-page-schema dark:text-page-schemaDark text-2xl not-italic font-semibold md:text-[2rem] mr-3">
              {schemaData.name}
            </p>
            <div className="flex items-center gap-2">
              {networks.map((network, index) => {
                const resolvedNetwork = NetworkResolver.getNetworkFromChainName(network);
                return (
                  <Tooltip
                    key={`${network}-${index}`}
                    content={<div style={tooltipContentStyle}>{resolvedNetwork.name}</div>}
                    placement="top"
                    isDarkMode={isDarkMode}
                    minWidth="auto"
                    compact
                  >
                    <div className="w-[24px]">{NetworkResolver.getNetworkLogoByChainName(network, isDarkMode)}</div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
          <p className="text-text-quaternary text-base not-italic">{schemaData.description}</p>
        </div>
        <hr className="border-border-card dark:border-border-cardDark" />
      </div>
      <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{t("schema.context")}</p>
          {isContextURL ? (
            <a
              href={schemaData.context}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer hover:underline overflow-hidden text-ellipsis sm:max-w-[320px] whitespace-nowrap dark:text-text-secondaryDark"
            >
              {schemaData.context}
            </a>
          ) : (
            <p className="overflow-hidden text-ellipsis sm:max-w-[320px] whitespace-nowrap dark:text-text-secondaryDark">
              {schemaData.context}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[600px] w-full">
          <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{t("schema.rawSchema")}</p>
          <div className="flex h-[113px] md:h-[131px] px-4 py-2 md:p-4 rounded-xl bg-surface-magenta20 dark:bg-surface-magenta20Dark text-text-tertiary dark:text-tertiary md:text-base">
            {schemaData.schema && (
              <div className="scrollbar overflow-auto font-IBMPlexMono">{schemaData.schema.replace(/,/g, ", ")}</div>
            )}
          </div>
        </div>
      </div>
      <RecentAttestations schemaId={schemaData.id} />
    </section>
  );
};

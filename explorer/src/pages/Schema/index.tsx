import { t } from "i18next";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { regexEthAddress, urlRegex } from "@/constants/regex";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { RecentAttestations } from "./components/RecentAttestations";
import { SchemaLoadingSkeleton } from "./components/SchemaLoadingSkeleton";

export const Schema = () => {
  const { id } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const {
    data: schema,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_SCHEMA_BY_ID}/${id}/${chain.id}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[64].test(id)) return sdk.schema.findOneById(id);
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <SchemaLoadingSkeleton />;
  if (!schema) return <NotFoundPage page="schema" id={id} />;
  const isContextURL = urlRegex.test(schema.context);
  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back />
        <div className="flex flex-col gap-3">
          <p className="text-page-schema dark:text-page-schemaDark text-2xl not-italic font-semibold md:text-[2rem]">
            {schema.name}
          </p>
          <p className="text-text-quaternary text-base not-italic">{schema.description}</p>
        </div>
        <hr className="border-border-card dark:border-border-cardDark" />
      </div>
      <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{t("schema.context")}</p>
          {isContextURL ? (
            <a
              href={schema.context}
              target="_blank"
              className="cursor-pointer hover:underline overflow-hidden text-ellipsis sm:max-w-[320px] whitespace-nowrap dark:text-text-secondaryDark"
            >
              {schema.context}
            </a>
          ) : (
            <p className="overflow-hidden text-ellipsis sm:max-w-[320px] whitespace-nowrap dark:text-text-secondaryDark">
              {schema.context}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[600px] w-full">
          <p className="text-xs text-text-quaternary not-italic font-normal uppercase">{t("schema.rawSchema")}</p>
          <div className="flex h-[113px] md:h-[131px] px-4 py-2 md:p-4 rounded-xl bg-surface-magenta20 dark:bg-surface-magenta20Dark text-text-tertiary dark:text-tertiary md:text-base">
            {schema.schema && (
              <div className="scrollbar overflow-auto font-IBMPlexMono">{schema.schema.replace(/,/g, ", ")}</div>
            )}
          </div>
        </div>
      </div>
      <RecentAttestations schemaId={schema.id} />
    </section>
  );
};

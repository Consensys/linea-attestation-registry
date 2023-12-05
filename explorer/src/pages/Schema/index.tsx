import { Schema as SchemaProps } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { EMPTY_STRING } from "@/constants";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";

import { RecentAttestations } from "./RecentAttestations";

export const Schema = () => {
  const { id } = useParams();
  const { sdk } = useNetworkContext();

  const {
    data: schema,
    isLoading,
    isValidating,
  } = useSWR(SWRKeys.GET_SCHEMA_BY_ID, () => sdk.schema.findOneById(id || EMPTY_STRING) as Promise<SchemaProps>, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  //todo add loading
  if (isLoading || isValidating) return <p>Loading...</p>;
  if (!schema) return <NotFoundPage page="schema" id={id} />;
  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back to={APP_ROUTES.SCHEMAS} />
        <div className="flex flex-col gap-3">
          <p className="text-text-magenta text-2xl not-italic font-semibold md:text-[2rem]">{schema.name}</p>
          <p className="text-text-quaternary text-base not-italic">{schema.description}</p>
        </div>
      </div>
      <hr className="bg-border-card" />
      <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-quaternary not-italic font-normal">CONTEXT</p>
          <a
            href={schema.context}
            target="_blank"
            className="cursor-pointer hover:underline overflow-hidden text-ellipsis sm:max-w-[320px]"
          >
            {schema.context}
          </a>
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[600px] w-full">
          <p className="text-xs text-text-quaternary not-italic font-normal">RAW SCHEMA</p>
          <div className="flex h-[113px] md:h-[131px] px-4 py-2 md:p-4 rounded-xl bg-surface-magenta20 text-text-tertiary md:text-base">
            <div className="scrollbar overflow-auto font-IBMPlexMono">{schema.schema.replace(/,/g, ", ")}</div>
          </div>
        </div>
      </div>
      <RecentAttestations schemaId={schema.id} />
    </section>
  );
};

import { Module as ModuleProps } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { EMPTY_STRING, links } from "@/constants";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { ModuleLoadingSkeleton } from "./components/ModuleLoadingSkeleton";

export const Module = () => {
  const { id } = useParams();
  const { sdk } = useNetworkContext();

  const {
    data: module,
    isLoading,
    isValidating,
  } = useSWR(SWRKeys.GET_SCHEMA_BY_ID, () => sdk.module.findOneById(id || EMPTY_STRING) as Promise<ModuleProps>, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  if (isLoading || isValidating) return <ModuleLoadingSkeleton />;
  if (!module) return <NotFoundPage page="module" id={id} />;

  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back />
        <div className="flex flex-col gap-3">
          <p className="text-page-module text-2xl not-italic font-semibold md:text-[2rem]">{module.name}</p>
          <p className="text-text-quaternary text-base not-italic">{module.description}</p>
        </div>
      </div>
      <hr className="bg-border-card" />
      <div className="flex flex-col gap-2 px-5 md:px-10">
        <p className="text-xs text-text-quaternary not-italic font-normal">CONTEXT</p>
        <a
          href={`${links.lineascan.address}/${module.moduleAddress}`}
          target="_blank"
          className="cursor-pointer hover:underline overflow-hidden text-ellipsis sm:w-fit"
        >
          {module.moduleAddress}
        </a>
      </div>
    </section>
  );
};

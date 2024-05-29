import { ArrowUpRight } from "lucide-react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Back } from "@/components/Back";
import { NotFoundPage } from "@/components/NotFoundPage";
import { links } from "@/constants";
import { regexEthAddress } from "@/constants/regex";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";

import { ModuleLoadingSkeleton } from "./components/ModuleLoadingSkeleton";

export const Module = () => {
  const { id } = useParams();
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const {
    data: module,
    isLoading,
    isValidating,
  } = useSWR(
    `${SWRKeys.GET_SCHEMA_BY_ID}/${id}/${chain.id}`,
    async () => {
      if (id && regexEthAddress.byNumberOfChar[42].test(id)) return sdk.module.findOneById(id);
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  if (isLoading || isValidating) return <ModuleLoadingSkeleton />;
  if (!module) return <NotFoundPage page="module" id={id} />;

  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Back />
        <div className="flex flex-col gap-3">
          <p className="text-page-module dark:text-page-moduleDark text-2xl not-italic font-semibold md:text-[2rem]">
            {module.name}
          </p>
          <p className="text-text-quaternary text-base not-italic">{module.description}</p>
        </div>
        <hr className="border-border-card dark:border-border-cardDark" />
      </div>
      <div className="flex flex-col gap-2 px-5 md:px-10">
        <p className="text-xs text-text-quaternary not-italic font-normal">CONTEXT</p>
        <a
          href={`${links[chain.id].address}/${module.moduleAddress}`}
          target="_blank"
          className="cursor-pointer hover:underline break-all sm:w-fit dark:text-text-secondaryDark flex items-center gap-2"
        >
          <span className="flex-1">{module.moduleAddress}</span>
          <ArrowUpRight height="auto" width="1rem" />
        </a>
      </div>
    </section>
  );
};

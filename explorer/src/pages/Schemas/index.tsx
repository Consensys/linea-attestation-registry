import { useState } from "react";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { columns } from "@/constants/columns/schema";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

export const Schemas: React.FC = () => {
  const {
    sdk,
    network: { chain },
  } = useNetworkContext();

  const { data: schemasCount } = useSWR(
    `${SWRKeys.GET_SCHEMAS_COUNT}/${chain.id}`,
    () => sdk.schema.getSchemasNumber() as Promise<number>,
  );

  const totalItems = schemasCount ? Number(schemasCount) : ZERO;
  const searchParams = new URLSearchParams(window.location.search);
  const page = pageBySearchParams(searchParams, totalItems);

  const [skip, setSkip] = useState<number>(getItemsByPage(page));

  const { data: schemasList } = useSWR(`${SWRKeys.GET_SCHEMAS_LIST}/${skip}/${chain.id}`, () =>
    sdk.schema.findBy(ITEMS_PER_PAGE_DEFAULT, skip),
  );

  const handlePage = (retrievedPage: number) => {
    setSkip(getItemsByPage(retrievedPage));
  };

  return (
    <div className="container mt-5 md:mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
        <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter zinc-950">Explore Schemas</h1>
      </div>
      <div>
        {/* TODO: add skeleton for table */}
        {schemasList && <DataTable columns={columns()} data={schemasList} />}
        {Boolean(schemasCount) && <Pagination itemsCount={totalItems} handlePage={handlePage} />}
      </div>
    </div>
  );
};

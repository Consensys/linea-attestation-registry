import { Attestation_filter, OrderDirection } from "@verax-attestation-registry/verax-sdk/lib/types/.graphclient";
import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { BasicPagination } from "@/components/Pagination/Basic";
import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, ZERO } from "@/constants";
import { attestationColumnsOption, columns, skeletonAttestations } from "@/constants/columns/attestation";
import { columnsSkeleton } from "@/constants/columns/skeleton";
import { regexEthAddress } from "@/constants/regex";
import { EQueryParams } from "@/enums/queryParams";
import { ETableSorting } from "@/enums/tableSorting";
import { SWRKeys } from "@/interfaces/swr/enum";
import { issuersData } from "@/pages/Home/data";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { buildAttestationId } from "@/utils/attestationIdUtils.ts";
import { getItemsByPage, pageBySearchParams } from "@/utils/paginationUtils";

import { TitleAndSwitcher } from "./components/TitleAndSwitcher";

export const Attestations: React.FC = () => {
  const { sdk, network } = useNetworkContext();

  const { data: attestationsCount } = useSWR(
    `${SWRKeys.GET_ATTESTATION_COUNT}/${network.chain.id}`,
    () => sdk.attestation.getAttestationIdCounter() as Promise<number>,
  );

  const [searchParams] = useSearchParams();

  const totalItems = attestationsCount ?? ZERO;
  const page = pageBySearchParams(searchParams, totalItems);
  const sortByDateDirection = searchParams.get(EQueryParams.SORT_BY_DATE);
  const itemsPerPage = Number(searchParams.get(EQueryParams.ITEMS_PER_PAGE)) || ITEMS_PER_PAGE_DEFAULT;
  const where = searchParams.get(EQueryParams.WHERE)
    ? (JSON.parse(searchParams.get(EQueryParams.WHERE) ?? "") as Attestation_filter)
    : undefined;
  const [lastID, setLastID] = useState<number>(getItemsByPage(page, itemsPerPage));

  const findIssuerBySchema = () =>
    issuersData.find((issuer) =>
      issuer.attestationDefinitions.some(
        (definition) => definition.schema === where?.schema_?.id && definition.portal === where?.portal_?.id,
      ),
    );

  const findIssuerByPortal = () =>
    issuersData.find((issuer) =>
      issuer.attestationDefinitions.some((definition) => where?.portal_in?.includes(definition.portal)),
    );

  const findAttestation = () =>
    attestationDefinitions?.filter((definition) => definition.schema === where?.schema_?.id)[0];

  const isByAttestationType = "schema_" in (where || {});
  const isFilteredByWhere = where && (isByAttestationType || where.portal_in?.length);
  const { name, attestationDefinitions } = isByAttestationType
    ? findIssuerBySchema() || {}
    : findIssuerByPortal() || {};
  const { name: attestationName, portal: attestationPortal } = findAttestation() || {};
  const portalId = isByAttestationType ? where?.portal_?.id : where?.portal_in?.[0];
  const schemaId = where?.schema_?.id;
  const isPortalMatch = portalId === attestationPortal;

  const { data: portal } = useSWR(isPortalMatch ? null : `${SWRKeys.GET_PORTAL_LIST}`, async () => {
    if (portalId && regexEthAddress.byNumberOfChar[42].test(portalId))
      return sdk.portal.findOneById(portalId || EMPTY_STRING);
  });
  const { data: schema } = useSWR(`${SWRKeys.GET_SCHEMA_BY_ID}/${schemaId}/${network.chain.id}`, async () => {
    if (schemaId && regexEthAddress.byNumberOfChar[64].test(schemaId)) return sdk.schema.findOneById(schemaId);
  });

  const generateTitle = useCallback(() => {
    const titleByAttestationType = isPortalMatch
      ? `${name} - ${attestationName}`
      : `Attestations matching Portal ${portal?.name} for Schema ${schema?.name}`;
    const titleByIssuer = `Attestations from ${name || portal?.ownerName}`;
    return isByAttestationType ? titleByAttestationType : titleByIssuer;
  }, [isPortalMatch, portal, schema, name, attestationName, isByAttestationType]);

  const { data: attestationsList, isLoading } = useSWR(
    totalItems > 0
      ? `${SWRKeys.GET_ATTESTATION_LIST}/${itemsPerPage}/${lastID}/${sortByDateDirection}/${network.chain.id}`
      : null,
    () =>
      sdk.attestation.findBy(
        itemsPerPage,
        undefined,
        {
          ...where,
          ...((sortByDateDirection as OrderDirection) === null ||
          (sortByDateDirection as OrderDirection) === undefined ||
          (sortByDateDirection as OrderDirection) === ETableSorting.DESC
            ? { id_lte: buildAttestationId(totalItems - (page - 1) * itemsPerPage, network.prefix) }
            : { id_gt: buildAttestationId(lastID, network.prefix) }),
        },
        "attestedDate",
        (sortByDateDirection as OrderDirection) || ETableSorting.DESC,
      ),
  );
  const handlePage = (retrievedPage: number) => {
    setLastID(getItemsByPage(retrievedPage, itemsPerPage));
  };

  const columnsSkeletonRef = useRef(columnsSkeleton(columns(), attestationColumnsOption));

  const data = isLoading
    ? { columns: columnsSkeletonRef.current, list: skeletonAttestations(itemsPerPage) }
    : { columns: columns({ chain: network.chain }), list: attestationsList || [] };

  const renderPagination = () => {
    if (attestationsCount) {
      if (where) {
        return <BasicPagination handlePage={handlePage} />;
      } else {
        return <Pagination itemsCount={attestationsCount} handlePage={handlePage} />;
      }
    } else {
      return null;
    }
  };

  return (
    <TitleAndSwitcher {...(isFilteredByWhere && { title: generateTitle() })}>
      <DataTable columns={data.columns} data={data.list} link={APP_ROUTES.ATTESTATION_BY_ID} />
      {renderPagination()}
    </TitleAndSwitcher>
  );
};

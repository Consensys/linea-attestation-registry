import { ColumnDef } from "@tanstack/react-table";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import moment from "moment";
import { Address } from "viem";
import { hexToNumber } from "viem/utils";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { SortByDate } from "@/components/SortByDate";
import { ColumnsOptions } from "@/interfaces/components";
import { SWRKeys } from "@/interfaces/swr/enum";
import { SWRCell } from "@/pages/Attestations/components/SWRCell";
import { toAttestationById, toPortalById, toSchemaById } from "@/routes/constants";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { cropString } from "@/utils/stringUtils";

import { EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT, links } from "../index";

interface ColumnsProps {
  sortByDate: boolean;
  sdk: VeraxSdk;
  chainId: number;
}

export const columns = ({ sortByDate = true, sdk, chainId }: Partial<ColumnsProps> = {}): ColumnDef<Attestation>[] => [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="attestation" />
        {t("attestation.list.columns.id")}
      </div>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <Link to={toAttestationById(id as string)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
          {displayAmountWithComma(hexToNumber(id as Address))}
        </Link>
      );
    },
  },
  {
    accessorKey: "portal",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="portal" />
        {t("attestation.list.columns.portal")}
      </div>
    ),
    cell: ({ row }) => {
      if (!sdk) return null;

      const portalId = row.getValue("portal") as string;
      const fetcher = () => sdk.portal.findOneById(portalId || EMPTY_STRING);

      return (
        <SWRCell swrKey={`${SWRKeys.GET_PORTAL_BY_ID}/${portalId}`} fetcher={fetcher} to={toPortalById(portalId)} />
      );
    },
  },
  {
    accessorKey: "schemaId",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="schema" />
        {t("attestation.list.columns.schema")}
      </div>
    ),
    cell: ({ row }) => {
      if (!sdk) return null;

      const schemaId = row.getValue("schemaId") as string;
      const fetcher = () => sdk.schema.findOneById(schemaId || EMPTY_STRING);

      return (
        <SWRCell swrKey={`${SWRKeys.GET_SCHEMA_BY_ID}/${schemaId}`} fetcher={fetcher} to={toSchemaById(schemaId)} />
      );
    },
  },
  {
    accessorKey: "subject",
    header: () => <p className="text-left">{t("attestation.list.columns.subject")}</p>,
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string;
      if (!chainId) return cropString(subject);

      return (
        <a
          href={`${links[chainId].address}/${subject}`}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="hover:underline"
        >
          {cropString(subject)}
        </a>
      );
    },
  },
  {
    accessorKey: "attestedDate",
    header: () => (sortByDate ? <SortByDate /> : <p className="text-right">{t("attestation.list.columns.issued")}</p>),
    cell: ({ row }) => {
      const timestamp: number = row.getValue("attestedDate");
      const id = row.original.id;

      return <TdHandler value={moment.unix(timestamp).fromNow()} to={toAttestationById(id)} />;
    },
  },
];

export const skeletonAttestations = (itemPerPage = ITEMS_PER_PAGE_DEFAULT): Array<Attestation> =>
  Array.from(
    Array(itemPerPage).map((_, index) => ({
      id: index.toString(),
      schemaString: EMPTY_STRING,
      decodedData: [EMPTY_STRING],
      decodedPayload: [EMPTY_STRING],
      attestationId: EMPTY_STRING,
      schemaId: EMPTY_STRING,
      replacedBy: EMPTY_STRING,
      attester: `0x${index}`,
      portal: `0x${index}`,
      attestedDate: 0,
      expirationDate: 0,
      revocationDate: 0,
      version: 0,
      revoked: false,
      subject: EMPTY_STRING,
      attestationData: EMPTY_STRING,
    })),
  );

export const attestationColumnsOption: ColumnsOptions = {
  0: {
    width: 67,
  },
  1: {
    width: 100,
  },
  2: {
    minWidth: 100,
    maxWidth: 220,
    isRandomWidth: true,
  },
  3: {
    width: 135,
  },
  4: {
    width: 78,
  },
};

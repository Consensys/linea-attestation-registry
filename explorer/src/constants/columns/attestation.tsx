import { ColumnDef } from "@tanstack/react-table";
import { Attestation, Portal, Schema } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import moment from "moment";
import { Address, Chain, Hex } from "viem";
import { hexToNumber, isAddress } from "viem/utils";

import { TdHandler } from "@/components/DataTable/components/TdHandler";
import { EnsNameDisplay } from "@/components/EnsNameDisplay";
import { HelperIndicator } from "@/components/HelperIndicator";
import { Link } from "@/components/Link";
import { SortByDate } from "@/components/SortByDate";
import { ColumnsOptions } from "@/interfaces/components";
import { SWRCell } from "@/pages/Attestations/components/SWRCell";
import {
  CHAIN_ID_ROUTE,
  toAttestationById,
  toAttestationsBySubject,
  toPortalById,
  toSchemaById,
} from "@/routes/constants";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { cropString } from "@/utils/stringUtils";

import { EMPTY_0X_STRING, EMPTY_STRING, ITEMS_PER_PAGE_DEFAULT } from "../index";

interface ColumnsProps {
  sortByDate: boolean;
  chain: Chain;
  network: string;
}

export const columns = ({
  sortByDate = true,
  chain,
  network,
}: Partial<ColumnsProps> = {}): ColumnDef<Attestation>[] => [
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
          {displayAmountWithComma(hexToNumber(`0x${(id as Hex).substring(6)}`))}
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
      const portal = row.getValue("portal") as Portal;

      return <SWRCell data={portal} to={toPortalById(portal.id)} />;
    },
  },
  {
    accessorKey: "schema",
    header: () => (
      <div className="flex items-center gap-2.5">
        <HelperIndicator type="schema" />
        {t("attestation.list.columns.schema")}
      </div>
    ),
    cell: ({ row }) => {
      const schema = row.getValue("schema") as Schema;

      return <SWRCell data={schema} to={toSchemaById(schema.id)} />;
    },
  },
  {
    accessorKey: "subject",
    header: () => <p className="text-left">{t("attestation.list.columns.subject")}</p>,
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string;
      if (!chain) return cropString(subject);

      const isValidAddress = isAddress(subject);
      const subjectDisplay = isValidAddress ? <EnsNameDisplay address={subject as Address} /> : cropString(subject);

      return (
        <Link
          to={toAttestationsBySubject(subject).replace(CHAIN_ID_ROUTE, network ?? "")}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {subjectDisplay}
        </Link>
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
      schema: {
        id: EMPTY_0X_STRING,
        name: EMPTY_STRING,
        description: EMPTY_STRING,
        context: EMPTY_STRING,
        schema: EMPTY_STRING,
        attestationCounter: 0,
      },
      replacedBy: EMPTY_STRING,
      attester: `0x${index}`,
      portal: {
        id: EMPTY_0X_STRING,
        ownerAddress: EMPTY_0X_STRING,
        modules: [EMPTY_0X_STRING],
        isRevocable: false,
        name: EMPTY_STRING,
        description: EMPTY_STRING,
        ownerName: EMPTY_STRING,
        attestationCounter: 0,
      },
      attestedDate: 0,
      expirationDate: 0,
      revocationDate: 0,
      version: 0,
      revoked: false,
      subject: EMPTY_STRING,
      encodedSubject: EMPTY_STRING,
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

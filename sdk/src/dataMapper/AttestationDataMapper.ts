import BaseDataMapper from "./BaseDataMapper";
import { Attestation } from "../types";
import { Attestation_filter, Attestation_orderBy } from "../../.graphclient";
import { Constants } from "../utils/constants";

export default class AttestationDataMapper extends BaseDataMapper<
  Attestation,
  Attestation_filter,
  Attestation_orderBy
> {
  typeName = "attestation";
  gqlInterface = `{
            id
            schemaId
            replacedBy
            attester
            portal
            attestedDate
            expirationDate
            revocationDate
            version
            revoked
            subject
            attestationData
            schemaString
            decodedData
  }`;

  async getRelatedAttestations(id: string) {
    return this.findBy(
      undefined,
      undefined,
      {
        attestationData_contains: id,
        schemaId_in: [Constants.RELATIONSHIP_SCHEMA_ID, Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID],
      },
      undefined,
      undefined,
    );
  }
}

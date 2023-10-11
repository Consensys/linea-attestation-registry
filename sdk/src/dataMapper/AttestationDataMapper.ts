import BaseDataMapper from "./BaseDataMapper";
import { Attestation } from "../types";
import { Constants } from "../utils/constants";

export default class AttestationDataMapper extends BaseDataMapper<Attestation> {
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
    return this.findBy({
      attestationData_contains: id,
      schemaId_in: [Constants.RELATIONSHIP_SCHEMA_ID, Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID],
    });
  }
}

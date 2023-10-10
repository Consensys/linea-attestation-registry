import BaseDataMapper from "./BaseDataMapper";
import { Attestation } from "../types";

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
}

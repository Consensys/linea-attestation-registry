import BaseDataMapper from "./BaseDataMapper";
import { abi } from "../abi/AttestationRegistry";

export default class AttestationDataMapper extends BaseDataMapper {
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

  async getVersionNumber() {
    return await this.web3Client.readContract({
      abi,
      address: this.conf.attestationRegistryAddress,
      functionName: "getVersionNumber",
    });
  }

  async getAttestationIdCounter() {
    return await this.web3Client.readContract({
      abi,
      address: this.conf.attestationRegistryAddress,
      functionName: "getAttestationIdCounter",
    });
  }
}

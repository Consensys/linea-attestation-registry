import { AttestationPayload, Portal } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Address, BaseError, ContractFunctionRevertedError, Hash } from "viem";
import { encode } from "../utils/abiCoder";

export default class PortalDataMapper extends BaseDataMapper<Portal> {
  typeName = "portal";
  gqlInterface = `{
        id
        ownerAddress
        modules
        isRevocable
        name
        description
        ownerName
  }`;

  async simulateAttest(portalAddress: Address, attestationPayload: AttestationPayload, validationPayloads: string[]) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);

    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
        functionName: "attest",
        account: this.walletClient.account,
        args: [
          [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
          validationPayloads,
        ],
      });

      return request;
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          console.error(`Failing with ${errorName}`);
        }
      }
      console.error(err);

      throw new Error("Simulation failed");
    }
  }

  async attest(portalAddress: Address, attestationPayload: AttestationPayload, validationPayloads: string[]) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads);
    const hash: Hash = await this.walletClient.writeContract(request);

    console.log(`Transaction sent with hash ${hash}`);

    return hash;
  }

  async bulkAttest() {
    throw new Error("Not implemented");
  }

  async replace() {
    throw new Error("Not implemented");
  }

  async revoke() {
    throw new Error("Not implemented");
  }

  async bulkRevoke() {
    throw new Error("Not implemented");
  }

  async massImport() {
    throw new Error("Not implemented");
  }

  async register() {
    throw new Error("Not implemented");
  }

  async clone() {
    throw new Error("Not implemented");
  }
}

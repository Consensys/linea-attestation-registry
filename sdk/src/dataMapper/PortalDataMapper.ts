import BaseDataMapper from "./BaseDataMapper";
import { abi } from "../abi/PortalRegistry";

export default class PortalDataMapper extends BaseDataMapper {
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

  async getPortalsCount() {
    return await this.web3Client.readContract({
      abi,
      address: this.conf.portalRegistryAddress,
      functionName: "getPortalsCount",
    });
  }
}

import BaseDataMapper from "./BaseDataMapper";
import { abi } from "../abi/ModuleRegistry";

export default class ModuleDataMapper extends BaseDataMapper {
  typeName = "module";
  gqlInterface = `{
        id
        moduleAddress
        name
        description
  }`;

  async getModulesNumber() {
    return await this.web3Client.readContract({
      abi,
      address: this.conf.moduleRegistryAddress,
      functionName: "getModulesNumber",
    });
  }
}

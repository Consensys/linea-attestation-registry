import BaseDataMapper from "./BaseDataMapper";
import { abi } from "../abi/SchemaRegistry";

export default class SchemaDataMapper extends BaseDataMapper {
  typeName = "schema";
  gqlInterface = `{
        id
        name
        description
        context
        schema
  }`;

  async getSchemasNumber() {
    return await this.web3Client.readContract({
      abi,
      address: this.conf.schemaRegistryAddress,
      functionName: "getSchemasNumber",
    });
  }
}

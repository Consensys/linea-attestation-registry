import { Portal } from "../types";
import BaseDataMapper from "./BaseDataMapper";

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

  async attest() {
    throw new Error("Not implemented");
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

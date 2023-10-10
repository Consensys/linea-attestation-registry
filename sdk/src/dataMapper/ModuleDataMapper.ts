import { Module } from "../types";
import BaseDataMapper from "./BaseDataMapper";

export default class ModuleDataMapper extends BaseDataMapper<Module> {
  typeName = "module";
  gqlInterface = `{
        id
        moduleAddress
        name
        description
  }`;

  async register() {
    throw new Error("Not implemented");
  }
}

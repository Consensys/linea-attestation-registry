import { Module_filter, Module_orderBy } from "../../.graphclient";
import { Module } from "../types";
import BaseDataMapper from "./BaseDataMapper";

export default class ModuleDataMapper extends BaseDataMapper<Module, Module_filter, Module_orderBy> {
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

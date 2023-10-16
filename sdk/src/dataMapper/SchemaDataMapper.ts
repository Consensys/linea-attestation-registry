import { Schema_filter, Schema_orderBy } from "../../.graphclient";
import { Schema } from "../types";
import BaseDataMapper from "./BaseDataMapper";

export default class SchemaDataMapper extends BaseDataMapper<Schema, Schema_filter, Schema_orderBy> {
  typeName = "schema";
  gqlInterface = `{
        id
        name
        description
        context
        schema
  }`;

  async create() {
    throw new Error("Not implemented");
  }
}

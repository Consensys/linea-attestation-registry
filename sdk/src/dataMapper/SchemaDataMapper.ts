import BaseDataMapper from "./BaseDataMapper";

export default class SchemaDataMapper extends BaseDataMapper {
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

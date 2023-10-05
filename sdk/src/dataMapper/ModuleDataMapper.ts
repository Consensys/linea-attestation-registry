import BaseDataMapper from "./BaseDataMapper";

export default class ModuleDataMapper extends BaseDataMapper {
  typeName = "module";
  gqlInterface = `{
        id
        moduleAddress
        name
        description
  }`;
}

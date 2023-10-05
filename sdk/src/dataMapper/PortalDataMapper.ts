import BaseDataMapper from "./BaseDataMapper";

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
}

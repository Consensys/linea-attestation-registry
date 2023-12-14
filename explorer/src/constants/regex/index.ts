export const regexEthAddress = {
  by0x: /^0x/,
};
export const ethAddressLength = {
  42: 42,
  66: 66,
};

export const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;

export const schemaRegex =
  /\b(uint256|uint64|uint32|uint16|uint8|address|bool|bytes32|string)(?:\[\])?\s+[a-zA-Z0-9_]+/g;

export const schemaStringRegex = /^((uint256|uint64|uint32|uint16|uint8|address|bool|bytes32|string)(,|$))+$/;

export const convertSchemaRegex = /\b(uint256|uint64|uint32|uint16|uint8|address|bool|bytes32|string)\b/g;

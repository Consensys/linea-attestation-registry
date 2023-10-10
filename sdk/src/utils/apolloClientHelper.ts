export function stringifyWhereClause(whereClauseObj: Record<string, unknown>) {
  let objLiteral = "{";
  for (const key in whereClauseObj) {
    if (Object.prototype.hasOwnProperty.call(whereClauseObj, key)) {
      objLiteral += `${key}: "${whereClauseObj[key]}", `;
    }
  }
  // Remove the trailing comma and space, if any
  if (objLiteral.endsWith(", ")) {
    objLiteral = objLiteral.slice(0, -2);
  }
  objLiteral += "}";
  return objLiteral;
}

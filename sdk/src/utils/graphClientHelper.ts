export function stringifyWhereClause(whereClauseObj: Record<string, unknown>) {
  const json = JSON.stringify(whereClauseObj);
  return json.replace(/"([^"]+)":/g, "$1:");
}

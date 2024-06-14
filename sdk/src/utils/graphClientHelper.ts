import axios from "axios";

export function stringifyWhereClause(whereClauseObj: Record<string, unknown>) {
  const json = JSON.stringify(whereClauseObj);
  return json.replace(/"([^"]+)":/g, "$1:");
}

export function subgraphCall(query: string, url: string) {
  return axios.post(
    url,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
}

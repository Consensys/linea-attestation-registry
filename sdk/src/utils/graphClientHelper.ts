import axios from "axios";

export function stringifyWhereClause(whereClauseObj: Record<string, unknown>) {
  return JSON.stringify(whereClauseObj);
}

export function subgraphCall(query: string, url: string, variables?: Record<string, unknown>) {
  const body = variables === undefined ? { query } : { query, variables };

  return axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

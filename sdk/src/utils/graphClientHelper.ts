import axios from "axios";

export function subgraphCall(query: string, url: string, variables?: Record<string, unknown>) {
  const body = variables === undefined ? { query } : { query, variables };

  return axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

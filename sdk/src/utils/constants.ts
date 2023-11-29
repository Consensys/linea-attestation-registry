export class Constants {
  static readonly RELATIONSHIP_SCHEMA_ID = "0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0";
  static readonly NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID =
    "0x5003a7832fa2734780a5bf6a1f3940b84c0c66a398e62dd4e7f183fdbc7da6ee";
  static readonly OFFCHAIN_DATA_SCHEMA_ID = "0xa288e257097a4bed4166c002cb6911713edacc88e30b6cb2b0104df9c365327d";
}

export enum SDKMode {
  BACKEND = "BACKEND",
  FRONTEND = "FRONTEND",
}

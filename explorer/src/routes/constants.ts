const ID_ROUTE = ":id";
export const CHAIN_ID_ROUTE = ":chainId";

export const APP_ROUTES = {
  HOME: `/${CHAIN_ID_ROUTE}`,
  get ISSUERS() {
    return this.HOME + "/issuers";
  },
  get ISSUER_BY_ID() {
    return this.ISSUERS + `/${ID_ROUTE}`;
  },
  get ATTESTATIONS() {
    return this.HOME + "/attestations";
  },
  get MY_ATTESTATIONS() {
    return this.ATTESTATIONS + "/my_attestations";
  },
  get ATTESTATION_BY_ID() {
    return this.ATTESTATIONS + `/${ID_ROUTE}`;
  },
  get SCHEMAS() {
    return this.HOME + "/schemas";
  },
  get SCHEMA_BY_ID() {
    return this.SCHEMAS + `/${ID_ROUTE}`;
  },
  get MODULES() {
    return this.HOME + "/modules";
  },
  get MODULES_BY_ID() {
    return this.MODULES + `/${ID_ROUTE}`;
  },
  get SEARCH() {
    return this.HOME + "/search";
  },
  get PORTAL_BY_ID() {
    return this.HOME + `/portals/${ID_ROUTE}`;
  },
  DEFAULT: "*",
} as const;

export const toAttestationById = (id: string) => APP_ROUTES.ATTESTATION_BY_ID.replace(ID_ROUTE, id);
export const toSchemaById = (id: string) => APP_ROUTES.SCHEMA_BY_ID.replace(ID_ROUTE, id);
export const toModuleById = (id: string) => APP_ROUTES.MODULES_BY_ID.replace(ID_ROUTE, id);
export const toPortalById = (id: string) => APP_ROUTES.PORTAL_BY_ID.replace(ID_ROUTE, id);

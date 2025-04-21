const ID_ROUTE = ":id";
const SUBJECT_ROUTE = ":subject";
const NETWORK_ROUTE = ":network";

export const APP_ROUTES = {
  HOME: "/",
  get ISSUERS() {
    return this.HOME + "issuers";
  },
  get ISSUER_BY_ID() {
    return this.ISSUERS + `/${ID_ROUTE}`;
  },
  get ATTESTATIONS() {
    return this.HOME + "attestations";
  },
  get MY_ATTESTATIONS() {
    return this.ATTESTATIONS + "/my_attestations";
  },
  get ATTESTATIONS_BY_SUBJECT() {
    return this.HOME + "subject/" + SUBJECT_ROUTE;
  },
  get ATTESTATION_BY_ID() {
    return this.ATTESTATIONS + `/${ID_ROUTE}`;
  },
  get SCHEMAS() {
    return this.HOME + "schemas";
  },
  get SCHEMA_BY_ID() {
    return this.SCHEMAS + `/${ID_ROUTE}`;
  },
  get MODULES() {
    return this.HOME + "modules";
  },
  get MODULE_BY_ID() {
    return `/modules/${NETWORK_ROUTE}/${ID_ROUTE}`;
  },
  get SEARCH() {
    return this.HOME + "search";
  },
  get PORTAL_BY_ID() {
    return `/portals/${NETWORK_ROUTE}/${ID_ROUTE}`;
  },
  DEFAULT: "*",
} as const;

export const toAttestationById = (id: string) => APP_ROUTES.ATTESTATION_BY_ID.replace(ID_ROUTE, id);
export const toAttestationsBySubject = (subject: string) =>
  APP_ROUTES.ATTESTATIONS_BY_SUBJECT.replace(SUBJECT_ROUTE, subject);
export const toSchemaById = (id: string) => APP_ROUTES.SCHEMA_BY_ID.replace(ID_ROUTE, id);
export const toModuleById = (id: string, network: string) =>
  APP_ROUTES.MODULE_BY_ID.replace(ID_ROUTE, id).replace(NETWORK_ROUTE, network);
export const toPortalById = (id: string, network: string) =>
  APP_ROUTES.PORTAL_BY_ID.replace(ID_ROUTE, id).replace(NETWORK_ROUTE, network);

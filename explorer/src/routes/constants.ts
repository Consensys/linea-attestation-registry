const ID_ROUTE = ':id';

export const APP_ROUTES = {
  HOME: '/',
  ISSUERS: '/issuers',
  ATTESTATIONS: '/attestations',
  get ATTESTATION_BY_ID() {
    return this.ATTESTATIONS + `/${ID_ROUTE}`;
  },
  SCHEMAS: '/schemas',
  get SCHEMA_BY_ID() {
    return this.SCHEMAS + `/${ID_ROUTE}`;
  },
  MODULES: '/modules',
  get MODULES_BY_ID() {
    return this.MODULES + `/${ID_ROUTE}`;
  },
  DEFAULT: '*',
} as const;

export const toAttestationById = (id: string) => APP_ROUTES.ATTESTATION_BY_ID.replace(ID_ROUTE, id);
export const toSchemaById = (id: string) => APP_ROUTES.SCHEMA_BY_ID.replace(ID_ROUTE, id);
export const toModuleById = (id: string) => APP_ROUTES.MODULES_BY_ID.replace(ID_ROUTE, id);
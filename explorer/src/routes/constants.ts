export const APP_ROUTES = {
  HOME: '/',
  ISSUERS: '/issuers',
  ATTESTATIONS: '/attestations',
  get ATTESTATION_BY_ID() {
    return this.ATTESTATIONS + '/:id';
  },
  SCHEMAS: '/schemas',
  MODULES: '/modules',
  DEFAULT: '*',
} as const;

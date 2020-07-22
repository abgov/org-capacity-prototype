// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  GRAPH_API_URL: '/api/capacity/v1/graphql',
  API_URL: '/api',
  AUTH_URL: '{oidc provider auth url}',
  AUTH_CLIENT_ID: 'org-capacity-app'
};

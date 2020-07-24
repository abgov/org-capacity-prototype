import { Environment } from '.';

export const environment = {
  production: true,
  GRAPH_API_URL: '/api/capacity/v1/graphql',
  API_URL: '/api',
  AUTH_URL: '{oidc provider auth url}',
  AUTH_CLIENT_ID: 'org-capacity-app'
};

export const getEnvironment = (): Promise<Environment> => 
  fetch('/config/environment.json')
    .then((res) => 
      res.ok ? res.json() : environment
    );
  
const env = process.env;

export const environment = {
  KEYCLOAK_ROOT_URL: '',
  KEYCLOAK_REALM: '',
  LOG_LEVEL: 'debug',
  MONGO_URI: 'mongodb://localhost:27017',
  MONGO_DB: 'capacity',
  MONGO_USER: null,
  MONGO_PASSWORD: null,
  ...env,
  production: env.NODE_ENV === 'production'
};

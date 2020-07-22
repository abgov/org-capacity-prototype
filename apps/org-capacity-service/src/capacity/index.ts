import { ApolloServer } from 'apollo-server-express';
import { Router } from 'express';
import { logger } from '../logger';

import { schema } from './schema';
import { createResolvers } from './resolvers';
import { Repositories } from './repository';

export * from './repository';
export * from './model';
export * from './types';

export const applyCapacityMiddleware = (app: Router, props: Repositories) => {
 
  const apollo = new ApolloServer({ 
    typeDefs: schema, 
    resolvers: createResolvers(props),
    context: ({req}) => ({ user: req.user ? {...req.user, auth: req.headers.authorization} : null }),
    formatError: (err) => {
      logger.error(err);
      return {message: err.message}
    }
  });
  
  apollo.applyMiddleware({ app, path: '/capacity/v1/graphql' });
}

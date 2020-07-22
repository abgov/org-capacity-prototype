import * as express from 'express';
import * as passport from 'passport';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { environment } from './environments/environment';
import { UnauthorizedError } from './common';
import { applyCapacityMiddleware } from './capacity';
import { createRepositories } from './mongo';
import { createJwtStrategy } from './jwt';
import { logger } from './logger';

const app = express();

app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

passport.use('jwt', createJwtStrategy(environment));
passport.use('anonymous', new AnonymousStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.authenticate(['jwt', 'anonymous'], { session: false }));

createRepositories(
  environment
).then((repos) => {
  applyCapacityMiddleware(app, repos);

  app.use((err: Error, req, res, next) => {

    if (err instanceof UnauthorizedError) {
      res.sendStatus(401);
    } else {
      next(err);
    }
  });

  const port = process.env.port || 3337;
  
  const server = app.listen(port, () => {
    logger.info(`Listening at http://localhost:${port}`);
  });
  server.on('error', 
    (err) => logger.error(`Error encountered in server: ${err}`));
});

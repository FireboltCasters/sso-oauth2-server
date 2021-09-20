import express, {Express} from 'express';
import RouterHelper from './Router';
import session from 'express-session';
// @ts-ignore
import engine from 'ejs-mate';
import morgan from 'morgan';
import EnvironmentCredentials from './EnvironmentCredentials';
import Authentification from './Authentification';

type AuthCallbackFunctionType = (
  body: any,
  client_id: string,
  scope: string,
  query: any
) => any;

export default class SsoAuth2Server {
  private app: Express;

  constructor(
    redirectMode: boolean,
    port: number,
    route: string,
    session_secret: string,
    jwt_secret: string,
    authMethod: AuthCallbackFunctionType,
    requiredLoginParams: any
  ) {
    this.app = express();
    EnvironmentCredentials.REDIRECT_MODE = redirectMode;
    EnvironmentCredentials.PORT = port;
    EnvironmentCredentials.ROUTE = route;
    EnvironmentCredentials.SESSION_SECRET = session_secret;
    EnvironmentCredentials.SYMETRIC_JWT_TOKEN = jwt_secret;
    Authentification.AUTH_METHOD = authMethod;
    Authentification.REQUIRED_PARAMS = requiredLoginParams;
    this.configure();
  }

  start() {
    this.app.listen(EnvironmentCredentials.PORT, () => {
      console.info(
        `sso-server listening on port ${EnvironmentCredentials.PORT}`
      );
    });
  }

  private configure() {
    this.configureMiddlewares();
    this.configureRouter();
    this.configureErrorHandler();
  }

  private configureMiddlewares() {
    this.configureSesseion();
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.engine('ejs', engine);
    this.app.set('views', __dirname + '/views');
    this.app.set('view engine', 'ejs');
  }

  private configureSesseion() {
    this.app.use(
      session({
        secret: EnvironmentCredentials.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: 'none',
          maxAge: 60 * 60 * 24 * 1000,
        },
      })
    );
  }

  private configureRouter() {
    const router = express.Router();
    RouterHelper.configure(router);
    this.app.use(EnvironmentCredentials.ROUTE, router);
  }

  private configureErrorHandler() {
    this.configure404Error();
    this.configureInternalErrorHandler();
  }

  private configure404Error() {
    this.app.use((req, res, next) => {
      // catch 404 and forward to error handler
      const err = new Error('Resource Not Found');
      // @ts-ignore
      err.status = 404;
      next(err);
    });
  }

  private configureInternalErrorHandler() {
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.error({
        message: err.message,
        error: err,
      });
      const statusCode = err.status || 500;
      let message = err.message || 'Internal Server Error';

      if (statusCode === 500) {
        message = 'Internal Server Error';
      }
      res.status(statusCode).json({message});
    });
  }
}

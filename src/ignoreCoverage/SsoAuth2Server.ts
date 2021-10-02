import express, {Express, Router} from 'express';
import RouterHelper from './Router';
import session from 'express-session';
// @ts-ignore
import engine from 'ejs-mate';
import morgan from 'morgan';
import EnvironmentCredentials from './EnvironmentCredentials';
import Authentification from './Authentification';
import cors from 'cors';
import StorageHelper from './StorageHelper';

type AuthCallbackFunctionType = (
  body: any,
  client_id: string,
  scope: string,
  query: any
) => any;

export default class SsoAuth2Server {
  static ROUTE_LOGIN = 'login';
  static ROUTE_AUTHPARAMS = 'authParams';
  static ROUTE_VERIFYTOKEN = 'verifytoken';
  static ROUTE_GETPROFILE = 'getProfile';

  static PARAM_REDIRECT_URI = 'redirect_uri';
  static PARAM_RESPONSE_TYPE = 'response_type';
  static PARAM_STATE = 'state';

  private app: Express;
  private router: Router | undefined;

  constructor(
      providerName: string,
    redirectMode: boolean,
    port: number,
    route: string,
    session_secret: string,
    jwt_secret: string,
    authMethod: AuthCallbackFunctionType,
    requiredLoginParams: any
  ) {
    this.app = express();
    EnvironmentCredentials.PROVIDER_NAME = providerName;
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

  registerService(origin: string, appName: string, secret: string) {
    StorageHelper.setOriginAppName(origin, appName);
    StorageHelper.setAppTokenSecret(appName, secret);
    StorageHelper.setAllowOrigin(origin, true);
  }

  getExpressApp() {
    return this.app;
  }

  getRouter() {
    return this.router;
  }

  private configure() {
    this.configureMiddlewares();
    this.configureRouter();
    this.configureErrorHandler();
  }

  private allowCrossDomain(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
  }

  private configureMiddlewares() {
    this.configureSesseion();
    this.app.use(cors());
    this.app.use(this.allowCrossDomain.bind(null));
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
    this.router = router;
    RouterHelper.configure(router);
    this.app.use(EnvironmentCredentials.ROUTE, router);
  }

  private configureErrorHandler() {
    this.configureCorsHandler();
    this.configure404Error();
    this.configureInternalErrorHandler();
  }

  private configureCorsHandler() {
    this.app.use((req: any, res: any, next: any) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      res.set(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, X-Auth-Token'
      );
      next();
    });
  }

  private fullUrl(req: any) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
  }

  getAllRegisteredRoutes() {
    let router = this.router || {stack: []};
    let stack = router.stack;
    let routes: string[] = [];

    for (let layer of stack) {
      routes.push(EnvironmentCredentials.ROUTE + layer.route.path);
    }
    return routes;
  }

  private configure404Error() {
    this.app.use((req, res, next) => {
      // catch 404 and forward to error handler
      let registeredRoutes = this.getAllRegisteredRoutes();
      const url = this.fullUrl(req);
      const err = new Error('Resource Not Found under: ' + url);
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
      res.set('Access-Control-Allow-Origin', '*');
      res.status(statusCode).json({message});
    });
  }
}

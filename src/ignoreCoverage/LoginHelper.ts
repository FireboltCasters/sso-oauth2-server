import StorageHelper from './StorageHelper';
import Authentification from './Authentification';
import EnvironmentCredentials from './EnvironmentCredentials';
import SsoAuth2Server from "./SsoAuth2Server";

const URL = require('url').URL;

export default class LoginHelper {
  static async handleGetAuthParams(req: any, res: any, next: any) {
    let params = Authentification.getRequiredParams();
    res.set('Access-Control-Allow-Origin', '*');
    return res.status(200).json({params: params});
  }

  static async handleCredentialsPassed(req: any, res: any, next: any) {
    try {
      const dataToStore = await Authentification.handleAuth(
        req.body,
        req.query.client_id,
        req.query.scope,
        req.query
      );
      LoginHelper.handleSuccessfullAuthentification(
        req,
        res,
        next,
        dataToStore
      );
    } catch (err) {
      console.log('doLogin failed');
      console.log(err);
    }
  }

  static handleSuccessfullAuthentification(
    req: any,
    res: any,
    next: any,
    dataToStore: any
  ) {
    // else redirect
    const {redirect_uri} = req.query;
    const id = StorageHelper.generateRandomToken();
    StorageHelper.storeUser(id, dataToStore);

    //TODO check if this is needed
    req.session.user = id;
    if (redirect_uri == null) {
      res.set('Access-Control-Allow-Origin', '*');
      return res.redirect('/');
    }

    return LoginHelper.redirectUserToCallbackURL(req, res, id);
  }

  static redirectUserToCallbackURL(req: any, res: any, id: string) {
    const redirect_uri = req.query[SsoAuth2Server.PARAM_REDIRECT_URI];
    const url = new URL(redirect_uri);
    const intrmid = StorageHelper.generateRandomToken();
    StorageHelper.storeApplicationInCache(url.origin, id, intrmid);
    let redirectURL = `${redirect_uri}?`; //set to redirectURL
    redirectURL += `${req.query[SsoAuth2Server.PARAM_RESPONSE_TYPE]}=${intrmid}&`; //set responsetype
    redirectURL += `${SsoAuth2Server.PARAM_STATE}=${req.query[SsoAuth2Server.PARAM_STATE]}`; //set state
    if (EnvironmentCredentials.REDIRECT_MODE) {
      res.set('Access-Control-Allow-Origin', '*');
      return res.redirect(redirectURL);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      return res.status(200).json({redirectURL: redirectURL});
    }
  }
}

import StorageHelper from './StorageHelper';
import Authentification from './Authentification';
import EnvironmentCredentials from './EnvironmentCredentials';

const URL = require('url').URL;

export default class LoginHelper {
  static async handleCredentialsPassed(req: any, res: any, next: any) {
    console.log('doLogin');
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
      return res.redirect('/');
    }

    return LoginHelper.redirectUserToCallbackURL(req, res, id);
  }

  static redirectUserToCallbackURL(req: any, res: any, id: string) {
    const {redirect_uri} = req.query;
    const url = new URL(redirect_uri);
    const intrmid = StorageHelper.generateRandomToken();
    StorageHelper.storeApplicationInCache(url.origin, id, intrmid);
    let redirectURL = `${redirect_uri}?${req.query.response_type}=${intrmid}&state=${req.query.state}`;
    if (EnvironmentCredentials.REDIRECT_MODE) {
      return res.redirect(redirectURL);
    } else {
      return res.status(200).json({redirectURL: redirectURL});
    }
  }
}

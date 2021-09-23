import StorageHelper from './StorageHelper';
import LoginHelper from './LoginHelper';

const URL = require('url').URL;

export default class LoginView {
  static handleRenderLoginView(req: any, res: any, next: any) {
    // The req.query will have the redirect url where we need to redirect after successful
    // login and with sso token.
    // This can also be used to verify the origin from where the request has came in
    // for the redirection

    const {redirect_uri} = req.query;
    // direct access will give the error inside new URL.
    if (redirect_uri != null) {
      const url = new URL(redirect_uri);

      if (!StorageHelper.isAllowedOrigin(url.origin)) {
        return res
          .status(400)
          .json({message: 'Your are not allowed to access the sso-server'});
      }
    }

    if (req.session.user != null) {
      if (redirect_uri == null) {
        return res.redirect('/');
      } else {
        // if global session already has the user directly redirect with the token
        const id = req.session.user;
        return LoginHelper.redirectUserToCallbackURL(req, res, id);
      }
    }

    return res.render('login', {
      title: 'SSO-Server | Login',
    });
  }
}

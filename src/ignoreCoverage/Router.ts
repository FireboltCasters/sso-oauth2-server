import TokenVerifier from './TokenVerifier';
import ProfileHelper from './ProfileHelper';
import LoginView from './LoginView';
import LoginHelper from './LoginHelper';
import SsoAuth2Server from './SsoAuth2Server';

export default class Router {
  static configure(router: any) {
    router
      .route('/' + SsoAuth2Server.ROUTE_AUTHPARAMS)
      .get(LoginHelper.handleGetAuthParams.bind(null));
    router
      .route('/' + SsoAuth2Server.ROUTE_LOGIN)
      .options((req: any, res: any, next: any) => {})
      .get(LoginView.handleRenderLoginView.bind(null))
      .post(LoginHelper.handleCredentialsPassed.bind(null));

    router.post(
      '/' + SsoAuth2Server.ROUTE_VERIFYTOKEN,
      TokenVerifier.verifySsoToken.bind(null)
    );
    router.get(
      '/' + SsoAuth2Server.ROUTE_GETPROFILE,
      ProfileHelper.getProfile.bind(null)
    );
  }
}

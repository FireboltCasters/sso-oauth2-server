import TokenVerifier from './TokenVerifier';
import ProfileHelper from './ProfileHelper';
import LoginView from './LoginView';
import LoginHelper from './LoginHelper';

export default class Router {
  static configure(router: any) {
    router.route('/authParams').get(LoginHelper.handleGetAuthParams.bind(null));
    router
      .route('/login')
      .options((req: any, res: any, next: any) => {})
      .get(LoginView.handleRenderLoginView.bind(null))
      .post(LoginHelper.handleCredentialsPassed.bind(null));

    router.post('/verifytoken', TokenVerifier.verifySsoToken.bind(null));
    router.get('/getProfile', ProfileHelper.getProfile.bind(null));
  }
}

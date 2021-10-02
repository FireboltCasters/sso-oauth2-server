import TokenHelper from './TokenHelper';
import TokenVerifier from './TokenVerifier';
import EnvironmentCredentials from './EnvironmentCredentials';

type CallbackFunctionAnyReturn = (
  req: any,
  res: any,
  next: any,
  payload: any,
  provider: any
) => any;

export default class ProfileHelper {
  static CUSTOM_GET_PROFILE_METHOD: CallbackFunctionAnyReturn;

  static extractToken(req: any) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === TokenVerifier.BEARER
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

  static async getProfile(req: any, res: any, next: any) {
    let token = ProfileHelper.extractToken(req);
    const payload = await TokenHelper.decodeJWT(token);
    const provider = EnvironmentCredentials.PROVIDER_NAME;

    if (!!ProfileHelper.CUSTOM_GET_PROFILE_METHOD) {
      return ProfileHelper.CUSTOM_GET_PROFILE_METHOD(
        req,
        res,
        next,
        payload,
        provider
      );
    } else {
      let email = payload.user.email;

      //decodeJwtToken
      return res
        .status(200)
        .json({email: email, provider: provider, payload: payload});
    }
  }
}

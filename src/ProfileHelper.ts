import TokenHelper from './TokenHelper';
import TokenVerifier from './TokenVerifier';

type CallbackFunctionAnyReturn = (
  body: any,
  client_id: string,
  scope: string,
  query: any
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
    console.log('getProfile');
    console.log('req.headers: ', req.headers);
    const token = ProfileHelper.extractToken(req);
    console.log('token: ', token);
    const payload = await TokenHelper.decodeJWT(token);
    console.log('Payload: ', payload);

    if (ProfileHelper.CUSTOM_GET_PROFILE_METHOD) {
      return ProfileHelper.CUSTOM_GET_PROFILE_METHOD(req, res, next, payload);
    } else {
      const email = payload.user.email;

      //decodeJwtToken
      return res.status(200).json({email: email});
    }
  }
}

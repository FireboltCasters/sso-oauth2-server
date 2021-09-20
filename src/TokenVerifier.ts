import StorageHelper from './StorageHelper';
import TokenHelper from './TokenHelper';

export default class TokenVerifier {
  static readonly BEARER = 'Bearer';

  static async verifySsoToken(req: any, res: any, next: any) {
    console.log('handle verifySsoToken');
    console.log(req.body);

    const appToken = TokenVerifier.getClientSecret(req);
    const ssoToken = TokenVerifier.getClientCode(req);
    // if the application token is not present or ssoToken request is invalid
    // if the ssoToken is not present in the cache some is
    // smart.
    if (TokenVerifier.areParamsMissing(appToken, ssoToken)) {
      return TokenVerifier.responseWithBadRequest(res);
    } else {
      if (StorageHelper.isAuthorizedToGetPayload(ssoToken, appToken)) {
        return TokenVerifier.responseToAuthorizedAccesstokenRequest(
          res,
          ssoToken
        );
      } else {
        return TokenVerifier.responseWithUnauthoried(res);
      }
    }
  }

  static areParamsMissing(appToken: string, ssoToken: string) {
    return (
      appToken == null ||
      ssoToken == null ||
      StorageHelper.getContentFromIntrmCache(ssoToken) == null
    );
  }

  static getClientCode(req: any) {
    return req.body.code;
  }

  static getClientSecret(req: any) {
    return req.body.client_secret;
  }

  static responseWithBadRequest(res: any) {
    return res.status(400).json({message: 'badRequest'});
  }

  static responseWithUnauthoried(res: any) {
    return res.status(403).json({message: 'Unauthorized'});
  }

  static async responseToAuthorizedAccesstokenRequest(
    res: any,
    ssoToken: string
  ) {
    console.log('Generate Payload');
    // checking if the token passed has been generated
    const payload = TokenVerifier.generatePayload(ssoToken);
    const token = await TokenHelper.genJwtToken(payload);
    StorageHelper.deleteIntrmToken(ssoToken); // delete the itremCache key for no futher use,
    console.log('Response with token');
    return TokenVerifier.responseWithAccessToken(res, token);
  }

  static generatePayload(ssoToken: string) {
    const globalSessionToken =
      StorageHelper.getGlobalSesionTokenFromIntrm(ssoToken);
    const appName = StorageHelper.getAppnameFromIntrm(ssoToken);
    const user = StorageHelper.getUser(globalSessionToken);
    const payload = {
      ...{
        user,
        // global SessionID for the logout functionality.
        globalSessionID: globalSessionToken,
      },
    };
    return payload;
  }

  static responseWithAccessToken(res: any, token: string) {
    return res.status(200).json({
      token_type: TokenVerifier.BEARER,
      expires_in: TokenHelper.TOKEN_EXPIRATION,
      access_token: token,
    });
  }
}

type AuthCallbackFunctionType = (
  body: any,
  client_id: string,
  scope: string,
  query: any
) => any;

export default class Authentification {
  static AUTH_METHOD: AuthCallbackFunctionType;
  static REQUIRED_PARAMS: any;

  static getRequiredParams() {
    return Authentification.REQUIRED_PARAMS;
  }

  static async handleAuth(
    body: any,
    client_id: string,
    scope: string,
    query: any
  ) {
    if (Authentification.AUTH_METHOD) {
      return await Authentification.AUTH_METHOD(body, client_id, scope, query);
    }
  }
}

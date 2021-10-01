const uuidv4 = require('uuid/v4');
const Hashids = require('hashids');
const hashids = new Hashids();

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, '');
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

// A temporary cache to store all the application that has login using the current session.
// It can be useful for various audit purpose
const sessionUser: {[id: string]: any} = {};
const sessionApp: {[id: string]: any} = {};

// these token are for the validation purpose
const intrmTokenCache: {[id: string]: any[]} = {};

export default class StorageHelper {
  static ORIGIN_WILDCARD = 'public';

  static originAppName: {[key: string]: string} = {};

  static setOriginAppName(origin: string, appName: string) {
    if (!appName) {
      //undefined or null
      delete StorageHelper.originAppName[origin];
    } else {
      StorageHelper.originAppName[origin] = appName;
    }
  }

  static isAppOriginRegistered(origin: string) {
    return !!StorageHelper.originAppName[origin];
  }

  // app token to validate the request is coming from the authenticated server only.
  static appTokenDB: {[appName: string]: string} = {};

  static setAppTokenSecret(appName: string, secret: string) {
    if (!secret) {
      //undefined or null
      delete StorageHelper.appTokenDB[appName];
    } else {
      StorageHelper.appTokenDB[appName] = secret;
    }
  }

  static allowOrigin: {[origin: string]: boolean} = {};

  static setAllowOrigin(origin: string, allowed: boolean) {
    if (allowed) {
      StorageHelper.allowOrigin[origin] = true;
    } else {
      delete StorageHelper.allowOrigin[origin];
    }
  }

  static generateRandomToken(): string {
    return encodedId();
  }

  static storeUser(id: string, user: any) {
    sessionUser[id] = user;
  }

  static getUser(id: string) {
    return sessionUser[id];
  }

  static storeApplicationInCache(
    origin: string,
    id: string,
    intrmToken: string
  ) {
    if (
      !StorageHelper.isAppOriginRegistered(origin) &&
      StorageHelper.isAppOriginRegistered(StorageHelper.ORIGIN_WILDCARD)
    ) {
      origin = StorageHelper.ORIGIN_WILDCARD;
    }

    if (sessionApp[id] == null) {
      sessionApp[id] = {
        [StorageHelper.originAppName[origin]]: true,
      };
    } else {
      sessionApp[id][StorageHelper.originAppName[origin]] = true;
    }
    StorageHelper.fillIntrmTokenCache(origin, id, intrmToken);
  }

  static isSessionTokenAllowedForAppName(
    globalSessionToken: string,
    appName: string
  ) {
    return !!sessionApp[globalSessionToken][appName];
  }

  static isApptokenInTokeDB(appToken: string, appName: string) {
    return appToken === StorageHelper.appTokenDB[appName];
  }

  static isAuthorizedToGetPayload(ssoToken: string, appToken: string) {
    const appName = StorageHelper.getAppnameFromIntrm(ssoToken);
    const globalSessionToken =
      StorageHelper.getGlobalSesionTokenFromIntrm(ssoToken);

    return (
      StorageHelper.isApptokenInTokeDB(appToken, appName) &&
      StorageHelper.isSessionTokenAllowedForAppName(globalSessionToken, appName)
    );
  }

  static fillIntrmTokenCache(origin: string, id: string, intrmToken: string) {
    intrmTokenCache[intrmToken] = [id, StorageHelper.originAppName[origin]];
  }

  static getContentFromIntrmCache(ssoToken: string) {
    return intrmTokenCache[ssoToken];
  }

  static getGlobalSesionTokenFromIntrm(ssoToken: string) {
    return StorageHelper.getContentFromIntrmCache(ssoToken)[0];
  }

  static getAppnameFromIntrm(ssoToken: string) {
    return StorageHelper.getContentFromIntrmCache(ssoToken)[1];
  }

  static deleteIntrmToken(ssoToken: string) {
    delete intrmTokenCache[ssoToken];
  }

  static isAllowedOrigin(urlOrigin: string) {
    if (StorageHelper.allowOrigin['*']) {
      return true;
    }
    return StorageHelper.allowOrigin[urlOrigin];
  }
}

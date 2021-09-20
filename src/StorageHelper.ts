const uuidv4 = require("uuid/v4");
const Hashids = require("hashids");
const hashids = new Hashids();


const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

// A temporary cahce to store all the application that has login using the current session.
// It can be useful for variuos audit purpose
const sessionUser: { [id: string]: any} = {};
const sessionApp: { [id: string]: any} = {};

// these token are for the validation purpose
const intrmTokenCache: {[id: string]: any[]} = {};

export default class StorageHelper {


    static originAppName: {[key: string]: string} = {
        "http://192.168.178.35:8055": "sso_consumer",
        "http://192.168.178.35": "simple_sso_consumer"
    };

    // app token to validate the request is coming from the authenticated server only.
    static appTokenDB: {[appName: string]: string} = {
        "sso_consumer": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL",
        "simple_sso_consumer": "l1Q7zkOL59cRqWBkQ12ZiGVW2DBL"
    };

    static alloweOrigin: {[origin: string]: boolean} = {
        "http://localhost": true,
        "127.0.0.1": true,
        "http://192.168.178.35:8055": true,
        "http://192.168.178.35": true,
    };


    static generateRandomToken(): string{
        return encodedId();
    }

    static storeUser(id: string, user: any){
        sessionUser[id] = user;
    }

    static getUser(id: string){
        return sessionUser[id];
    }

    static storeApplicationInCache(origin: string, id: string, intrmToken: string){
        if (sessionApp[id] == null) {
            sessionApp[id] = {
                [StorageHelper.originAppName[origin]]: true
            };
            StorageHelper.fillIntrmTokenCache(origin, id, intrmToken);
        } else {
            sessionApp[id][StorageHelper.originAppName[origin]] = true;
            StorageHelper.fillIntrmTokenCache(origin, id, intrmToken);
        }
    }

    static isSessionTokenAllowedForAppName(globalSessionToken: string, appName: string){
        return !!sessionApp[globalSessionToken][appName]
    }

    static isApptokenInTokeDB(appToken: string, appName: string){
        return appToken === StorageHelper.appTokenDB[appName];
    }

    static isAuthorizedToGetPayload(ssoToken: string, appToken: string){
        const appName = StorageHelper.getAppnameFromIntrm(ssoToken);
        const globalSessionToken = StorageHelper.getGlobalSesionTokenFromIntrm(ssoToken);

        return (StorageHelper.isApptokenInTokeDB(appToken,appName) &&
            StorageHelper.isSessionTokenAllowedForAppName(globalSessionToken, appName));
    }

    static fillIntrmTokenCache(origin: string, id: string, intrmToken: string) {
        intrmTokenCache[intrmToken] = [id, StorageHelper.originAppName[origin]];
    }

    static getContentFromIntrmCache(ssoToken: string){
        return intrmTokenCache[ssoToken];
    }

    static getGlobalSesionTokenFromIntrm(ssoToken: string){
        return StorageHelper.getContentFromIntrmCache(ssoToken)[0]
    }

    static getAppnameFromIntrm(ssoToken: string){
        return StorageHelper.getContentFromIntrmCache(ssoToken)[1]
    }

    static deleteIntrmToken(ssoToken: string){
        delete intrmTokenCache[ssoToken];
    }

    static isAllowedOrigin(urlOrigin: string){
        return StorageHelper.alloweOrigin[urlOrigin];
    }


}

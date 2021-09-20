/* istanbul ignore file */
import SsoAuth2Server from "../SsoAuth2Server";
import Logger from "../Logger";
import {Connector, UrlHelper} from "studip-api";

const STUDIP_AUTH_METHOD = async (body, client_id, scope, query) => {
    Logger.log("Authentification: start");
    const username = body.username;
    const password = body.password;

    const domain = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

    try{
        const client = await Connector.getClient(domain, username, password);
        const user = client.getUser();
        Logger.log("Authentification: success");
        Logger.log(user);
        return user;
    } catch (err){
        Logger.log("Authentification: error");
        Logger.log(err);
        throw new Error("Credentails incorrect");
    }
}

const requiredLoginParams = {
    username: "string",
    password: "password"
}

const port = 3010;
const route = "/studip";
const sessionSecret = "keyboard cat";
const jwtSecret = "MySuperSecret";
let ssoServer = new SsoAuth2Server(port, route, sessionSecret, jwtSecret, STUDIP_AUTH_METHOD, requiredLoginParams);
ssoServer.start();
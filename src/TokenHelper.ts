import EnvironmentCredentials from "./EnvironmentCredentials";
const jwt = require("jsonwebtoken");

export default class TokenHelper {

    static TOKEN_EXPIRATION = "1h";

    static decodeJWT(token: string): any{
        return jwt.verify(token, EnvironmentCredentials.SYMETRIC_JWT_TOKEN);
    }

    static async genJwtToken(payload: any): Promise<string> {
        return new Promise((resolve, reject) => {
            // some of the libraries and libraries written in other language,
            // expect base64 encoded secrets, so sign using the base64 to make
            // jwt useable across all platform and langauage.
            jwt.sign(
                {...payload},
                EnvironmentCredentials.SYMETRIC_JWT_TOKEN,
                {
                    expiresIn: TokenHelper.TOKEN_EXPIRATION,
                },
                (err: any, token: string) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(token);
                }
            );
        });
    }
}

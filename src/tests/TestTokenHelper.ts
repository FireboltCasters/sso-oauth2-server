import EnvironmentCredentials from "../EnvironmentCredentials";
import TokenHelper from "../TokenHelper";

test('Decode and Encode will give input', async () => {
    EnvironmentCredentials.SYMETRIC_JWT_TOKEN = "Hallo";
    const payload = "Payload"
    expect(TokenHelper.decodeJWT(await TokenHelper.genJwtToken(payload))).toBe(payload);
});

test('Encode is not input', async () => {
    EnvironmentCredentials.SYMETRIC_JWT_TOKEN = "Hallo";
    const payload = "Payload"
    expect(await TokenHelper.genJwtToken(payload)).not.toBe(payload);
});

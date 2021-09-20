import EnvironmentCredentials from '../EnvironmentCredentials';
import TokenHelper from '../TokenHelper';

test('Decode and Encode will give input', async () => {
    EnvironmentCredentials.SYMETRIC_JWT_TOKEN = "Hallo";
    const payload = {data: "Payload"}
    let encoded = await TokenHelper.genJwtToken(payload);
    let decoded = TokenHelper.decodeJWT(encoded);
    expect(decoded.data).toBe(payload.data);
});

test('Encode is not input', async () => {
    EnvironmentCredentials.SYMETRIC_JWT_TOKEN = "Hallo";
    const payload = {data: "Payload"}
    let encoded = await TokenHelper.genJwtToken(payload);
    expect(encoded).not.toBe(payload.data);
});

//import { KJUR } from "./jsrsasign.js";
export class ClaimSet {
    constructor(scopes, issuerEmail) {
        this.scopes = scopes;
        this.issuerEmail = issuerEmail;
        //this.audienceURL = "https://accounts.google.com/o/oauth2/token";
        this.audienceURL = "https://www.googleapis.com/oauth2/v4/token";
        this.duration = 60 * 60 * 1000;
    }
    ToSpecClaimSet() {
        const issuedAtTime = this.issuedAtTime || Date.now();
        const expireAtTime = issuedAtTime + this.duration;
        return {
            scope: this.scopes.join(" "),
            iss: this.issuerEmail,
            sub: this.delegationEmail,
            aud: this.audienceURL,
            iat: Math.floor(issuedAtTime / 1000),
            exp: Math.floor(expireAtTime / 1000),
        };
    }
}
function GetAssertion(claimSet, privateKey) {
    var header = { alg: "RS256", typ: "JWT" };
    //let jws = new KJUR.jws.JWS();
    /*const prv = KEYUTIL.getKey(privateKey);
    return KJUR.jws.JWS.sign(header.alg, header, claimSet, prv);*/
    return KJUR.jws.JWS.sign(header.alg, header, claimSet.ToSpecClaimSet(), privateKey);
}
export const claimSetPlusPK_cachedData = {};
export async function GetAccessToken(claimSet, privateKey) {
    const claimSetPlusPK_json = JSON.stringify({ claimSet, privateKey });
    // if access-token is not cached, or cached token is expired (expires after 60m, but we get new one at 59m to be safe)
    const cachedData = claimSetPlusPK_cachedData[claimSetPlusPK_json];
    if (cachedData == null || Date.now() - cachedData.cacheTime > 59 * 60 * 1000) {
        var assertion = GetAssertion(claimSet, privateKey);
        const response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
            method: "POST",
            headers: {
                //"content-type": "application/x-www-form-urlencoded",
                "content-type": "application/json",
            },
            //body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
            body: JSON.stringify({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion,
            }),
        });
        const responseJSON = await response.json();
        console.log(`Got access token: ${responseJSON.access_token}`);
        claimSetPlusPK_cachedData[claimSetPlusPK_json] = { accessToken: responseJSON.access_token, cacheTime: Date.now() };
    }
    return claimSetPlusPK_cachedData[claimSetPlusPK_json].accessToken;
}
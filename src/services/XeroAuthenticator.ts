import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import * as microsoftTeams from '@microsoft/teams-js';

export interface IXeroCodeResponse {
    grantType: string;
    clientId: string;
    redirectUri: string;
    codeVerifier: string;
    code: string;
    scopes: string[];
    expiresOn: string;
}

export interface IXeroAccessTokenResponse {
    accessToken: string;
    expiresIn: number;
    obtained: string;
    idToken: string;
    scopes: string[];
    tokenType: string;
}

export class XeroAuthenticator {

    private urlHostname: string;

    constructor(protected url: string, protected clientId: string, protected httpClent: HttpClient) {
        this.urlHostname = this.url.substr(0, this.url.indexOf('/', 9));
    }

    public getAccessToken(): Promise<string> {
        
        const currentAccessToken = this.currentAccessToken();

        if (currentAccessToken && currentAccessToken.accessToken) {
            return Promise.resolve(currentAccessToken.accessToken);
        }
        
        return new Promise<string>((resolve, reject) => {

            const authenticatePromise: Promise<boolean> = this.authenticateNotExpired() ?
                Promise.resolve(true)
                : this.authenticate();


            authenticatePromise.then(success => {

                const xeroResponse: IXeroCodeResponse = JSON.parse(window.sessionStorage.getItem(`Xero:AuthCode:${this.clientId}`));

                if (success) {

                    this.httpClent.post(`${this.urlHostname}/xero-identity/connect/token`, HttpClient.configurations.v1, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `grant_type=${xeroResponse.grantType}`
                            + `&client_id=${xeroResponse.clientId}`
                            + `&code=${xeroResponse.code}`
                            + `&redirect_uri=${xeroResponse.redirectUri}`
                            + `&code_verifier=${xeroResponse.codeVerifier}`
                    }).then((response: HttpClientResponse) => {
                        if (!response.ok) {
                            window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
                            reject(`GetAccessTokenFailedStatus${response.status}`);
                            return;
                        }
                        response.json().then((json: any) => {
                            if (json['access_token']) {
                                const xeroTokenResponse: IXeroAccessTokenResponse = {
                                    accessToken: json['access_token'],
                                    expiresIn: json['expires_in'],
                                    obtained: new Date().toISOString(),
                                    idToken: json["id_token"],
                                    scopes: (json['scope'] || "").split(" "),
                                    tokenType: json["token_type"]
                                };
                                window.sessionStorage.setItem(`Xero:AccessToken:${this.clientId}`, JSON.stringify(xeroTokenResponse));
                                resolve(xeroTokenResponse.accessToken);
                            }
                        }, (reason) => {
                            window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
                            reject(`GetAccessTokenFailedJson`);
                            return;
                        });
                    }).catch((reason: any) => {
                        window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
                        reject(`GetAccessTokenFailedError`);
                    });
        
                }
                else {
                    window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
                    reject(`AuthenticateFailed`);
                }
            }).catch(reason => {
                window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
                reject(reason);
            });

        });
    }

    public currentAccessToken(): IXeroAccessTokenResponse | null {
        const accessTokenString = window.sessionStorage.getItem(`Xero:AccessToken:${this.clientId}`);
        if (accessTokenString) {
            try {
                const accessToken: IXeroAccessTokenResponse = JSON.parse(accessTokenString);
                if (!accessToken.expiresIn || !accessToken.obtained) {
                    return null;
                }
                if (new Date(accessToken.obtained).getTime() + (accessToken.expiresIn * 1000) > (new Date().getTime())) {
                    return accessToken;
                }
                return null;
            }
            catch {
                return null;
            }
        }
        else {
            return null;
        }
    }

    public authenticateNotExpired(): boolean {
        try {
            const xeroResponse: IXeroCodeResponse = JSON.parse(window.sessionStorage.getItem(`Xero:AuthCode:${this.clientId}`));
            if (!xeroResponse.expiresOn) {
                return false;
            }
            else {
                return (new Date(xeroResponse.expiresOn).getTime() > new Date().getTime());
            }
        }
        catch {
            return false;
        }
    }
    
    public authenticate(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            microsoftTeams.initialize(() => {

                const teamsAuthParams: microsoftTeams.authentication.AuthenticateParameters = {
                    url: this.url,
                    width: 640,
                    height: 800,
                    successCallback: (result: string) => {

                        const xeroResponse: IXeroCodeResponse = JSON.parse(result);
                        xeroResponse.expiresOn = new Date((new Date()).getTime() + (30*60*1000)).toISOString(); // current time plus 30 minutes
                        window.sessionStorage.setItem(`Xero:AuthCode:${this.clientId}`, JSON.stringify(xeroResponse));

                        if (xeroResponse.clientId !== this.clientId) {
                            reject(`ClientIdDoesNotMatch`);
                            return;
                        }
                        resolve(true);
                    },
                    failureCallback: (reason: string) => {
                        console.log(`failureCallback(${reason})`);
                        reject(reason);
                    }
                };

                microsoftTeams.authentication.authenticate(teamsAuthParams);

            }, [this.urlHostname]);

        });

    }

    public async signout(): Promise<boolean> {
        window.sessionStorage.removeItem(`Xero:AuthCode:${this.clientId}`);
        window.sessionStorage.removeItem(`Xero:AccessToken:${this.clientId}`);
        return true;
    }

}

import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import * as microsoftTeams from '@microsoft/teams-js';

export interface IServiceNowAccessTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresOn: string;
    obtained?: string;
    scopes: string[];
    clientId: string;
    tokenType: string;
}

export class ServiceNowAuthenticator {

    private urlHostname: string;
    private storageKey: string;

    constructor(protected url: string, protected snowInstance: string, protected clientId: string, protected httpClent: HttpClient) {
        this.urlHostname = this.url.substr(0, this.url.indexOf('/', 9));
        this.storageKey = `ServiceNow:AccessToken:${this.snowInstance}:${this.clientId}`;
    }

    public async getAccessTokenSilently(): Promise<string | null> {
        
        let accessToken = this.currentAccessToken();
        if (accessToken) {
            return accessToken;
        }
        
        const refreshToken = this.currentRefreshToken();
        
        if (!refreshToken) {
            return null;
        }

        try {
            return await this.refreshAccessToken(refreshToken);
        }
        catch (err) {
            return null;
        }

    }

    public currentAccessToken(): string | null {
        const accessTokenString = window.localStorage.getItem(this.storageKey);
        if (accessTokenString) {
            try {
                const accessToken: IServiceNowAccessTokenResponse = JSON.parse(accessTokenString);
                if (!accessToken.expiresOn) {
                    return null;
                }
                if (new Date(accessToken.expiresOn).getTime() > (new Date().getTime())) {
                    return accessToken.accessToken;
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

    public currentRefreshToken(): string | null {
        const accessTokenString = window.localStorage.getItem(this.storageKey);
        if (accessTokenString) {
            try {
                const accessToken: IServiceNowAccessTokenResponse = JSON.parse(accessTokenString);
                return accessToken.refreshToken;
            }
            catch {
                return null;
            }
        }
        else {
            return null;
        }
    }

    public refreshAccessToken(refreshToken: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            this.httpClent.post(`${this.urlHostname}/teams/refresh/snow/${this.snowInstance}/${this.clientId}`, HttpClient.configurations.v1, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `refresh_token=${refreshToken}`
            }).then(response => {
                if (!response.ok) {
                    window.localStorage.removeItem(this.storageKey);
                    reject('Failed getting refresh token');
                    return;
                }
                response.json().then((json: any) => {
                    const currentToken: IServiceNowAccessTokenResponse = JSON.parse(window.localStorage.getItem(this.storageKey));
                    if (json['access_token']) {
                        const newToken: IServiceNowAccessTokenResponse = {
                            ...currentToken,
                            accessToken: json.access_token,
                            expiresIn: json.expires_in,
                            expiresOn: new Date((new Date()).getTime() + (json.expires_in * 1000)).toISOString() // current time plus expiresIn value in seconds
                        }
                        
                        window.localStorage.setItem(this.storageKey, JSON.stringify(newToken));
                        resolve(newToken.accessToken);
                    }
                });

            }).catch(reason => {
                window.localStorage.removeItem(this.storageKey);
                reject(reason);
            });
        
        });

    }

    public authenticatedAccessToken(): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            microsoftTeams.initialize(() => {

                const teamsAuthParams: microsoftTeams.authentication.AuthenticateParameters = {
                    url: this.url,
                    width: 460,
                    height: 590,
                    successCallback: (result: string) => {

                        const snowResponse: IServiceNowAccessTokenResponse = ServiceNowAuthenticator.translateSnowResponse(JSON.parse(result));
                        window.localStorage.setItem(this.storageKey, JSON.stringify(snowResponse));

                        if (snowResponse.clientId !== this.clientId) {
                            reject(`ClientIdDoesNotMatch`);
                            return;
                        }
                        resolve(snowResponse.accessToken);
                    },
                    failureCallback: (reason: string) => {
                        console.log(`failureCallback(${reason})`);
                        reject(reason);
                    }
                }

                microsoftTeams.authentication.authenticate(teamsAuthParams);
    
            }, [this.urlHostname]);

        });

    }
    private static translateSnowResponse(rawObject: any): IServiceNowAccessTokenResponse {
        return {
            accessToken: rawObject.access_token,
            refreshToken: rawObject.refresh_token,
            scopes: rawObject.scope.split(' '),
            clientId: rawObject.client_id,
            tokenType: rawObject.token_type,
            expiresIn: rawObject.expires_in,
            expiresOn: new Date((new Date()).getTime() + (rawObject.expires_in * 1000)).toISOString() // current time plus expiresIn value in seconds
        }
    }

}

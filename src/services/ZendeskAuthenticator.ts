import { HttpClient } from '@microsoft/sp-http';
import * as microsoftTeams from '@microsoft/teams-js';
import { ITokenResponse } from '../extensions/connectMeZendesk/components/ITokenResponse';

interface IZendeskAccessTokenResponse {
    access_token: string;
    client_id: string;
    token_type: string;
    scope: string;
}

export class ZendeskAuthenticator {
    private urlHostname: string;
    public static storageKey: string;

    constructor(protected url: string, protected zendeskInstance: string, protected clientId: string, protected httpClent: HttpClient) {
        if(zendeskInstance && clientId) {
            this.urlHostname = this.url.substring(0, this.url.indexOf('/', 9));
            ZendeskAuthenticator.storageKey = `Zendesk:AccessToken:${this.zendeskInstance}:${this.clientId}`;
        }
    }

    public authenticate(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            microsoftTeams.initialize(() => {
                const teamsAuthParams: microsoftTeams.authentication.AuthenticateParameters = {
                    url: this.url,
                    width: 460,
                    height: 590,
                    successCallback: (result: string) => {
                        const zendeskResponse: IZendeskAccessTokenResponse = JSON.parse(result);
                        if (zendeskResponse.client_id !== this.clientId) {
                            reject(`ClientIdDoesNotMatch`);
                            return;
                        }

                        if(ZendeskAuthenticator.storageKey) {
                            window.localStorage.setItem(ZendeskAuthenticator.storageKey, JSON.stringify(zendeskResponse));
                        }
                        resolve("");
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

    public async revokeAccessToken(): Promise<void> {
        const token = ZendeskAuthenticator.getAccessToken() || "";
        const tokenInfoUrl = `https://${this.zendeskInstance}.zendesk.com/api/v2/oauth/tokens/current.json`;
        const currentTokenInfo: ITokenResponse = await this.httpClent.get(tokenInfoUrl, HttpClient.configurations.v1, {headers: {"Authorization": `Bearer ${token}`}}).then(response => response.json());

        const apiUrl = `https://${this.zendeskInstance}.zendesk.com/api/v2/oauth/tokens/${currentTokenInfo.token.id}`;
        await this.httpClent.fetch(apiUrl, HttpClient.configurations.v1, {method: "DELETE", headers: {"Authorization": `Bearer ${token}`}});
        window.localStorage.removeItem(ZendeskAuthenticator.storageKey);
    }

    public isAuthenticated(): boolean {
        try {
            const zendeskTokenInfo = window.localStorage.getItem(ZendeskAuthenticator.storageKey);
            return !!JSON.parse(zendeskTokenInfo).access_token;
        } catch (error) {}
        return false;
    }

    public static getAccessToken(): string | null {
        const accessTokenString = window.localStorage.getItem(ZendeskAuthenticator.storageKey);
        if (accessTokenString) {
            try {
                const accessToken: IZendeskAccessTokenResponse = JSON.parse(accessTokenString);
                return accessToken.access_token;
            }
            catch {}
        }

        return null;
    }
}
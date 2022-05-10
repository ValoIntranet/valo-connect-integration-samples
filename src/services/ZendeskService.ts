import { HttpClient } from '@microsoft/sp-http';
import { ITicket, IZendeskTicketsResponse } from '../extensions/connectMeZendesk/components/IZendeskTicketsResponse';
import { IZendeskUserResponse } from '../extensions/connectMeZendesk/components/IZendeskUserResponse';
import { ZendeskAuthenticator } from './ZendeskAuthenticator';

export class ZendeskService {
    private apiHostname: string = "";
    private myUserId: string = "";

    constructor(protected httpClient: HttpClient, protected zendeskInstanceId: string) {
        this.apiHostname = `https://${zendeskInstanceId}.zendesk.com/api/v2`;
    }

    public async getTickets(): Promise<IZendeskTicketsResponse> {
        let userId = this.myUserId;
        if(!this.myUserId) {
            userId = await this.getMyProfile();
        }
        return this.get(`${this.apiHostname}/users/${userId}/tickets/assigned`);
    }

    public async get(query: string) {
        try {
            const response = await this.httpClient.get(
                query,
                HttpClient.configurations.v1,
                {
                    headers: this.getCurrentHeaders()
                }
            );

            if (!response.ok) {
                return;
            }

            return await response.json();
        } catch (error) {
            return;
        }
    }

    public async getMyProfile(): Promise<string> {
        const me: IZendeskUserResponse = await this.get(`${this.apiHostname}/users/me`);
        if(me) {
            this.myUserId = me.user.id.toString();
            return this.myUserId;
        }

        return Promise.reject();
    }

    protected getCurrentHeaders() {
        const accessToken = ZendeskAuthenticator.getAccessToken();

        const headers = {"Accept": "application/json"};
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        return headers;
    }
}
    
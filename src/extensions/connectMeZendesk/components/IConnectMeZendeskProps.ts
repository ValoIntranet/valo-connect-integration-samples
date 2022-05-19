import { IConnectMeZendeskConfig } from "../IConnectMeZendeskConfig";
import { ZendeskAuthenticator } from "../../../services/ZendeskAuthenticator";
import { ZendeskService } from "../../../services/ZendeskService";

export interface IConnectMeZendeskProps {
    widgetConfig: IConnectMeZendeskConfig;
    authenticator: ZendeskAuthenticator;
    zendeskService: ZendeskService;
}
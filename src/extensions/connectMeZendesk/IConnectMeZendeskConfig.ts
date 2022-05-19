import { ConnectWidgetSize } from "@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo";

export interface IConnectMeZendeskConfig {
    title?: string;
    size: ConnectWidgetSize;
    authenticationUrl: string;
    zendeskInstance: string;
    zendeskClientId: string;
}
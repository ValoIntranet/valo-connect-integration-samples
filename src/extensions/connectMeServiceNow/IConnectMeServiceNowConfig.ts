import { ConnectWidgetSize } from "@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo";

export interface IConnectMeServiceNowConfig {
    title?: string;
    size: ConnectWidgetSize;
    authenticationUrl: string;
    serviceNowClientId: string;
    serviceNowInstance: string;
}
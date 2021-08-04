import { ConnectWidgetSize } from "@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo";

export interface IConnectMeXeroConfig {
    title?: string;
    size: ConnectWidgetSize;
    authenticationUrl: string;
    xeroClientId: string;
}
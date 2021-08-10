import { IConnectMeXeroConfig } from '../IConnectMeXeroConfig';
import { HttpClient } from '@microsoft/sp-http';

export interface IConnectMeXeroProps{
    widgetConfig: IConnectMeXeroConfig;
    httpClient: HttpClient;
}
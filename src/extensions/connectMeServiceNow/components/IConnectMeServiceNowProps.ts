import { IConnectMeServiceNowConfig } from '../IConnectMeServiceNowConfig';
import { HttpClient } from '@microsoft/sp-http';

export interface IConnectMeServiceNowProps{
    widgetConfig: IConnectMeServiceNowConfig;
    httpClient: HttpClient;
}
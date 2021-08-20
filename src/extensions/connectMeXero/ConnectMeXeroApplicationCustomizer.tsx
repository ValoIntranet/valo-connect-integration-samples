import * as React from 'react';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { ConnectWidgetService } from '@valo/extensibility/lib/services/ConnectWidgetService';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo';
import { Image, LeaveIcon } from "@fluentui/react-northstar";
import { IConnectMeXeroConfig } from './IConnectMeXeroConfig';

import * as strings from 'ConnectMeXeroApplicationCustomizerStrings';
import { ConnectMeXero } from './components/ConnectMeXero';
import { ConnectMeXeroConfiguration } from './components/ConnectMeXeroConfiguration';
import { XeroAuthenticator } from '../../services/XeroAuthenticator';

const LOG_SOURCE: string = 'ConnectMeXeroApplicationCustomizer';

export interface IConnectMeXeroApplicationCustomizerProperties {
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ConnectMeXeroApplicationCustomizer
    extends BaseApplicationCustomizer<IConnectMeXeroApplicationCustomizerProperties> {

    private widgetConfig: IConnectMeXeroConfig;

    @override
    public onInit(): Promise<void> {
        
        const connectWidgetService = ConnectWidgetService.getInstance();

        connectWidgetService.registerWidget({
            title: strings.ConnectMeXeroPayslipWidgetTitle,
            id: 'valo-connect-me-xero',
            size: ConnectWidgetSize.Single,
            description: strings.ConnectMeXeroPayslipWidgetDescription,
            widgetComponentsFactory: (config: IConnectMeXeroConfig) => {
                this.widgetConfig = config;
                return [
                    {
                        id: 'valo-connect-xero-1',
                        title: 'Tab 1',
                        content: <ConnectMeXero widgetConfig={config} httpClient={this.context.httpClient} />
                    }
                ];
            },
            widgetConfigComponentFactory: (currentConfig: IConnectMeXeroConfig, onConfigUpdated: (config: IConnectMeXeroConfig) => void) => {
                return <ConnectMeXeroConfiguration onConfigurationUpdated={onConfigUpdated} config={currentConfig} />;
            },
            requiredPermissionScopes: [],
            widgetActionsFactory: (instanceId: string) => [
                {
                    id: 'xero-refresh-data',
                    title: strings.RefreshPaylsip,
                    onClick: () => {},
                    icon: <Image src={require('./components/assets/xero-logo.png')} width={24} height={24} />
                },
                {
                    id: 'xero-sign-out',
                    title: strings.SignOutFromXero,
                    onClick: () => { 
                        const authenticator = new XeroAuthenticator(this.widgetConfig.authenticationUrl, this.widgetConfig.xeroClientId, this.context.httpClient);
                        authenticator.signout();
                    },
                    icon: <LeaveIcon outline />
                }
            ]
        });

        return Promise.resolve();
    }
}

import * as React from 'react';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { ConnectWidgetService } from '@valo/extensibility/lib/services/ConnectWidgetService';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo';

import { IConnectMeXeroConfig } from './IConnectMeXeroConfig';

import * as strings from 'ConnectMeXeroApplicationCustomizerStrings';
import { ConnectMeXero } from './components/ConnectMeXero';
import { ConnectMeXeroConfiguration } from './components/ConnectMeXeroConfiguration';

const LOG_SOURCE: string = 'ConnectMeXeroApplicationCustomizer';

export interface IConnectMeXeroApplicationCustomizerProperties {
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ConnectMeXeroApplicationCustomizer
  extends BaseApplicationCustomizer<IConnectMeXeroApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    const connectWidgetService = ConnectWidgetService.getInstance();

    connectWidgetService.registerWidget({
        title: strings.ConnectMeXeroPayslipWidgetTitle,
        id: 'valo-connect-me-xero',
        size: ConnectWidgetSize.Single,
        description: strings.ConnectMeXeroPayslipWidgetDescription,
        widgetComponentsFactory: (config: IConnectMeXeroConfig) => [
            {
                id: 'valo-connect-xero-1',
                title: 'Tab 1',
                content: <ConnectMeXero widgetConfig={config} httpClient={this.context.httpClient} />
            }
        ],
        widgetConfigComponentFactory: (currentConfig: IConnectMeXeroConfig, onConfigUpdated: (config: IConnectMeXeroConfig) => void) => {
            return <ConnectMeXeroConfiguration onConfigurationUpdated={onConfigUpdated} config={currentConfig} />;
        },
        requiredPermissionScopes: []
    });

    return Promise.resolve();
  }
}

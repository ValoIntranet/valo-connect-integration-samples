import * as React from 'react';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { ConnectWidgetService } from '@valo/extensibility/lib/services/ConnectWidgetService';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo';

import { IConnectMeServiceNowConfig } from './IConnectMeServiceNowConfig';

import * as strings from 'ConnectMeServiceNowApplicationCustomizerStrings';
import { ConnectMeServiceNow } from './components/ConnectMeServiceNow';
import { ConnectMeServiceNowConfiguration } from './components/ConnectMeServiceNowConfiguration';

const LOG_SOURCE: string = 'ConnectMeServiceNowApplicationCustomizer';

export interface IConnectMeServiceNowApplicationCustomizerProperties {
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ConnectMeServiceNowApplicationCustomizer
  extends BaseApplicationCustomizer<IConnectMeServiceNowApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    const connectWidgetService = ConnectWidgetService.getInstance();

    connectWidgetService.registerWidget({
        title: strings.ConnectMeServiceNowWidgetTitle,
        id: 'valo-connect-me-service-now',
        size: ConnectWidgetSize.Single,
        description: strings.ConnectMeServiceNowWidgetDescription,
        widgetComponentsFactory: (config: IConnectMeServiceNowConfig) => [
            {
                id: 'valo-connect-service-now-1',
                title: 'Tab 1',
                content: <ConnectMeServiceNow widgetConfig={config} httpClient={this.context.httpClient} />
            }
        ],
        widgetConfigComponentFactory: (currentConfig: IConnectMeServiceNowConfig, onConfigUpdated: (config: IConnectMeServiceNowConfig) => void) => {
            return <ConnectMeServiceNowConfiguration onConfigurationUpdated={onConfigUpdated} config={currentConfig} />;
        },
        requiredPermissionScopes: []
    });

    return Promise.resolve();
  }
}

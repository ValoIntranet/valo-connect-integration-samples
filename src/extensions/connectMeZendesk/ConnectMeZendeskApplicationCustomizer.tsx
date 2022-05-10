import * as React from 'react';
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import { ConnectWidgetService } from '@valo/extensibility/lib/services/ConnectWidgetService';
import { ConnectWidgetSize } from '@valo/extensibility/lib/models/connectWidget/ConnectWidgetInfo';
import { LeaveIcon, SyncIcon } from "@fluentui/react-northstar";

import * as strings from 'ConnectMeZendeskApplicationCustomizerStrings';
import { ConnectMeZendesk } from './components/ConnectMeZendesk';
import { IConnectMeZendeskConfig } from './IConnectMeZendeskConfig';
import { ConnectMeZendeskConfiguration } from './components/ConnectMeZendeskConfiguration';
import { ZendeskAuthenticator } from '../../services/ZendeskAuthenticator';
import { ZendeskService } from '../../services/ZendeskService';


export interface IConnectMeZendeskApplicationCustomizerProperties {}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ConnectMeZendeskApplicationCustomizer extends BaseApplicationCustomizer<IConnectMeZendeskApplicationCustomizerProperties> {

  private zendeskAuthenticator: ZendeskAuthenticator;
  private zendeskService: ZendeskService;
  private zendesWidgetRef = React.createRef<{refresh: () => void, signOut: () => void}>();

  @override
  public onInit(): Promise<void> {
    const connectWidgetService = ConnectWidgetService.getInstance();

    connectWidgetService.registerWidget({
      title: strings.ConnectMeZendeskWidgetTitle,
      id: 'valo-connect-me-zendesk',
      size: ConnectWidgetSize.Single,
      description: strings.ConnectMeZendeskWidgetDescription,
      widgetComponentsFactory: (config: IConnectMeZendeskConfig) => {
        this.zendeskAuthenticator = new ZendeskAuthenticator(config.authenticationUrl || "", config.zendeskInstance, config.zendeskClientId, this.context.httpClient);
        this.zendeskService = new ZendeskService(this.context.httpClient, config.zendeskInstance);
        
        return [{
          id: "valo-connect-zendesk",
          title: 'Tab 1',
          content: <ConnectMeZendesk ref={this.zendesWidgetRef} widgetConfig={config} zendeskService={this.zendeskService} authenticator={this.zendeskAuthenticator} />
        }];
      },
      widgetConfigComponentFactory: (currentConfig: IConnectMeZendeskConfig, onConfigUpdated: (config: IConnectMeZendeskConfig) => void) => {
        return <ConnectMeZendeskConfiguration onConfigurationUpdated={onConfigUpdated} config={currentConfig} />;
      },
      widgetActionsFactory: (_instanceId: string) => {
        return[
         {
            id: "zendeskRefreshAction",
            title: strings.Refresh,
            onClick: () => { this.zendesWidgetRef.current?.refresh(); },
            icon: <SyncIcon outline />,
            wrapper: {
              className: "zendeskSignInAction"
            }
         },
         {
            id: 'zendeskSignOutAction',
            title: strings.SignOutFromZendesk,
            onClick: () => { this.zendesWidgetRef.current?.signOut(); },
            icon: <LeaveIcon outline />,
            wrapper: {
              className: "zendeskSignInAction"
            }
        }];
      },
      requiredPermissionScopes: []
    });

    return Promise.resolve();
  }
}
